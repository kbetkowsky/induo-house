import { getPropertyById } from '@/lib/api';
import Link from 'next/link';

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  let property = null;
  let error = null;

  try {
    property = await getPropertyById(parseInt(id));
  } catch (e) {
    error = 'Nie znaleziono nieruchomości';
    console.error(e);
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Nie znaleziono nieruchomości'}
        </div>
        <Link href="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Powrót do listy
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/properties" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Powrót do listy
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {property.imageUrl && (
          <div className="h-96 bg-gray-200">
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {property.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <span>📍 {property.address}, {property.city}</span>
            <span>📐 {property.area} m²</span>
            <span>🛏️ {property.rooms} {property.rooms === 1 ? 'pokój' : 'pokoje'}</span>
          </div>

          <div className="text-3xl font-bold text-blue-600 mb-6">
            {property.price.toLocaleString('pl-PL')} PLN
          </div>

          <div className="prose max-w-none mb-6">
            <h2 className="text-2xl font-semibold mb-3">Opis</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {property.description}
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-3">Kontakt</h3>
            <p className="text-gray-600">
              Właściciel: <span className="font-semibold">{property.owner.username}</span>
            </p>
            <p className="text-gray-600">
              Email: <span className="font-semibold">{property.owner.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
