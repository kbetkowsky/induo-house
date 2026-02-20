import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'InduoHouse — Nieruchomości w Polsce',
    template: '%s — InduoHouse',
  },
  description: 'Tysiące ofert mieszkań, domów i działek w całej Polsce. Znajdź swoje wymarzone miejsce na InduoHouse.',
  keywords: ['nieruchomości', 'mieszkania', 'domy', 'działki', 'wynajem', 'sprzedaż', 'Polska'],
  authors: [{ name: 'InduoHouse' }],
  openGraph: {
    title: 'InduoHouse — Nieruchomości w Polsce',
    description: 'Tysiące ofert mieszkań, domów i działek.',
    siteName: 'InduoHouse',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pl"
      className={inter.variable}
      suppressHydrationWarning
      style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}
    >
      <body style={{
        width: '100%',
        maxWidth: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}>
        <Providers>
          <Navbar />
          {children}
          <Toaster
            position="bottom-right"
            gutter={10}
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-card)',
              },
              success: { iconTheme: { primary: '#4ade80', secondary: 'var(--bg-surface)' } },
              error:   { iconTheme: { primary: '#f87171', secondary: 'var(--bg-surface)' } },
            }}
          />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
