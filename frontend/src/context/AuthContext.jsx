import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.id && !parsed._id) parsed._id = parsed.id;
      setToken(savedToken);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  const resolveUrl = (path) => path.startsWith('http') ? path : `${API_BASE}${path}`;

  const resolveImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_URL || '';
    return `${base}${path}`;
  };

  const login = async (email, password) => {
    const res = await fetch(resolveUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    const u = data.user;
    if (u.id && !u._id) u._id = u.id;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(data.token);
    setUser(u);
    return data;
  };

  const register = async (username, email, password) => {
    const res = await fetch(resolveUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    const u = data.user;
    if (u.id && !u._id) u._id = u.id;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(data.token);
    setUser(u);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const authFetch = async (url, options = {}) => {
    const headers = { ...options.headers };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(resolveUrl(url), { ...options, headers });

    if (res.status === 401) {
      logout();
      throw new Error('Session expired. Please login again.');
    }

    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch, resolveImageUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
