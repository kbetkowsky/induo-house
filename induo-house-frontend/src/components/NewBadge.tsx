import { Zap } from 'lucide-react';

interface Props {
  createdAt?: string | null;
  daysThreshold?: number;
}

export default function NewBadge({ createdAt, daysThreshold = 7 }: Props) {
  if (!createdAt) return null;
  const diff = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (diff > daysThreshold) return null;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20,
      background: 'rgba(34,197,94,0.15)',
      border: '1px solid rgba(34,197,94,0.3)',
      color: '#4ade80',
      fontSize: 10, fontWeight: 800,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      flexShrink: 0,
    }}>
      <Zap size={9} fill="#4ade80" />
      Nowe
    </span>
  );
}
