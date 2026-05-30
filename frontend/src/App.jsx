import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ToastProvider from './components/Toast';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
            <ChatWidget />
            <footer style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              borderTop: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}>
              <p>
                Built by{' '}
                <a href="https://github.com/Aveek29" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  Aveek29
                </a>
                {' '}· DevBlog Hub © {new Date().getFullYear()}
              </p>
            </footer>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
