export default function Loader({ size = 40, color = 'var(--accent)' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem 0',
      gap: '1rem',
    }}>
      <div style={{
        width: size,
        height: size,
        border: '3px solid var(--border-color)',
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</p>
    </div>
  );
}

export function Spinner({ size = 40, color = 'var(--accent)' }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem 0',
    }}>
      <div style={{
        width: size,
        height: size,
        border: '3px solid var(--border-color)',
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
    }}>
      <div style={{
        height: '200px',
        background: 'var(--bg-surface)',
        animation: 'pulse 2s ease-in-out infinite',
      }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{
          height: '14px',
          width: '40%',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <div style={{
          height: '20px',
          width: '90%',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <div style={{
          height: '14px',
          width: '60%',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ textAlign: 'center' }}>
        <Spinner size={60} />
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading...</p>
      </div>
    </div>
  );
}
