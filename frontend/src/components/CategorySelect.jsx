import { useState, useRef, useEffect } from 'react';

const ALL_CATEGORIES = [
  'AI', 'Algorithms', 'Android', 'Angular', 'Architecture',
  'Assignment', 'AWS', 'Azure', 'Best Practices', 'Blockchain',
  'C#', 'C++', 'Career', 'CI/CD', 'CSS',
  'Dart', 'Data Science', 'Database', 'Deep Learning', 'Deno',
  'Design', 'DevOps', 'Django', 'Docker', 'Express',
  'Flask', 'Flutter', 'GCP', 'Go', 'GraphQL',
  'HTML', 'IoT', 'Interview', 'Java', 'JavaScript',
  'Kotlin', 'Kubernetes', 'Linux', 'LLM', 'Lua',
  'Machine Learning', 'Mobile', 'MongoDB', 'MySQL', 'NLP',
  'Networking', 'Next.js', 'Node.js', 'Nuxt', 'Open Source',
  'Opinion', 'Performance', 'PHP', 'PostgreSQL', 'Project',
  'Prompt Engineering', 'Python', 'React', 'React Native', 'Redis',
  'Research', 'Review', 'Ruby', 'Rust', 'Security',
  'Spring Boot', 'SQLite', 'Svelte', 'Swift', 'System Design',
  'Testing', 'Tutorial', 'TypeScript', 'UI/UX', 'Vue',
  'Web Dev',
];

export default function CategorySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const filtered = query
    ? ALL_CATEGORIES.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : ALL_CATEGORIES;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={open ? query : value}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); setQuery(''); }}
          placeholder="Search or select a category..."
          className="input-field"
          style={{ paddingRight: '2rem', cursor: 'pointer' }}
        />
        <span style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
          pointerEvents: 'none',
        }}>
          ▼
        </span>
      </div>
      {open && (
        <div className="animate-scaleIn" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.25rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '260px',
          overflowY: 'auto',
          zIndex: 50,
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No categories match
            </div>
          ) : (
            filtered.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => { onChange(cat); setOpen(false); setQuery(''); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.55rem 1rem',
                  textAlign: 'left',
                  background: cat === value ? 'hsla(var(--hsl-accent), 0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border-color)',
                  color: cat === value ? 'var(--accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-secondary)',
                  fontSize: '0.85rem',
                  transition: 'var(--transition)',
                  fontWeight: cat === value ? 600 : 400,
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                onMouseOut={e => e.currentTarget.style.background = cat === value ? 'hsla(var(--hsl-accent), 0.1)' : 'transparent'}
              >
                {cat}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export { ALL_CATEGORIES };
