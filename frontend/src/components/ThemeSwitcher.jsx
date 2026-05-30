import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const themes = [
  { id: 'dark-slate', name: 'Dark Slate', icon: '🌑', desc: 'Dark' },
  { id: 'midnight-navy', name: 'Midnight Navy', icon: '🌌', desc: 'Navy' },
  { id: 'dark-emerald', name: 'Dark Emerald', icon: '🌿', desc: 'Green' },
  { id: 'dark-amethyst', name: 'Dark Amethyst', icon: '🔮', desc: 'Purple' },
  { id: 'dark-ruby', name: 'Dark Ruby', icon: '💎', desc: 'Red' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '⚡', desc: 'Neon' },
  { id: 'light-clean', name: 'Light Clean', icon: '☀️', desc: 'Light' },
  { id: 'light-warm', name: 'Light Warm', icon: '🌤', desc: 'Warm' },
  { id: 'solarized', name: 'Solarized', icon: '🌅', desc: 'Solar' },
  { id: 'dracula', name: 'Dracula', icon: '🧛', desc: 'Dracula' },
  { id: 'nord', name: 'Nord', icon: '❄️', desc: 'Nord' },
  { id: 'forest', name: 'Forest', icon: '🌲', desc: 'Forest' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = themes.find(t => t.id === theme) || themes[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost btn-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.8rem',
          padding: '0.35rem 0.6rem',
        }}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{current.icon}</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>▼</span>
      </button>

      {open && (
        <div className="animate-scaleIn" style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '0.5rem',
          minWidth: '200px',
          zIndex: 100,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.25rem',
        }}>
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
                padding: '0.55rem 0.4rem',
                borderRadius: 'var(--radius-md)',
                border: theme === t.id ? '1px solid var(--accent)' : '1px solid transparent',
                background: theme === t.id ? 'hsla(var(--hsl-accent), 0.08)' : 'transparent',
                cursor: 'pointer',
                transition: 'var(--transition)',
                fontFamily: 'var(--font-secondary)',
              }}
            >
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{t.icon}</span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: theme === t.id ? 'var(--accent)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}>
                {t.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
