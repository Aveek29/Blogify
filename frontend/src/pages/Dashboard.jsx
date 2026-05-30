import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user, authFetch } = useAuth();
  const { addToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    setLoading(true);
    authFetch('/api/posts?limit=50')
      .then(res => res.json())
      .then(data => {
        if (data.posts) {
          const userPosts = data.posts.filter(p => p.authorId === user._id);
          setPosts(userPosts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, authFetch]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this article?')) return;
    setDeleting(postId);
    try {
      const res = await authFetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        addToast('Article deleted', 'success');
      } else {
        addToast('Failed to delete', 'error');
      }
    } catch {
      addToast('Connection error', 'error');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="page-wrapper"><Loader /></div>;

  const stats = [
    { label: 'Total Articles', value: posts.length, icon: '📝' },
    { label: 'Categories Used', value: new Set(posts.map(p => p.category)).size, icon: '🏷' },
    { label: 'Latest', value: posts.length > 0 ? new Date(posts[0].createdAt).toLocaleDateString() : '—', icon: '📅' },
  ];

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
              Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Welcome back, {user?.username || 'User'}
            </p>
          </div>
          <Link to="/create" className="btn btn-primary">
            ✎ Write New
          </Link>
        </div>

        <div className="dashboard-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          {stats.map((stat, i) => (
            <div key={i} className="animate-fadeInUp" style={{
              animationDelay: `${i * 0.08}s`,
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
              padding: '1.5rem',
              textAlign: 'center',
              transition: 'var(--transition)',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                fontFamily: 'var(--font-primary)',
                background: 'var(--gradient-accent)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.25rem',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 0',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              You haven't written anything yet
            </p>
            <Link to="/create" className="btn btn-primary">
              Write your first article →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {posts.map((post, i) => (
              <div key={post._id} className={`dashboard-item animate-fadeInUp stagger-${(i % 6) + 1}`} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '1.1rem 1.25rem',
                transition: 'var(--transition)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--accent)',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}>
                    {post.category}
                  </div>
                  <Link to={`/post/${post._id}`} style={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {post.title}
                  </Link>
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.2rem',
                  }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="dashboard-item-actions" style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexShrink: 0,
                }}>
                  <Link to={`/edit/${post._id}`} className="btn btn-secondary btn-sm">
                    ✎
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deleting === post._id}
                    className="btn btn-danger btn-sm"
                  >
                    {deleting === post._id ? '...' : '🗑'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
