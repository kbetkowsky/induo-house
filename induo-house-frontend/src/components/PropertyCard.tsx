import Link from 'next/link';
import { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const propertyTypeLabels = {
    APARTMENT: 'Mieszkanie',
    HOUSE: 'Dom',
    LAND: 'Działka',
  };

  const transactionTypeLabels = {
    SALE: 'Sprzedaż',
    RENT: 'Wynajem',
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white">
        <div className="mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {transactionTypeLabels[property.transactionType]}
          </span>
          <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {propertyTypeLabels[property.propertyType]}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {property.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>📍 {property.city}</span>
          <span>{property.area} m²</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            {property.price.toLocaleString('pl-PL')}
            {property.transactionType === 'RENT' ? ' PLN/mies' : ' PLN'}
          </span>
          {property.numberOfRooms && (
            <span className="text-gray-600">
              🛏️ {property.numberOfRooms} {property.numberOfRooms === 1 ? 'pokój' : 'pokoje'}
            </span>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Właściciel: {property.ownerFirstName} {property.ownerLastName}
        </div>
      </div>
    </Link>
  );
}
