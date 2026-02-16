'use client';

import { Property } from '@/types';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const translateType = (type: string) => {
    const translations: Record<string, string> = {
      APARTMENT: 'Mieszkanie',
      HOUSE: 'Dom',
      LAND: 'Działka',
      COMMERCIAL: 'Komercyjne',
    };
    return translations[type] || type;
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-200">
          {property.imageUrl ? (
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Square className="h-16 w-16" />
            </div>
          )}

          <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {translateType(property.propertyType)}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.city}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {property.area && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area} m²</span>
              </div>
            )}
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-gray-200">
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
