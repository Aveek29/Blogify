import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';
import CategorySelect from '../components/CategorySelect';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch, resolveImageUrl } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Technology',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    authFetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        const uid = user._id || user.id;
        if (user && data.authorId !== uid) {
          addToast('You can only edit your own posts', 'error');
          navigate('/');
          return;
        }
        setForm({
          title: data.title || '',
          content: data.content || '',
          category: data.category || 'General',
          imageUrl: data.imageUrl || '',
        });
        setLoading(false);
      })
      .catch(() => {
        addToast('Post not found', 'error');
        navigate('/');
      });
  }, [id, authFetch, user, addToast, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      addToast('File too large. Max 5MB.', 'error');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      addToast('Only JPG, PNG, GIF, WebP, SVG allowed.', 'error');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await authFetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm(prev => ({ ...prev, imageUrl: data.url }));
        addToast('Image uploaded!', 'success');
      } else {
        addToast(data.message || 'Upload failed', 'error');
      }
    } catch {
      addToast('Upload error', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authFetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Article updated!', 'success');
        navigate(`/post/${id}`);
      } else {
        addToast(data.message || 'Failed to update', 'error');
        setSubmitting(false);
      }
    } catch {
      addToast('Connection error', 'error');
      setSubmitting(false);
    }
  };

  const clearImage = () => setForm(prev => ({ ...prev, imageUrl: '' }));

  if (loading) return <div className="page-wrapper"><Loader /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>
            Edit Article
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.95rem' }}>
            Make your article even better.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <CategorySelect
              value={form.category}
              onChange={(cat) => setForm(prev => ({ ...prev, category: cat }))}
            />
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <label className="btn btn-secondary" style={{ cursor: 'pointer', position: 'relative' }}>
                {uploading ? 'Uploading...' : 'Upload File'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer',
                  }}
                  disabled={uploading}
                />
              </label>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or paste URL</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="input-field"
                style={{ flex: 1 }}
              />
              {form.imageUrl && (
                <button type="button" onClick={clearImage} className="btn btn-ghost btn-sm">
                  ✕
                </button>
              )}
            </div>
            {form.imageUrl && (
              <div style={{
                marginTop: '0.75rem',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                maxWidth: '300px',
                border: '1px solid var(--border-color)',
                position: 'relative',
              }}>
                <img src={resolveImageUrl(form.imageUrl)} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.style.display = 'none' }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label>Content</label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {preview ? (
              <div style={{
                padding: '1.25rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                minHeight: '200px',
              }}>
                {form.content || 'Nothing to preview...'}
              </div>
            ) : (
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="input-field"
                rows="12"
                required
              />
            )}
          </div>

          <div className="edit-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-full-mobile"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className="btn btn-secondary btn-full-mobile"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
