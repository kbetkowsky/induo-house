'use client';

import { Bot, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getChatStatus, sendChatMessage } from '@/lib/chat';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatPage() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Opisz, czego szukasz, a pomogę zawęzić kryteria nieruchomości.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getChatStatus().then((status) => setEnabled(status.enabled)).catch(() => setEnabled(false));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    const next = input.trim();
    setInput('');
    setMessages((current) => [...current, { role: 'user', content: next }]);
    setLoading(true);
    try {
      const response = await sendChatMessage(next, sessionId);
      setSessionId(response.sessionId || sessionId);
      setMessages((current) => [...current, { role: 'assistant', content: response.message || response.response || response.content || 'Nie mam odpowiedzi.' }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: 'Chat nie jest teraz dostępny. Sprawdź konfigurację AI w backendzie.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="container page-hero">
        <span className="eyebrow"><Bot size={16} /> AI Doradca</span>
        <h1>Rozmawiaj o kryteriach, zanim zaczniesz filtrować.</h1>
        <p>Status modułu: {enabled === null ? 'sprawdzam...' : enabled ? 'aktywny' : 'wyłączony lokalnie'}</p>
      </section>
      <section className="container panel" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gap: 12, minHeight: 360 }}>
          {messages.map((message, index) => (
            <div key={index} style={{ justifySelf: message.role === 'user' ? 'end' : 'start', maxWidth: 720, padding: 16, borderRadius: 20, background: message.role === 'user' ? 'var(--green)' : '#fff', color: message.role === 'user' ? '#fff' : 'var(--ink)', boxShadow: 'var(--shadow)' }}>
              {message.content}
            </div>
          ))}
          {loading ? <div style={{ color: 'var(--muted)' }}>Piszę odpowiedź...</div> : null}
        </div>
        <form className="search-form" style={{ marginTop: 20, gridTemplateColumns: '1fr auto' }} onSubmit={submit}>
          <div className="field-box"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Szukam mieszkania do 800k w spokojnej okolicy..." /></div>
          <button className="btn-primary" type="submit"><Send size={18} /> Wyślij</button>
        </form>
      </section>
    </main>
  );
}
