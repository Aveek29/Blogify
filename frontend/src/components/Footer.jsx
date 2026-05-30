import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-surface)',
      padding: '2.5rem 0',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <Link to="/" style={{
            fontFamily: 'var(--font-primary)',
            fontSize: '1.1rem',
            fontWeight: 800,
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
          }}>
            DevBlog
          </Link>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
          }}>
            &copy; {year} DevBlog Hub. All rights reserved.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <a
            href="https://github.com/Aveek29"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)',
            }}
          >
            <span style={{ fontSize: '1rem' }}>🐙</span>
            GitHub
          </a>
          <span style={{ color: 'var(--border-color)', fontSize: '0.8rem' }}>|</span>
          <span style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}>
            Built with React & Express
          </span>
        </div>
      </div>
    </footer>
  );
}
