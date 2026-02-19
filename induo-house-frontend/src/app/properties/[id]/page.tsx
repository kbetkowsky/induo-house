'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPropertyById } from '@/lib/properties';
import { Property, PropertyImage } from '@/types';
import Link from 'next/link';
import { MapPin, Square, BedDouble, Layers, Phone, Mail, ChevronLeft, ChevronRight, Home } from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<PropertyImage | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        const primary = data.images?.find(img => img.isPrimary) ?? data.images?.[0] ?? null;
        setActiveImage(primary);
      } catch (e) {
        console.error(e);
        setError('Nie udało się załadować ogłoszenia.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0,
    }).format(price);

  const translateType = (type: string) => {
    const map: Record<string, string> = {
      APARTMENT: 'Mieszkanie',
      HOUSE: 'Dom',
      LAND: 'Działka',
      COMMERCIAL: 'Komercyjne',
    };
    return map[type] || type;
  };

  const translateTransaction = (type: string) =>
    type === 'SALE' ? 'Sprzedaż' : 'Wynajem';

  const prevImage = () => {
    if (!property?.images || !activeImage) return;
    const idx = property.images.findIndex(img => img.id === activeImage.id);
    const prev = property.images[(idx - 1 + property.images.length) % property.images.length];
    setActiveImage(prev);
  };

  const nextImage = () => {
    if (!property?.images || !activeImage) return;
    const idx = property.images.findIndex(img => img.id === activeImage.id);
    const next = property.images[(idx + 1) % property.images.length];
    setActiveImage(next);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 text-lg">{error || 'Nie znaleziono ogłoszenia.'}</p>
        <Link href="/" className="text-blue-600 hover:underline">← Powrót do listy</Link>
      </div>
    );
  }

  const hasImages = property.images && property.images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:underline w-fit">
            <ChevronLeft className="h-4 w-4" />
            Powrót do listy
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-xl shadow overflow-hidden">
            {hasImages && activeImage ? (
              <>
                <div className="relative h-80 md:h-[480px] bg-gray-200">
                  <img
                    src={activeImage.url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded-full">
                        {property.images.findIndex(i => i.id === activeImage.id) + 1} / {property.images.length}
                      </div>
                    </>
                  )}
                </div>

                {property.images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                    {property.images.map(img => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(img)}
                        className={`flex-shrink-0 h-16 w-24 rounded overflow-hidden border-2 transition-all ${
                          img.id === activeImage.id
                            ? 'border-blue-500 opacity-100'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-80 bg-gray-200 flex items-center justify-center text-gray-400">
                <Home className="h-20 w-20" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Opis ogłoszenia</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {property.description || 'Brak opisu.'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Szczegóły</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500">Typ nieruchomości</div>
              <div className="font-medium">{translateType(property.propertyType)}</div>

              <div className="text-gray-500">Transakcja</div>
              <div className="font-medium">{translateTransaction(property.transactionType)}</div>

              <div className="text-gray-500">Powierzchnia</div>
              <div className="font-medium">{property.area} m²</div>

              {property.numberOfRooms && (
                <>
                  <div className="text-gray-500">Liczba pokoi</div>
                  <div className="font-medium">{property.numberOfRooms}</div>
                </>
              )}

              {property.floor !== null && property.floor !== undefined && (
                <>
                  <div className="text-gray-500">Piętro</div>
                  <div className="font-medium">
                    {property.floor} {property.totalFloors ? `/ ${property.totalFloors}` : ''}
                  </div>
                </>
              )}

              <div className="text-gray-500">Miasto</div>
              <div className="font-medium">{property.city}</div>

              {property.street && (
                <>
                  <div className="text-gray-500">Ulica</div>
                  <div className="font-medium">{property.street}</div>
                </>
              )}

              {property.postalCode && (
                <>
                  <div className="text-gray-500">Kod pocztowy</div>
                  <div className="font-medium">{property.postalCode}</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cena */}
          <div className="bg-white rounded-xl shadow p-6 sticky top-6">
            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                {translateType(property.propertyType)} · {translateTransaction(property.transactionType)}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-sm mt-2 mb-4">
              <MapPin className="h-4 w-4" />
              <span>{property.city}{property.street ? `, ${property.street}` : ''}</span>
            </div>

            <div className="text-3xl font-bold text-blue-600 mb-1">
              {formatPrice(property.price)}
            </div>
            {property.transactionType === 'RENT' && (
              <p className="text-gray-500 text-sm">miesięcznie</p>
            )}

            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              {property.area && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span>{property.area} m²</span>
                </div>
              )}
              {property.numberOfRooms && (
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  <span>{property.numberOfRooms} pok.</span>
                </div>
              )}
              {property.floor !== null && property.floor !== undefined && (
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span>Piętro {property.floor}</span>
                </div>
              )}
            </div>

            <div className="border-t mt-6 pt-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Kontakt z ogłoszeniodawcą</h3>
              <p className="font-semibold text-gray-900 mb-3">
                {property.owner.firstName} {property.owner.lastName}
              </p>
              <div className="space-y-2">
                <a
                  href={`mailto:${property.owner.email}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {property.owner.email}
                </a>
                {property.owner.phoneNumber && (
                  <a
                    href={`tel:${property.owner.phoneNumber}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {property.owner.phoneNumber}
                  </a>
                )}
            <button
              onClick={() => handleDeleteImage(property.id, image.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
            const handleDeleteImage = async (propertyId: number, imageId: number) => {
              if (!confirm('Usunąć zdjęcie?')) return;
              await fetch(`http://localhost:8080/api/properties/${propertyId}/images/${imageId}`, {
                method: 'DELETE',
                credentials: 'include',
              });
            };
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
