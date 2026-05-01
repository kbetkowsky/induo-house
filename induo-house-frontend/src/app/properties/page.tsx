'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, ChevronLeft, ChevronRight, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { getProperties, PropertyFilters } from '@/lib/properties';
import { PropertyListResponse } from '@/types/property';

const PROPERTY_TYPES = [
  { value: '', label: 'Wszystkie typy' },
  { value: 'APARTMENT', label: 'Mieszkania' },
  { value: 'HOUSE', label: 'Domy' },
  { value: 'LAND', label: 'Działki' },
  { value: 'COMMERCIAL', label: 'Lokale' },
];

const TRANSACTION_TYPES = [
  { value: '', label: 'Wszystkie' },
  { value: 'SALE', label: 'Sprzedaż' },
  { value: 'RENT', label: 'Wynajem' },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}

function PropertiesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listRef = useRef<HTMLDivElement>(null);

  const [city, setCity] = useState(searchParams.get('city') ?? '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') ?? '');
  const [transactionType, setTransactionType] = useState(searchParams.get('transactionType') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [minArea, setMinArea] = useState(searchParams.get('minArea') ?? '');
  const [maxArea, setMaxArea] = useState(searchParams.get('maxArea') ?? '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') ?? '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') ?? 0));
  const [properties, setProperties] = useState<PropertyListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const debouncedCity = useDebounce(city, 350);
  const debouncedMinPrice = useDebounce(minPrice, 450);
  const debouncedMaxPrice = useDebounce(maxPrice, 450);
  const debouncedMinArea = useDebounce(minArea, 450);
  const debouncedMaxArea = useDebounce(maxArea, 450);

  const buildFilters = useCallback((): PropertyFilters => ({
    city: debouncedCity || undefined,
    propertyType: propertyType || undefined,
    transactionType: transactionType || undefined,
    minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
    maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
    minArea: debouncedMinArea ? Number(debouncedMinArea) : undefined,
    maxArea: debouncedMaxArea ? Number(debouncedMaxArea) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    page: currentPage,
    size: 12,
  }), [bedrooms, currentPage, debouncedCity, debouncedMaxArea, debouncedMaxPrice, debouncedMinArea, debouncedMinPrice, propertyType, transactionType]);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProperties(buildFilters());
      setProperties(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Nie udało się pobrać ofert. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  }, [buildFilters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (propertyType) params.set('propertyType', propertyType);
    if (transactionType) params.set('transactionType', transactionType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minArea) params.set('minArea', minArea);
    if (maxArea) params.set('maxArea', maxArea);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (currentPage) params.set('page', String(currentPage));
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  }, [bedrooms, city, currentPage, maxArea, maxPrice, minArea, minPrice, propertyType, router, transactionType]);

  useEffect(() => {
    setCurrentPage(0);
  }, [bedrooms, debouncedCity, debouncedMaxArea, debouncedMaxPrice, debouncedMinArea, debouncedMinPrice, propertyType, transactionType]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const clearFilters = () => {
    setCity('');
    setPropertyType('');
    setTransactionType('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setBedrooms('');
    setCurrentPage(0);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasFilters = city || propertyType || transactionType || minPrice || maxPrice || minArea || maxArea || bedrooms;

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <span><SlidersHorizontal size={16} /> Katalog nieruchomości</span>
        <h1>Oferty, które da się szybko porównać.</h1>
        <p>Filtruj mieszkania, domy i działki po cenie, metrażu, typie transakcji oraz lokalizacji.</p>
      </section>

      <section className="catalog-layout" ref={listRef}>
        <aside className="catalog-filters">
          <div className="catalog-filter-head">
            <h2>Filtry</h2>
            {hasFilters && (
              <button type="button" onClick={clearFilters}>
                <RotateCcw size={15} />
                Reset
              </button>
            )}
          </div>

          <label className="form-field">
            <span>Miasto</span>
            <div>
              <Search size={18} />
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="np. Kraków" />
            </div>
          </label>

          <label className="form-field">
            <span>Transakcja</span>
            <div>
              <select value={transactionType} onChange={(event) => setTransactionType(event.target.value)}>
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </label>

          <label className="form-field">
            <span>Typ nieruchomości</span>
            <div>
              <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </label>

          <div className="form-grid-two">
            <label className="form-field">
              <span>Cena od</span>
              <div><input type="number" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="300000" /></div>
            </label>
            <label className="form-field">
              <span>Cena do</span>
              <div><input type="number" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="900000" /></div>
            </label>
          </div>

          <div className="form-grid-two">
            <label className="form-field">
              <span>Metraż od</span>
              <div><input type="number" value={minArea} onChange={(event) => setMinArea(event.target.value)} placeholder="45" /></div>
            </label>
            <label className="form-field">
              <span>Metraż do</span>
              <div><input type="number" value={maxArea} onChange={(event) => setMaxArea(event.target.value)} placeholder="120" /></div>
            </label>
          </div>

          <label className="form-field">
            <span>Pokoje</span>
            <div>
              <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
                <option value="">Dowolnie</option>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}+</option>
                ))}
              </select>
            </div>
          </label>
        </aside>

        <div className="catalog-results">
          <div className="catalog-results-head">
            <div>
              <span>{isLoading ? 'Szukam ofert...' : `${totalElements.toLocaleString('pl-PL')} ofert`}</span>
              <h2>{transactionType === 'RENT' ? 'Nieruchomości do wynajęcia' : transactionType === 'SALE' ? 'Nieruchomości na sprzedaż' : 'Wszystkie nieruchomości'}</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="home-listings-grid">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="home-listing-skeleton"><div /><span /><span /><span /></div>
              ))}
            </div>
          ) : error ? (
            <div className="catalog-empty">
              <Building2 size={38} />
              <h3>Coś poszło nie tak</h3>
              <p>{error}</p>
              <button type="button" onClick={fetchProperties}>Spróbuj ponownie</button>
            </div>
          ) : properties.length === 0 ? (
            <div className="catalog-empty">
              <Building2 size={38} />
              <h3>Brak wyników</h3>
              <p>Zmień filtry lub wyczyść kryteria wyszukiwania.</p>
              {hasFilters && <button type="button" onClick={clearFilters}>Wyczyść filtry</button>}
            </div>
          ) : (
            <>
              <div className="catalog-grid">
                {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
              </div>

              {totalPages > 1 && (
                <div className="home-pagination">
                  <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 0} type="button">
                    <ChevronLeft size={17} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, index) => {
                    let pageNumber = index;
                    if (totalPages > 7) {
                      if (currentPage < 4) pageNumber = index;
                      else if (currentPage > totalPages - 5) pageNumber = totalPages - 7 + index;
                      else pageNumber = currentPage - 3 + index;
                    }
                    return (
                      <button
                        key={pageNumber}
                        className={pageNumber === currentPage ? 'active' : ''}
                        onClick={() => changePage(pageNumber)}
                        type="button"
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  })}
                  <button onClick={() => changePage(currentPage + 1)} disabled={currentPage >= totalPages - 1} type="button">
                    <ChevronRight size={17} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<main className="catalog-page" />}>
      <PropertiesPageInner />
    </Suspense>
  );
}
