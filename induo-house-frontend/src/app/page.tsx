'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/Button';
import { getProperties, PropertyFilters } from '@/lib/properties';
import { Property } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Home, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchProperties();
  }, [currentPage]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getProperties({
        page: currentPage,
        size: 12,
      });

      setProperties(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError('Nie udało się załadować ofert. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Home className="h-12 w-12 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">InduoHouse</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8">
              Znajdź swój wymarzony dom lub mieszkanie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="secondary" size="lg">
                      Moje konto
                    </Button>
                  </Link>
                  <Link href="/properties/create">
                    <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Plus className="h-5 w-5 mr-2" />
                      Dodaj ogłoszenie
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <Button variant="secondary" size="lg">
                      Zarejestruj się
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Zaloguj się
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dostępne oferty</h2>
            {!isLoading && (
              <p className="text-gray-600 mt-1">
                Znaleziono {totalElements} {totalElements === 1 ? 'ofertę' : 'ofert'}
              </p>
            )}
          </div>
          <Button variant="outline" size="md">
            <Search className="h-5 w-5 mr-2" />
            Filtruj
          </Button>
        </div>
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ładowanie ofert...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">{error}</p>
            <Button
              onClick={fetchProperties}
              variant="outline"
              className="mt-4"
            >
              Spróbuj ponownie
            </Button>
          </div>
        )}
        {!isLoading && !error && properties.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Brak dostępnych ofert
            </h3>
            <p className="text-gray-600 mb-6">
              Nie znaleziono żadnych nieruchomości. Dodaj pierwszą ofertę!
            </p>
            {user && (
              <Link href="/properties/create">
                <Button variant="primary">
                  <Plus className="h-5 w-5 mr-2" />
                  Dodaj ogłoszenie
                </Button>
              </Link>
            )}
          </div>
        )}

        {!isLoading && !error && properties.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Poprzednia
                </Button>

                <span className="text-gray-600 mx-4">
                  Strona {currentPage + 1} z {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Następna
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              &copy; 2026 InduoHouse. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
