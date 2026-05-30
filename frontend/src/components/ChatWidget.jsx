import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

export default function ChatWidget() {
  const { authFetch } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m DevBot. Ask me anything about coding, tech, or writing!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await authFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, language }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t process that.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--gradient-accent)',
          color: 'hsl(var(--hsl-bg))',
          border: 'none',
          fontSize: '1.4rem',
          cursor: 'pointer',
          boxShadow: '0 4px 20px hsla(var(--hsl-accent), 0.3)',
          transition: 'var(--transition)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="animate-slideUp" style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1.5rem',
          width: '360px',
          maxHeight: '520px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 998,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                display: 'inline-flex',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--success)',
                boxShadow: '0 0 8px hsla(142, 70%, 50%, 0.4)',
              }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>DevBot</span>
            </div>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
              >
                {currentLang.flag} {currentLang.name} <span style={{ fontSize: '0.6rem', marginLeft: '0.15rem' }}>▼</span>
              </button>
              {langOpen && (
                <div className="animate-scaleIn" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.25rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.35rem',
                  zIndex: 999,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  minWidth: '160px',
                }}>
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.4rem 0.75rem',
                        textAlign: 'left',
                        background: language === l.code ? 'hsla(var(--hsl-accent), 0.1)' : 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: language === l.code ? 'var(--accent)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '0.82rem',
                        transition: 'var(--transition)',
                      }}
                    >
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            minHeight: '280px',
            maxHeight: '340px',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className="animate-fadeIn"
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                <div style={{
                  padding: '0.6rem 0.9rem',
                  borderRadius: msg.role === 'user' ? 'var(--radius-lg) var(--radius-lg) var(--radius-xs) var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-xs)',
                  background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-surface)',
                  color: msg.role === 'user' ? 'hsl(var(--hsl-bg))' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '0.6rem 0.9rem',
                borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-xs)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                display: 'flex',
                gap: '0.25rem',
              }}>
                <span className="chat-typing" style={{
                  animation: 'pulse 1.2s ease infinite',
                }}>●</span>
                <span className="chat-typing" style={{
                  animation: 'pulse 1.2s ease infinite',
                  animationDelay: '0.2s',
                }}>●</span>
                <span className="chat-typing" style={{
                  animation: 'pulse 1.2s ease infinite',
                  animationDelay: '0.4s',
                }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'flex',
            gap: '0.5rem',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="input-field"
              style={{
                fontSize: '0.85rem',
                padding: '0.5rem 0.75rem',
                background: 'var(--bg-card)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-accent)',
                color: 'hsl(var(--hsl-bg))',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
                opacity: loading || !input.trim() ? 0.5 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
