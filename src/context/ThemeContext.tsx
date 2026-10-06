'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type AppTheme = 'standard' | 'light' | 'night';

export interface ThemeOption {
  id: AppTheme;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  descAr: string;
  descEn: string;
  iconName: 'standard' | 'light' | 'night';
  primaryColor: string;
  bgPreview: string;
  borderPreview: string;
  textPreview: string;
  taglineAr: string;
  taglineEn: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'standard',
    titleAr: 'الخيار القياسي (التنسيق المالي المعتمد)',
    titleEn: 'Standard Financial Theme',
    badgeAr: 'التنسيق الحالي للموقع',
    badgeEn: 'Original Bloomberg Theme',
    descAr: 'التنسيق المالي الأصلي لبلومبرغ إفريقيا؛ واجهة كحلية عميقة مع لمسات ذهبية كلاسيكية وتدرجات متناسقة لبيئة التداول والتحليل.',
    descEn: 'Classic African Bloomberg dark financial terminal aesthetic with deep navy slate and refined gold accents.',
    iconName: 'standard',
    primaryColor: '#F59E0B',
    bgPreview: '#080C14',
    borderPreview: '#1E293B',
    textPreview: '#F8FAFC',
    taglineAr: 'تنسيق بلومبرغ المالي المعتمد',
    taglineEn: 'Signature Financial Slate'
  },
  {
    id: 'light',
    titleAr: 'خيار اللون الفاتح (الصحيفة النهارية المضيئة)',
    titleEn: 'High-Contrast Daylight Theme',
    badgeAr: 'نهاري عالي التباين والوضوح',
    badgeEn: 'Crisp Editorial Paper',
    descAr: 'صحيفة ورقية اقتصادية ناصعة ومضيئة؛ ورق أبيض ناصع مع نصوص فحمية عميقة عالية التباين ولمسات برونزية دقيقة سهلة القراءة.',
    descEn: 'Pristine broadsheet paper white with deep slate-navy typography, high-contrast readable accents and zero glare.',
    iconName: 'light',
    primaryColor: '#B45309',
    bgPreview: '#F8FAFC',
    borderPreview: '#CBD5E1',
    textPreview: '#0F172A',
    taglineAr: 'أوراق المال النهارية عالية التباين',
    taglineEn: 'Daylight Editorial Broadsheet'
  },
  {
    id: 'night',
    titleAr: 'خيار اللون الليلي (نمط القراءة الليلية)',
    titleEn: 'Nocturnal OLED Reading Mode',
    badgeAr: 'حماية العين والراحة الليلية',
    badgeEn: 'Anti-Eye Strain OLED',
    descAr: 'نمط مخصص للقراءة الليلية المطولة؛ شاشة سوداء حالكة OLED بانعدام الوهج مع نصوص دافئة لحماية العين وتوفير الطاقة.',
    descEn: 'Ultra-comfortable reading mode with true OLED deep black, warm candlelight accents, and reduced blue light.',
    iconName: 'night',
    primaryColor: '#D97706',
    bgPreview: '#000000',
    borderPreview: '#181F2E',
    textPreview: '#CBD5E1',
    taglineAr: 'راحة فائقة للعين في الظلام',
    taglineEn: 'Zero-Glare Night Reading'
  }
];

export const THEME_STORAGE_KEY = 'africonomist_theme_preference_v1';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  themes: ThemeOption[];
  currentThemeConfig: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('standard');
  const [mounted, setMounted] = useState<boolean>(false);

  // تطبيق السمة على الـ DOM فوراً
  const applyThemeToDOM = useCallback((newTheme: AppTheme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    // تعيين السمة عبر Data Attribute
    root.setAttribute('data-theme', newTheme);
    body.setAttribute('data-theme', newTheme);

    // إدارة الكلاسات الدلالية
    root.classList.remove('theme-standard', 'theme-light', 'theme-night');
    body.classList.remove('theme-standard', 'theme-light', 'theme-night');

    root.classList.add(`theme-${newTheme}`);
    body.classList.add(`theme-${newTheme}`);

    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    }

    // تحديث لون شريط المتصفح (theme-color) للموبايل
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      if (newTheme === 'light') {
        themeColorMeta.setAttribute('content', '#F8FAFC');
      } else if (newTheme === 'night') {
        themeColorMeta.setAttribute('content', '#000000');
      } else {
        themeColorMeta.setAttribute('content', '#070A12');
      }
    }
  }, []);

  // قراءة السمة المحفوظة عند التحميل
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
      if (saved && (saved === 'standard' || saved === 'light' || saved === 'night')) {
        setThemeState(saved);
        applyThemeToDOM(saved);
      } else {
        applyThemeToDOM('standard');
      }
    } catch {
      applyThemeToDOM('standard');
    }
    setMounted(true);
  }, [applyThemeToDOM]);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (err) {
      console.warn('Could not save theme to localStorage:', err);
    }

    // إرسال حدث مخصص لأي مكونات خارجية
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: newTheme } }));
    }
  }, [applyThemeToDOM]);

  const currentThemeConfig = useMemo(() => {
    return THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes: THEME_OPTIONS,
        currentThemeConfig
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
