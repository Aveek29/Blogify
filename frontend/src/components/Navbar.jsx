import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    fontSize: '0.85rem',
    fontWeight: 500,
    padding: '0.4rem 0.9rem',
    borderRadius: 'var(--radius-md)',
    background: isActive(path) ? 'hsla(var(--hsl-accent), 0.1)' : 'transparent',
    color: isActive(path) ? 'var(--accent)' : 'var(--text-muted)',
    transition: 'var(--transition)',
    textDecoration: 'none',
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--nav-height)',
      zIndex: 1000,
      background: 'var(--glass-bg)',
      backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(140%)',
      WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(140%)',
      borderBottom: '1px solid var(--glass-border)',
      boxShadow: scrolled ? '0 4px 24px hsla(0, 0%, 0%, 0.15)' : 'none',
      transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    }} className="nav-bar">
      <div className="container" style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '1.35rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          letterSpacing: '-0.03em',
          textDecoration: 'none',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)" style={{ flexShrink: 0 }}><polygon points="12,2 22,12 12,22 2,12"/></svg>
          DevBlog
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div className="nav-desktop" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <Link to="/" style={navLinkStyle('/')}>
              Home
            </Link>
            <ThemeSwitcher />
            {user ? (
              <>
                <Link to="/create" style={navLinkStyle('/create')}>
                  Write
                </Link>
                <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    ...navLinkStyle(''),
                    color: 'var(--danger)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '0.85rem',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.8rem', padding: '0.35rem 1rem' }}
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.4rem',
              cursor: 'pointer',
              padding: '0.4rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)',
            }}
          >
            {menuOpen ? (
              <span style={{ display: 'block', lineHeight: 1 }}>✕</span>
            ) : (
              <span style={{ display: 'block', lineHeight: 1 }}>☰</span>
            )}
          </button>
        </div>
      </div>

      <div className="mobile-menu" style={{
        display: menuOpen ? 'block' : 'none',
        position: 'fixed',
        top: 'var(--nav-height)',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-surface)',
        animation: 'slideDown 0.25s ease forwards',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{ padding: '1rem 1.5rem 3rem' }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{
            padding: '0.85rem 1rem',
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            borderRadius: 'var(--radius-md)',
            background: isActive('/') ? 'hsla(var(--hsl-accent), 0.1)' : 'transparent',
            color: isActive('/') ? 'var(--accent)' : 'var(--text-primary)',
            textDecoration: 'none',
            fontWeight: isActive('/') ? 600 : 500,
            marginBottom: '0.25rem',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>

          <div style={{ margin: '1rem 1rem 0.5rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Theme</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            padding: '0 1rem',
          }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.5rem 0.3rem',
                  borderRadius: 'var(--radius-md)',
                  border: theme === t.id ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                  background: theme === t.id ? 'hsla(var(--hsl-accent), 0.08)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-secondary)',
                  transition: 'var(--transition)',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: t.id === 'dark-slate' ? '#1e293b' :
                    t.id === 'midnight-navy' ? '#1a2744' :
                    t.id === 'dark-emerald' ? '#1a332a' :
                    t.id === 'dark-amethyst' ? '#2a1f33' :
                    t.id === 'dark-ruby' ? '#331f24' :
                    t.id === 'cyberpunk' ? '#0d0d1a' :
                    t.id === 'light-clean' ? '#fafafa' :
                    t.id === 'light-warm' ? '#f5efe6' :
                    t.id === 'solarized' ? '#fdf6e3' :
                    t.id === 'dracula' ? '#282a36' :
                    t.id === 'nord' ? '#2e3440' :
                    t.id === 'forest' ? '#1a2e1a' : 'var(--bg-card)',
                  border: t.id.startsWith('light-') || t.id === 'solarized' ? '1px solid var(--border-color)' : 'none',
                }} />
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  color: theme === t.id ? 'var(--accent)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {t.name}
                </span>
              </button>
            ))}
          </div>

          {user ? (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ margin: '0 1rem 0.5rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Account</p>
              </div>
              <Link to="/create" onClick={() => setMenuOpen(false)} style={{
                padding: '0.85rem 1rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                margin: '0 1rem',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Write
              </Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{
                padding: '0.85rem 1rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                margin: '0 1rem',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{
                padding: '0.85rem 1rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                textAlign: 'left',
                fontFamily: 'var(--font-secondary)',
                cursor: 'pointer',
                width: 'calc(100% - 2rem)',
                margin: '0 1rem',
                borderRadius: 'var(--radius-md)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '1.5rem', padding: '0 1rem' }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                minHeight: '48px',
                fontSize: '1rem',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          .nav-desktop { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
