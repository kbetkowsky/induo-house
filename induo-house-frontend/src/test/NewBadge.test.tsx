import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewBadge from '@/components/NewBadge';

describe('NewBadge', () => {
  it('renders "Nowe" badge when property is 1 day old', () => {
    const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
    render(<NewBadge createdAt={yesterday} />);
    expect(screen.getByText(/nowe/i)).toBeInTheDocument();
  });

  it('does NOT render badge when property is 10 days old', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    render(<NewBadge createdAt={tenDaysAgo} />);
    expect(screen.queryByText(/nowe/i)).not.toBeInTheDocument();
  });

  it('does NOT render badge when createdAt is null', () => {
    render(<NewBadge createdAt={null} />);
    expect(screen.queryByText(/nowe/i)).not.toBeInTheDocument();
  });

  it('renders badge with custom daysThreshold', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    render(<NewBadge createdAt={fiveDaysAgo} daysThreshold={3} />);
    expect(screen.queryByText(/nowe/i)).not.toBeInTheDocument();
  });
});
