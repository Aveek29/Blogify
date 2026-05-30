import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Login() {
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (!isLogin) {
      if (!form.username.trim()) errs.username = 'Username is required';
      else if (form.username.trim().length < 3) errs.username = 'Username must be at least 3 characters';
      if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const data = isLogin
        ? await login(form.email, form.password)
        : await register(form.username, form.email, form.password);

      addToast(isLogin ? 'Welcome back!' : 'Account created!', 'success');
      navigate(redirectTo);
    } catch (err) {
      addToast(err?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ username: '', email: '', password: '' });
    setErrors({});
  };

  const inputStyle = (field) => ({
    borderColor: errors[field] ? 'var(--danger)' : undefined,
  });

  return (
    <div className="page-wrapper" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="animate-scaleIn" style={{ width: '100%', maxWidth: '440px', padding: '0 1rem' }}>
        <div className="auth-card" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
              color: 'hsl(var(--hsl-bg))',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isLogin ? (
                  <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
                ) : (
                  <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>
                )}
              </svg>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-primary)',
              fontSize: '1.6rem',
              fontWeight: 800,
              marginBottom: '0.35rem',
              letterSpacing: '-0.02em',
            }}>
              {isLogin ? 'Welcome back' : 'Join DevBlog'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className="input-field"
                  style={inputStyle('username')}
                  autoComplete="username"
                />
                {errors.username && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{errors.username}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                style={inputStyle('email')}
                autoComplete="email"
              />
              {errors.email && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                style={inputStyle('password')}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              {errors.password && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-secondary)',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
