import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { ALL_CATEGORIES } from '../components/CategorySelect';

const POPULAR = [
  'All', 'General', 'JavaScript', 'React', 'Python', 'CSS',
  'TypeScript', 'Node.js', 'AI', 'DevOps', 'Tutorial',
  'Project', 'Career',
];

export default function Home() {
  const { authFetch } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [catOpen, setCatOpen] = useState(false);
  const [catQuery, setCatQuery] = useState('');
  const catRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '9',
      search,
      category: category === 'All' ? '' : category,
    });

    authFetch(`/api/posts?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.posts) {
          setPosts(data.posts);
          setTotalPages(data.totalPages || 1);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, search, category, authFetch]);

  const filteredAll = catQuery
    ? ALL_CATEGORIES.filter(c => c.toLowerCase().includes(catQuery.toLowerCase()))
    : ALL_CATEGORIES;

  return (
    <div className="page-wrapper">
      <div className="hero-section" style={{
        position: 'relative',
        padding: '3.5rem 0 3rem',
        marginBottom: '2rem',
        textAlign: 'center',
        background: 'var(--gradient-hero)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div className="container">
          <h1 className="page-title" style={{ marginBottom: '0.75rem' }}>
            Discover & Write
          </h1>
          <p className="page-subtitle" style={{ maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Explore stories, tutorials, and insights from the dev community.
          </p>

          <div style={{
            maxWidth: '480px',
            margin: '0 auto',
            position: 'relative',
          }}>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input-field"
              style={{
                paddingLeft: '2.75rem',
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            />
            <svg style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          {POPULAR.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: category === cat ? 'var(--accent)' : 'var(--border-color)',
                background: category === cat ? 'var(--accent)' : 'var(--bg-card)',
                color: category === cat ? 'hsl(var(--hsl-bg))' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}

          <div ref={catRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setCatOpen(!catOpen); setCatQuery(''); }}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                background: !POPULAR.includes(category) ? 'var(--accent)' : 'var(--bg-card)',
                color: !POPULAR.includes(category) ? 'hsl(var(--hsl-bg))' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              {!POPULAR.includes(category) ? category : 'All Categories'}
              <span style={{ fontSize: '0.6rem' }}>▼</span>
            </button>

            {catOpen && (
              <div className="animate-scaleIn" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '0.35rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 50,
                minWidth: '240px',
              }}>
                <input
                  autoFocus
                  value={catQuery}
                  onChange={e => setCatQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="input-field"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.7rem',
                    marginBottom: '0.35rem',
                  }}
                />
                <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                  {filteredAll.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setPage(1); setCatOpen(false); }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.45rem 0.7rem',
                        textAlign: 'left',
                        background: cat === category ? 'hsla(var(--hsl-accent), 0.1)' : 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: cat === category ? 'var(--accent)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '0.82rem',
                        transition: 'var(--transition)',
                        fontWeight: cat === category ? 600 : 400,
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 0',
            color: 'var(--text-muted)',
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No articles found</p>
            <p style={{ fontSize: '0.9rem' }}>Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="post-grid">
              {posts.map((post, i) => (
                <div key={post._id} className={`animate-fadeInUp stagger-${(i % 6) + 1}`}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '3rem',
              }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary pagination-btn"
                >
                  ← Previous
                </button>
                <span style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
