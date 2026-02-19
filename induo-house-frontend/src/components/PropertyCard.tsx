'use client';

import { Property } from '@/types';
import Link from 'next/link';
import { MapPin, BedDouble, Square, Tag, ArrowUpRight } from 'lucide-react';

export function PropertyCard({ property }: { property: Property }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0,
    }).format(price);

  const typeMap: Record<string, string> = {
    APARTMENT: 'Mieszkanie',
    HOUSE: 'Dom',
    LAND: 'Działka',
    COMMERCIAL: 'Komercyjne',
  };

  const pricePerM2 = property.area > 0 ? Math.round(property.price / property.area) : null;

  return (
    <Link href={`/properties/${property.id}`} className="group block h-full">
      <div className="relative h-full rounded-2xl border border-white/6 bg-[#111827] overflow-hidden card-hover">

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
          {property.thumbnailUrl ? (
            <img
              src={property.thumbnailUrl}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-slate-700 flex flex-col items-center gap-2">
                <Square className="h-10 w-10" />
                <span className="text-xs">Brak zdjęcia</span>
              </div>
            </div>
          )}

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10">
              {typeMap[property.propertyType] ?? property.propertyType}
            </span>
          </div>

          {/* Transaction badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border ${
              property.transactionType === 'SALE'
                ? 'bg-blue-600/70 text-blue-100 border-blue-500/30'
                : 'bg-amber-500/70 text-amber-100 border-amber-400/30'
            }`}>
              {property.transactionType === 'SALE' ? 'Sprzedaż' : 'Wynajem'}
            </span>
          </div>

          {/* Arrow icon */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-blue-300 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{property.city}{property.street ? `, ${property.street}` : ''}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            {property.area > 0 && (
              <span className="flex items-center gap-1">
                <Square className="h-3 w-3" />
                {property.area} m²
              </span>
            )}
            {property.numberOfRooms && property.numberOfRooms > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3 w-3" />
                {property.numberOfRooms} pok.
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 my-0.5" />

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-white">{formatPrice(property.price)}</p>
              {pricePerM2 && (
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <Tag className="h-2.5 w-2.5" />
                  {new Intl.NumberFormat('pl-PL').format(pricePerM2)} PLN/m²
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom glow line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
}
