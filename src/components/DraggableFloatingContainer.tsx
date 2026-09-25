import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface DraggableFloatingContainerProps {
  initialPosition?: { x: number; y: number };
  defaultAlign?: 'right' | 'left';
  defaultBottomOffset?: number;
  children: (props: { isDragging: boolean }) => ReactNode;
  className?: string;
  zIndex?: number;
}

export const DraggableFloatingContainer: React.FC<DraggableFloatingContainerProps> = ({
  initialPosition,
  defaultAlign = 'right',
  defaultBottomOffset = 100,
  children,
  className = '',
  zIndex = 35
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number; moved: boolean }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
    moved: false
  });

  // Calculate default position on client-side mount
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      return;
    }

    const updateDefaultPos = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = defaultAlign === 'right' ? Math.max(16, w - 80) : 16;
      const y = Math.max(80, h - defaultBottomOffset);
      setPosition({ x, y });
    };

    updateDefaultPos();
    window.addEventListener('resize', updateDefaultPos);
    return () => window.removeEventListener('resize', updateDefaultPos);
  }, [defaultAlign, defaultBottomOffset, initialPosition]);

  // Keep inside screen bounds if window resizes
  useEffect(() => {
    if (!position || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const maxX = window.innerWidth - (rect.width || 60) - 10;
    const maxY = window.innerHeight - (rect.height || 60) - 10;

    let newX = Math.max(10, Math.min(position.x, maxX));
    let newY = Math.max(60, Math.min(position.y, maxY));

    if (newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  }, [position]);

  const handlePointerDown = (clientX: number, clientY: number) => {
    if (!position) return;
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      startX: position.x,
      startY: position.y,
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

        const clampedX = Math.max(8, Math.min(nextX, window.innerWidth - elemWidth - 8));
        const clampedY = Math.max(50, Math.min(nextY, window.innerHeight - elemHeight - 12));

        setPosition({ x: clampedX, y: clampedY });
      }
    };

    const handlePointerUp = () => {
      setTimeout(() => setIsDragging(false), 50);
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

  if (!position) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex
      }}
      className={`select-none touch-none ${className}`}
      onMouseDown={(e) => {
        // Only trigger drag on main button or header, ignore form inputs
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
          return;
        }
        handlePointerDown(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
          return;
        }
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }}
    >
      {children({ isDragging })}
    </div>
  );
};
