import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Witaj w InduoHouse
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Najlepsza platforma do zarządzania nieruchomościami
        </p>
        <Link
          href="/properties"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-block"
        >
          Przeglądaj oferty
        </Link>
      </div>
    </div>
  );
}
