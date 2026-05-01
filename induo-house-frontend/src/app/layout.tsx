import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { Shell } from '@/components/Shell';

export const metadata: Metadata = {
  title: {
    default: 'InduoHouse - nowoczesne nieruchomości',
    template: '%s - InduoHouse',
  },
  description: 'Profesjonalny katalog mieszkań, domów i działek z wygodnym wyszukiwaniem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>
          <Shell>{children}</Shell>
        </AuthProvider>
      </body>
    </html>
  );
}
