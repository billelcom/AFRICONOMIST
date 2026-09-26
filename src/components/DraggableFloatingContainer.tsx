import React, { useState, useEffect, useRef, ReactNode, useCallback } from 'react';

interface DraggableFloatingContainerProps {
  initialPosition?: { x: number; y: number };
  defaultAlign?: 'right' | 'left';
  defaultBottomOffset?: number;
  isOpen?: boolean;
  children: (props: { isDragging: boolean }) => ReactNode;
  className?: string;
  zIndex?: number;
}

export const DraggableFloatingContainer: React.FC<DraggableFloatingContainerProps> = ({
  initialPosition,
  defaultAlign = 'right',
  defaultBottomOffset = 100,
  isOpen = false,
  children,
  className = '',
  zIndex = 35
}) => {
  // Position of the icon when closed
  const [iconPos, setIconPos] = useState<{ x: number; y: number } | null>(null);
  // Current active rendered position (on screen)
  const [activePos, setActivePos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    startX: number;
    startY: number;
    moved: boolean;
  }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
    moved: false
  });

  // Remember if open accordion was intentionally dragged by user while open
  const openDraggedRef = useRef<boolean>(false);

  // Initialize icon position on mount
  useEffect(() => {
    if (initialPosition) {
      setIconPos(initialPosition);
      setActivePos(initialPosition);
      return;
    }

    const calcDefaultPos = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = defaultAlign === 'right' ? Math.max(16, w - 80) : 16;
      const y = Math.max(80, h - defaultBottomOffset);
      const pos = { x, y };
      setIconPos(pos);
      setActivePos(pos);
    };

    calcDefaultPos();
    window.addEventListener('resize', calcDefaultPos);
    return () => window.removeEventListener('resize', calcDefaultPos);
  }, [defaultAlign, defaultBottomOffset, initialPosition]);

  // Helper to calculate opened position based on icon placement
  const calculateOpenedPosition = useCallback((currentIconPos: { x: number; y: number }, rectWidth: number, rectHeight: number) => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const iconCenterX = currentIconPos.x + 30;
    const ratio = iconCenterX / screenW;

    let targetX: number;
    // On mobile (< 640px) or if icon is placed in the center (between 33% and 67%):
    // Center directly on screen
    if (screenW < 640 || (ratio >= 0.33 && ratio <= 0.67)) {
      targetX = Math.max(10, Math.round((screenW - rectWidth) / 2));
    } else if (ratio > 0.67) {
      // Anchored to the right
      targetX = Math.max(10, screenW - rectWidth - 16);
    } else {
      // Anchored to the left
      targetX = 16;
    }

    // Vertically: ensure the accordion fits entirely within the viewport without overflowing
    const idealY = currentIconPos.y;
    const maxY = Math.max(65, screenH - rectHeight - 16);
    const targetY = Math.max(65, Math.min(idealY, maxY));

    return { x: targetX, y: targetY };
  }, []);

  // When isOpen changes or container size changes
  useEffect(() => {
    if (!iconPos || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const elemW = rect.width || (isOpen ? 380 : 56);
    const elemH = rect.height || (isOpen ? 350 : 56);

    if (isOpen) {
      // If user hasn't explicitly dragged the opened window, position it properly
      if (!openDraggedRef.current) {
        const nextPos = calculateOpenedPosition(iconPos, elemW, elemH);
        setActivePos(nextPos);
      } else {
        // Just clamp the existing position so it never overflows
        setActivePos((prev) => {
          if (!prev) return prev;
          const screenW = window.innerWidth;
          const screenH = window.innerHeight;
          const clampedX = Math.max(10, Math.min(prev.x, screenW - elemW - 10));
          const clampedY = Math.max(65, Math.min(prev.y, screenH - elemH - 12));
          if (clampedX === prev.x && clampedY === prev.y) return prev;
          return { x: clampedX, y: clampedY };
        });
      }
    } else {
      // Returning to closed icon: restore icon position
      openDraggedRef.current = false;
      setActivePos(iconPos);
    }
  }, [isOpen, iconPos, calculateOpenedPosition]);

  // ResizeObserver to adjust positioning if content expands (e.g. stage 1 -> stage 2)
  useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) continue;

        if (isOpen && iconPos && !openDraggedRef.current) {
          const nextPos = calculateOpenedPosition(iconPos, width, height);
          setActivePos(nextPos);
        } else if (isOpen) {
          // Re-clamp
          const screenW = window.innerWidth;
          const screenH = window.innerHeight;
          setActivePos((prev) => {
            if (!prev) return prev;
            const clampedX = Math.max(10, Math.min(prev.x, screenW - width - 10));
            const clampedY = Math.max(65, Math.min(prev.y, screenH - height - 12));
            if (clampedX === prev.x && clampedY === prev.y) return prev;
            return { x: clampedX, y: clampedY };
          });
        }
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [isOpen, iconPos, calculateOpenedPosition]);

  // Pointer drag logic
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (!activePos) return;
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      startX: activePos.x,
      startY: activePos.y,
      moved: false
    };

    const handlePointerMove = (moveEvent: MouseEvent | TouchEvent) => {
      const curX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const curY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const deltaX = curX - dragStartRef.current.mouseX;
      const deltaY = curY - dragStartRef.current.mouseY;

      if (Math.hypot(deltaX, deltaY) > 5) {
        dragStartRef.current.moved = true;
        setIsDragging(true);
      }

      if (dragStartRef.current.moved) {
        const nextX = dragStartRef.current.startX + deltaX;
        const nextY = dragStartRef.current.startY + deltaY;

        const rect = containerRef.current?.getBoundingClientRect();
        const elemWidth = rect?.width || 56;
        const elemHeight = rect?.height || 56;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const clampedX = Math.max(8, Math.min(nextX, screenW - elemWidth - 8));
        const clampedY = Math.max(50, Math.min(nextY, screenH - elemHeight - 12));

        const updatedPos = { x: clampedX, y: clampedY };
        setActivePos(updatedPos);

        if (!isOpen) {
          // If dragging the closed icon, update saved icon position
          setIconPos(updatedPos);
        } else {
          // Dragging the opened window
          openDraggedRef.current = true;
        }
      }
    };

    const handlePointerUp = () => {
      setTimeout(() => setIsDragging(false), 60);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
  };

  if (!activePos) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: `${activePos.x}px`,
        top: `${activePos.y}px`,
        zIndex,
        transition: isDragging ? 'none' : 'left 0.22s ease-out, top 0.22s ease-out'
      }}
      className={`select-none touch-none ${className}`}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.closest('button')) {
          // Don't drag if clicking buttons or form inputs
          return;
        }
        handlePointerDown(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.closest('button')) {
          return;
        }
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }}
    >
      {children({ isDragging })}
    </div>
  );
};
