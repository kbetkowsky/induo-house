'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Wróć na górę"
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 90,
        width: 42, height: 42, borderRadius: 13,
        background: 'var(--accent)',
        border: '1px solid var(--border-hover)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', cursor: 'pointer',
        boxShadow: '0 8px 24px var(--accent-shadow)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        animation: 'fadeUp 0.25s ease both',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 32px var(--accent-shadow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px var(--accent-shadow)';
      }}
    >
      <ArrowUp style={{ width: 17, height: 17 }} />
    </button>
  );
}
