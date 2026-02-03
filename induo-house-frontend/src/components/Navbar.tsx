import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:text-blue-200">
          🏠 InduoHouse
        </Link>

        <div className="flex gap-6">
          <Link href="/properties" className="hover:text-blue-200 transition">
            Nieruchomości
          </Link>
          <Link href="/properties/new" className="hover:text-blue-200 transition">
            Dodaj ogłoszenie
          </Link>
          <Link href="/login" className="hover:text-blue-200 transition">
            Zaloguj się
          </Link>
        </div>
      </div>
    </nav>
  );
}
