import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
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
          <span style={{ fontSize: '1.5rem', color: 'var(--accent)', WebkitTextFillColor: 'initial' }}>◇</span>
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
        display: menuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        position: 'fixed',
        top: 'var(--nav-height)',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-surface)',
        padding: '1.5rem',
        gap: '0.35rem',
        animation: 'slideDown 0.25s ease forwards',
        overflowY: 'auto',
      }}>
        <Link to="/" onClick={() => setMenuOpen(false)} style={{
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          display: 'block',
          borderBottom: '1px solid var(--border-color)',
          color: isActive('/') ? 'var(--accent)' : 'var(--text-primary)',
          textDecoration: 'none',
          fontWeight: isActive('/') ? 600 : 400,
        }}>
          Home
        </Link>
        <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <ThemeSwitcher />
        </div>
        {user ? (
          <>
            <Link to="/create" onClick={() => setMenuOpen(false)} style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              display: 'block',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--border-color)',
            }}>
              Write
            </Link>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              display: 'block',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--border-color)',
            }}>
              Dashboard
            </Link>
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              background: 'none',
              border: 'none',
              color: 'var(--danger)',
              textAlign: 'left',
              fontFamily: 'var(--font-secondary)',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
            }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            display: 'block',
            color: 'var(--accent)',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Sign In
          </Link>
        )}
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
