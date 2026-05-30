import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  { id: 'dark-slate', name: 'Dark Slate', icon: '🌑', desc: 'Sleek dark default' },
  { id: 'midnight-navy', name: 'Midnight Navy', icon: '🌊', desc: 'Deep blue tones' },
  { id: 'dark-emerald', name: 'Dark Emerald', icon: '🌿', desc: 'Rich forest green' },
  { id: 'dark-amethyst', name: 'Dark Amethyst', icon: '🔮', desc: 'Royal purple hues' },
  { id: 'dark-ruby', name: 'Dark Ruby', icon: '💎', desc: 'Crimson elegance' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌃', desc: 'Neon on black' },
  { id: 'light-clean', name: 'Light Clean', icon: '☀️', desc: 'Pure white minimal' },
  { id: 'light-warm', name: 'Light Warm', icon: '🌅', desc: 'Warm beige tones' },
  { id: 'solarized', name: 'Solarized', icon: '🌞', desc: 'Earthy light contrast' },
  { id: 'dracula', name: 'Dracula', icon: '🧛', desc: 'Dark purple-pink' },
  { id: 'nord', name: 'Nord', icon: '❄️', desc: 'Frosty arctic blue' },
  { id: 'forest', name: 'Forest', icon: '🌲', desc: 'Earthy green-brown' },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('devblog-theme') || 'dark-slate';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devblog-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
