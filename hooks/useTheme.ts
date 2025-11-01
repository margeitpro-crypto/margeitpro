import { useState, useEffect, createContext, useContext } from 'react';

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animations: boolean;
}

const defaultTheme: ThemeConfig = {
  mode: 'light',
  primaryColor: 'facebook',
  fontSize: 'medium',
  borderRadius: 'medium',
  animations: true
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('margeitpro-theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('margeitpro-theme', JSON.stringify(theme));
    
    // Apply Facebook theme to document
    const root = document.documentElement;
    const body = document.body;
    
    // Mode
    if (theme.mode === 'dark') {
      root.classList.add('dark');
      body.style.backgroundColor = '#18191A';
      body.style.color = '#E4E6EA';
    } else {
      root.classList.remove('dark');
      body.style.backgroundColor = '#F0F2F5';
      body.style.color = '#050505';
    }
    
    // Primary color
    root.setAttribute('data-primary-color', theme.primaryColor);
    
    // Font size
    root.setAttribute('data-font-size', theme.fontSize);
    
    // Border radius
    root.setAttribute('data-border-radius', theme.borderRadius);
    
    // Animations
    root.setAttribute('data-animations', theme.animations.toString());
  }, [theme]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const toggleMode = () => {
    setTheme(prev => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return { theme, updateTheme, toggleMode, resetTheme };
};