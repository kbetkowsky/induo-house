'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { Bot, MessageSquare, Plus, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { getChatMessages, getChatSessions, getChatStatus, sendChatMessage } from '@/lib/chat';
import { ChatMessage, ChatSessionSummary, ChatStatus } from '@/types/chat';

function formatTime(value: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as { message?: string; error?: string } | undefined;
    return responseData?.message ?? responseData?.error ?? fallback;
  }

  return fallback;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [status, setStatus] = useState<ChatStatus | null>(null);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [loadingState, setLoadingState] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => {
    return !!status?.enabled && !!status?.modelConfigured && draft.trim().length > 0 && !sending;
  }, [draft, sending, status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    const loadInitialData = async () => {
      try {
        const [chatStatus, chatSessions] = await Promise.all([getChatStatus(), getChatSessions()]);
        setStatus(chatStatus);
        setSessions(chatSessions);

        if (chatSessions.length > 0) {
          setSelectedSessionId(chatSessions[0].id);
        }
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, 'Nie udało się załadować czatu.'));
      } finally {
        setLoadingState(false);
      }
    };

    void loadInitialData();
  }, [isLoading, router, user]);

  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const sessionMessages = await getChatMessages(selectedSessionId);
        setMessages(sessionMessages);
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, 'Nie udało się załadować historii rozmowy.'));
      }
    };

    void loadMessages();
  }, [selectedSessionId]);

  const refreshSessions = async (preferredSessionId?: string) => {
    const nextSessions = await getChatSessions();
    setSessions(nextSessions);

    if (preferredSessionId) {
      setSelectedSessionId(preferredSessionId);
      return;
    }

    if (!selectedSessionId && nextSessions.length > 0) {
      setSelectedSessionId(nextSessions[0].id);
    }
  };

  const handleNewChat = () => {
    setSelectedSessionId(null);
    setMessages([]);
    setDraft('');
  };

  const handleSend = async () => {
    const message = draft.trim();
    if (!message || !status?.enabled || !status?.modelConfigured) {
      return;
    }

    const optimisticUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'USER',
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticUserMessage]);
    setDraft('');
    setSending(true);

    try {
      const response = await sendChatMessage(message, selectedSessionId);
      const nextSessionId = response.sessionId;
      await refreshSessions(nextSessionId);
      const nextMessages = await getChatMessages(nextSessionId);
      setMessages(nextMessages);
    } catch (error: unknown) {
      setMessages((current) => current.filter((entry) => entry.id !== optimisticUserMessage.id));
      toast.error(getErrorMessage(error, 'Nie udało się wysłać wiadomości do modelu.'));
    } finally {
      setSending(false);
    }
  };

  if (isLoading || loadingState) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 88, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Asystent AI
            </p>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Chat z modelem
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
              {status?.assistantName ?? 'Induo Assistant'} • model: {status?.model ?? 'nieustawiony'}
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <Sparkles size={16} /> Wróć do dashboardu
          </Link>
        </div>

        <div
          style={{
            marginBottom: 20,
            padding: '14px 18px',
            borderRadius: 16,
            border: `1px solid ${status?.enabled && status?.modelConfigured ? 'rgba(34,197,94,0.22)' : 'rgba(248,113,113,0.25)'}`,
            background: status?.enabled && status?.modelConfigured ? 'rgba(34,197,94,0.08)' : 'rgba(248,113,113,0.08)',
            color: 'var(--text-primary)',
          }}
        >
          <strong style={{ display: 'block', marginBottom: 4 }}>
            {status?.enabled && status?.modelConfigured ? 'Chat gotowy' : 'Wymagana konfiguracja AI'}
          </strong>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{status?.message}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
          <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 24, padding: 18, minHeight: 720 }}>
            <button
              onClick={handleNewChat}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 16px',
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: 16,
              }}
            >
              <Plus size={16} /> Nowa rozmowa
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessions.length === 0 ? (
                <div style={{ padding: '18px 14px', borderRadius: 16, background: 'var(--bg-card)', border: '1px dashed var(--border)', color: 'var(--text-muted)', fontSize: 14 }}>
                  Pierwsza wiadomość utworzy nową sesję czatu.
                </div>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    style={{
                      textAlign: 'left',
                      padding: '14px 14px',
                      borderRadius: 16,
                      border: selectedSessionId === session.id ? '1px solid rgba(37,99,235,0.35)' : '1px solid var(--border)',
                      background: selectedSessionId === session.id ? 'rgba(37,99,235,0.08)' : 'var(--bg-card)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <MessageSquare size={14} style={{ color: 'var(--accent-bright)' }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{session.title}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{formatTime(session.createdAt)}</p>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 24, minHeight: 720, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(37,99,235,0.12)', color: 'var(--accent-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedSessionId ? 'Aktywna rozmowa' : 'Nowa rozmowa'}
                </h2>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  Pytaj o nieruchomości, architekturę systemu albo funkcje aplikacji.
                </p>
              </div>
            </div>

            <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {messages.length === 0 ? (
                <div style={{ margin: 'auto', maxWidth: 520, textAlign: 'center' }}>
                  <div style={{ width: 78, height: 78, borderRadius: 24, margin: '0 auto 20px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={34} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                  <h3 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Zacznij rozmowę z AI</h3>
                  <p style={{ margin: 0, fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    Możesz użyć tego miejsca jako asystenta nieruchomości albo jako copilota do tłumaczenia funkcji projektu.
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isUser = message.role === 'USER';
                  return (
                    <div key={message.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                      <div
                        style={{
                          maxWidth: '78%',
                          padding: '14px 16px',
                          borderRadius: 18,
                          background: isUser ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'var(--bg-card)',
                          border: isUser ? 'none' : '1px solid var(--border)',
                          color: isUser ? '#fff' : 'var(--text-primary)',
                          boxShadow: 'var(--shadow-card)',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{message.content}</p>
                        <p style={{ margin: '10px 0 0', fontSize: 11, opacity: 0.72 }}>
                          {isUser ? 'Ty' : status?.assistantName ?? 'AI'} • {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: 18, borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="Napisz wiadomość do asystenta..."
                  rows={3}
                  style={{
                    flex: 1,
                    resize: 'none',
                    borderRadius: 16,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    padding: '14px 16px',
                    fontFamily: 'inherit',
                    fontSize: 15,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => void handleSend()}
                  disabled={!canSend}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    border: 'none',
                    background: canSend ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'var(--bg-card)',
                    color: canSend ? '#fff' : 'var(--text-faint)',
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
