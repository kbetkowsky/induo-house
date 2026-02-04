'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters, { FilterParams } from '@/components/PropertyFilters';
import { Property } from '@/lib/types';
import {
  getProperties,
  getPropertiesByCity,
  getPropertiesByType,
  getPropertiesByPriceRange
} from '@/lib/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});

  // Fetch properties based on filters
  const fetchProperties = async (currentFilters: FilterParams) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      // Priorytet filtrów: price > city > type
      if (currentFilters.minPrice !== undefined && currentFilters.maxPrice !== undefined) {
        response = await getPropertiesByPriceRange(currentFilters.minPrice, currentFilters.maxPrice);
      } else if (currentFilters.city && currentFilters.city.trim() !== '') {
        response = await getPropertiesByCity(currentFilters.city);
      } else if (currentFilters.type && currentFilters.type !== '') {
        response = await getPropertiesByType(currentFilters.type);
      } else {
        response = await getProperties();
      }

      // Filtruj po transactionType (frontend filter bo nie ma endpointu)
      let filteredProperties = response.content || [];

      if (currentFilters.transactionType && currentFilters.transactionType !== '') {
        filteredProperties = filteredProperties.filter(
          (p: Property) => p.transactionType === currentFilters.transactionType
        );
      }

      setProperties(filteredProperties);
    } catch (e: any) {
      setError('Nie udało się pobrać nieruchomości');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProperties(filters);
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Dostępne nieruchomości
      </h1>

      {/* Filtry */}
      <PropertyFilters onFilterChange={handleFilterChange} />

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Ładowanie...</p>
        </div>
      )}

      {/* No results */}
      {!loading && properties.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            Brak nieruchomości spełniających kryteria
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && properties.length > 0 && (
        <>
          <div className="mb-4 text-gray-600">
            Znaleziono: <span className="font-semibold">{properties.length}</span> nieruchomości
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
