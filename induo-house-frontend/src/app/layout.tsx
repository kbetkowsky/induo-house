import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'InduoHouse', template: '%s — InduoHouse' },
  description: 'Ekskluzywne nieruchomości w Polsce.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pl"
      className={inter.variable}
      style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}
    >
      <body style={{
        width: '100%',
        maxWidth: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        background: '#080b14',
        color: '#f1f5f9',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0d1117',
                color: '#f1f5f9',
                borderRadius: '10px',
                fontSize: '13px',
                padding: '12px 16px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#0d1117' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0d1117' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
