import Link from 'next/link';
import { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white">
        {property.imageUrl && (
          <div className="mb-4 h-48 bg-gray-200 rounded-md overflow-hidden">
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {property.title}
        </h3>

        <p className="text-gray-600 mb-3 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>📍 {property.city}</span>
          <span>{property.area} m²</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            {property.price.toLocaleString('pl-PL')} PLN
          </span>
          <span className="text-gray-600">
            🛏️ {property.rooms} {property.rooms === 1 ? 'pokój' : 'pokoje'}
          </span>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Właściciel: {property.owner.username}
        </div>
      </div>
    </Link>
  );
}
