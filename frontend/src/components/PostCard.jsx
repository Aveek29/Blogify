import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post }) {
  const { resolveImageUrl } = useAuth();
  const dateStr = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/post/${post._id}`}
      className="card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {post.imageUrl && (
        <div className="post-image" style={{
          height: '200px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <img
            src={resolveImageUrl(post.imageUrl)}
            alt={post.title}
            className="post-card-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            loading="lazy"
          />
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
          }}>
            <span className="badge badge-accent">
              {post.category}
            </span>
          </div>
        </div>
      )}
      {!post.imageUrl && (
        <div style={{
          padding: '1.25rem 1.25rem 0',
        }}>
          <span className="badge badge-accent">
            {post.category}
          </span>
        </div>
      )}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        flex: 1,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '1.15rem',
          fontWeight: 700,
          lineHeight: '1.35',
          color: 'var(--text-primary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.title}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {post.content}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {post.author}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ opacity: 0.6 }}>●</span>
            {dateStr}
          </span>
        </div>
      </div>
    </Link>
  );
}
