'use client';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">InduoHouse</Link>
        <div className="flex gap-4 items-center">
          <Link href="/properties">Oferty</Link>
          {user ? (
            <>
              <Link href="/properties/create">Dodaj ogłoszenie</Link>
              <Link href="/dashboard">{user.firstName || user.email}</Link>
              <button onClick={logout}>Wyloguj</button>
            </>
          ) : (
            <>
              <Link href="/login">Zaloguj się</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Zarejestruj się
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
