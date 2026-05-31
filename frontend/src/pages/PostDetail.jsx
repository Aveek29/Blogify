import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch, resolveImageUrl } = useAuth();
  const { addToast } = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    authFetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id, authFetch]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('Post deleted', 'success');
        navigate('/');
      } else {
        addToast('Failed to delete', 'error');
        setDeleting(false);
      }
    } catch {
      addToast('Connection error', 'error');
      setDeleting(false);
    }
  };

  if (loading) return <div className="page-wrapper"><Loader /></div>;

  if (!post) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Post not found</h2>
        <Link to="/" className="btn btn-primary">← Back to Home</Link>
      </div>
    );
  }

  const isOwner = user && post.authorId === user._id;
  const dateStr = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page-wrapper animate-fadeIn">
      <article className="container" style={{ maxWidth: '800px' }}>
        {post.imageUrl && (
          <div className="post-detail-image" style={{
            height: '400px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            <img
              src={resolveImageUrl(post.imageUrl)}
              alt={post.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-accent" style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem' }}>
            {post.category}
          </span>
        </div>

        <h1 className="post-detail-title" style={{
          fontFamily: 'var(--font-primary)',
          fontWeight: 800,
          lineHeight: '1.2',
          marginBottom: '1.25rem',
          letterSpacing: '-0.03em',
        }}>
          {post.title}
        </h1>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{
              display: 'inline-flex',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--gradient-accent)',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'hsl(var(--hsl-bg))',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {post.author?.charAt(0).toUpperCase()}
            </span>
            {post.author}
          </span>
          <span>•</span>
          <span>{dateStr}</span>
        </div>

        <div style={{
          fontSize: '1.05rem',
          lineHeight: '1.8',
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
        }}>
          {post.content}
        </div>

        {isOwner && (
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
          }}>
            <Link to={`/edit/${post._id}`} className="btn btn-primary btn-full-mobile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Edit Post
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-danger btn-full-mobile"
            >
              {deleting ? 'Deleting...' : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Delete</>}
            </button>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>
            ← Back to articles
          </Link>
        </div>
      </article>
    </div>
  );
}
