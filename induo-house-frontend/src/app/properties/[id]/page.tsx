'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPropertyById, deleteProperty } from '@/lib/properties';
import { apiClient } from '@/lib/api';
import { Property, PropertyImage } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  MapPin, Square, BedDouble, Layers, Phone, Mail,
  ChevronLeft, ChevronRight, Home, Trash2, X, Building2
} from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = Number(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<PropertyImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        const primary = data.images?.find(img => img.isPrimary) ?? data.images?.[0] ?? null;
        setActiveImage(primary);
      } catch (e) {
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

  const typeMap: Record<string, string> = {
    APARTMENT: 'Mieszkanie',
    HOUSE: 'Dom',
    LAND: 'Działka',
    COMMERCIAL: 'Komercyjne',
  };

  const translateTransaction = (type: string) =>
    type === 'SALE' ? 'Sprzedaż' : 'Wynajem';

  const prevImage = () => {
    if (!property?.images || !activeImage) return;
    const idx = property.images.findIndex(img => img.id === activeImage.id);
    setActiveImage(property.images[(idx - 1 + property.images.length) % property.images.length]);
  };

  const nextImage = () => {
    if (!property?.images || !activeImage) return;
    const idx = property.images.findIndex(img => img.id === activeImage.id);
    setActiveImage(property.images[(idx + 1) % property.images.length]);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!property) return;
    if (!confirm('Czy na pewno chcesz usunąć to zdjęcie?')) return;
    try {
      await apiClient.delete(`/properties/${property.id}/images/${imageId}`);
      const updatedImages = property.images?.filter(img => img.id !== imageId) ?? [];
      setProperty({ ...property, images: updatedImages });
      if (activeImage?.id === imageId) {
        setActiveImage(updatedImages[0] ?? null);
      }
      toast.success('Zdjęcie usunięte');
    } catch {
      toast.error('Nie udało się usunąć zdjęcia');
    }
  };

  const handleDeleteProperty = async () => {
    if (!property) return;
    if (!confirm('Czy na pewno chcesz usunąć to ogłoszenie? Tej operacji nie można cofnąć.')) return;
    try {
      setIsDeleting(true);
      await deleteProperty(property.id);
      toast.success('Ogłoszenie zostało usunięte');
      router.push('/');
    } catch {
      toast.error('Nie udało się usunąć ogłoszenia');
      setIsDeleting(false);
    }
  };

  const isOwner = user && property && user.id === property.owner.id;

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
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-blue-600 hover:underline text-sm">
            <ChevronLeft className="h-4 w-4" />
            Powrót do listy
          </Link>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link href={`/properties/${property.id}/edit`}>
                <Button variant="outline" size="sm">Edytuj ogłoszenie</Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteProperty}
                isLoading={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Usuń ogłoszenie
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {hasImages && activeImage ? (
              <>
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={activeImage.url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {isOwner && (
                    <button
                      onClick={() => handleDeleteImage(activeImage.id)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                      title="Usuń to zdjęcie"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {property.images!.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                        {property.images!.findIndex(i => i.id === activeImage.id) + 1} / {property.images!.length}
                      </div>
                    </>
                  )}
                </div>

                {property.images!.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                    {property.images!.map(img => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(img)}
                        className={`relative flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                          img.id === activeImage.id
                            ? 'border-blue-500 opacity-100 ring-2 ring-blue-200'
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
              <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center text-gray-300 gap-3">
                <Building2 className="h-20 w-20" />
                <span className="text-sm text-gray-400">Brak zdjęć</span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Opis ogłoszenia</h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">
              {property.description || 'Brak opisu.'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Szczegóły nieruchomości</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Typ nieruchomości', typeMap[property.propertyType] ?? property.propertyType],
                ['Transakcja', translateTransaction(property.transactionType)],
                ['Powierzchnia', `${property.area} m²`],
                property.numberOfRooms ? ['Liczba pokoi', String(property.numberOfRooms)] : null,
                property.floor != null ? ['Piętro', `${property.floor}${property.totalFloors ? ` / ${property.totalFloors}` : ''}`] : null,
                ['Miasto', property.city],
                property.street ? ['Ulica', property.street] : null,
                property.postalCode ? ['Kod pocztowy', property.postalCode] : null,
              ].filter(Boolean).map(([label, value]) => (
                <>
                  <div className="text-gray-500">{label}</div>
                  <div className="font-medium text-gray-900">{value}</div>
                </>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
              {typeMap[property.propertyType]} · {translateTransaction(property.transactionType)}
            </span>

            <h1 className="text-xl font-bold text-gray-900 leading-snug mb-2">
              {property.title}
            </h1>

            <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{property.city}{property.street ? `, ${property.street}` : ''}</span>
            </div>

            <div className="text-3xl font-bold text-blue-600 mb-1">
              {formatPrice(property.price)}
            </div>
            {property.transactionType === 'RENT' && (
              <p className="text-gray-400 text-xs mb-1">miesięcznie</p>
            )}
            {property.area > 0 && (
              <p className="text-gray-400 text-xs">
                {new Intl.NumberFormat('pl-PL').format(Math.round(property.price / property.area))} PLN/m²
              </p>
            )}

            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 flex-wrap">
              {property.area && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  {property.area} m²
                </div>
              )}
              {property.numberOfRooms && (
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  {property.numberOfRooms} pok.
                </div>
              )}
              {property.floor != null && (
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  Piętro {property.floor}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 mt-5 pt-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Kontakt z agentem</h3>
              <p className="font-semibold text-gray-900 mb-3">
                {property.owner.firstName} {property.owner.lastName}
              </p>
              <div className="space-y-2.5">
                <a
                  href={`mailto:${property.owner.email}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  {property.owner.email}
                </a>
                {property.owner.phoneNumber && (
                  <a
                    href={`tel:${property.owner.phoneNumber}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    {property.owner.phoneNumber}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
