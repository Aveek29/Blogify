import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const bgColors = {
  success: 'hsla(142, 70%, 50%, 0.15)',
  error: 'hsla(0, 84%, 60%, 0.15)',
  warning: 'hsla(38, 92%, 50%, 0.15)',
  info: 'hsla(200, 90%, 50%, 0.15)',
};

const borderColors = {
  success: 'hsla(142, 70%, 50%, 0.3)',
  error: 'hsla(0, 84%, 60%, 0.3)',
  warning: 'hsla(38, 92%, 50%, 0.3)',
  info: 'hsla(200, 90%, 50%, 0.3)',
};

const textColors = {
  success: 'hsl(142, 70%, 50%)',
  error: 'hsl(0, 84%, 60%)',
  warning: 'hsl(38, 92%, 50%)',
  info: 'hsl(200, 90%, 50%)',
};

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" style={{
        position: 'fixed',
        top: 'calc(var(--nav-height) + 1rem)',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        pointerEvents: 'none',
        maxWidth: '380px',
      }}>
        {toasts.map((toast, i) => (
          <div
            key={toast.id}
            className="animate-slideDown"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-lg)',
              background: bgColors[toast.type],
              border: `1px solid ${borderColors[toast.type]}`,
              backdropFilter: 'blur(16px)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              animation: 'slideDown 0.3s ease forwards',
            }}
            onClick={() => removeToast(toast.id)}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: textColors[toast.type],
              color: 'hsl(var(--hsl-bg))',
              fontSize: '0.65rem',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {icons[toast.type]}
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              fontWeight: 500,
              lineHeight: '1.4',
            }}>
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
