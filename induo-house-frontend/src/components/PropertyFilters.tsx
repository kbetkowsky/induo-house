'use client';

import { useState } from 'react';

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterParams) => void;
}

export interface FilterParams {
  city?: string;
  type?: 'APARTMENT' | 'HOUSE' | 'LAND' | '';
  transactionType?: 'SALE' | 'RENT' | '';
  minPrice?: number;
  maxPrice?: number;
}

export default function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterParams>({
    city: '',
    type: '',
    transactionType: '',
    minPrice: undefined,
    maxPrice: undefined,
  });

  const handleChange = (field: keyof FilterParams, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: FilterParams = {
      city: '',
      type: '',
      transactionType: '',
      minPrice: undefined,
      maxPrice: undefined,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Filtry</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Miasto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Miasto
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="np. Warsaw, Kraków"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Typ nieruchomości */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typ nieruchomości
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wszystkie</option>
            <option value="APARTMENT">Mieszkanie</option>
            <option value="HOUSE">Dom</option>
            <option value="LAND">Działka</option>
          </select>
        </div>

        {/* Transakcja */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rodzaj transakcji
          </label>
          <select
            value={filters.transactionType}
            onChange={(e) => handleChange('transactionType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wszystkie</option>
            <option value="SALE">Sprzedaż</option>
            <option value="RENT">Wynajem</option>
          </select>
        </div>

        {/* Cena MIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cena min (PLN)
          </label>
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cena MAX */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cena max (PLN)
          </label>
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="999999999"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Reset button */}
      <div className="mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Wyczyść filtry
        </button>
      </div>
    </div>
  );
}
