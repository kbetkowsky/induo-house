'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trees,
} from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { PropertyListResponse } from '@/types/property';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type ListingPage = {
  content: PropertyListResponse[];
  totalPages: number;
  totalElements: number;
};

async function fetchProperties(
  page = 0,
  size = 12,
  filters: Record<string, string> = {}
): Promise<ListingPage> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort: 'createdAt,desc',
      ...filters,
    });
    const res = await fetch(`${API_BASE}/api/properties?${params}`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) return { content: [], totalPages: 0, totalElements: 0 };
    const data = await res.json();
    return {
      content: data.content ?? [],
      totalPages: data.totalPages ?? 0,
      totalElements: data.totalElements ?? 0,
    };
  } catch {
    return { content: [], totalPages: 0, totalElements: 0 };
  }
}

const PROPERTY_TYPES = [
  { value: '', label: 'Dowolny typ' },
  { value: 'APARTMENT', label: 'Mieszkanie' },
  { value: 'HOUSE', label: 'Dom' },
  { value: 'LAND', label: 'Działka' },
  { value: 'COMMERCIAL', label: 'Lokal' },
];

const CATEGORIES = [
  {
    label: 'Apartamenty miejskie',
    type: 'APARTMENT',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=85',
  },
  {
    label: 'Domy rodzinne',
    type: 'HOUSE',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85',
  },
  {
    label: 'Działki i tereny',
    type: 'LAND',
    icon: Trees,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=85',
  },
];

const MARKET_STATS = [
  { label: 'aktywnych ofert', value: '2.4k+' },
  { label: 'miast w Polsce', value: '38' },
  { label: 'nowych ofert dziennie', value: '120+' },
];

export default function HomePage() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<'SALE' | 'RENT'>('SALE');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [areaFrom, setAreaFrom] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['home-properties', transactionType, page],
    queryFn: () => fetchProperties(page, 12, { transactionType }),
  });

  const listings = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set('transactionType', transactionType);
    if (city.trim()) params.set('city', city.trim());
    if (propertyType) params.set('propertyType', propertyType);
    if (priceFrom) params.set('minPrice', priceFrom);
    if (priceTo) params.set('maxPrice', priceTo);
    if (areaFrom) params.set('minArea', areaFrom);
    router.push(`/properties?${params.toString()}`);
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 560, behavior: 'smooth' });
  };

  const changeTransaction = (next: 'SALE' | 'RENT') => {
    setTransactionType(next);
    setPage(0);
  };

  return (
    <div className="home-shell">
      <section className="home-hero">
        <Image
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1800&q=90"
          alt="Nowoczesny salon z widokiem na miasto"
          fill
          priority
          unoptimized
          className="home-hero-image"
        />
        <div className="home-hero-shade" />
        <div className="home-hero-content">
          <div className="home-hero-copy">
            <span className="home-eyebrow">
              <Sparkles size={16} />
              Oferty mieszkań, domów i działek w jednym miejscu
            </span>
            <h1>Znajdź adres, który pasuje do Twojego życia.</h1>
            <p>
              Przeglądaj aktualne ogłoszenia, filtruj po lokalizacji i cenie, a potem
              przejdź prosto do szczegółów nieruchomości bez zbędnego szumu.
            </p>
            <div className="home-hero-actions">
              <Link href="/properties?transactionType=SALE" className="home-primary-link">
                Zobacz oferty
                <ArrowRight size={18} />
              </Link>
              <Link href="/properties/create" className="home-secondary-link">
                Dodaj ogłoszenie
              </Link>
            </div>
          </div>

          <form className="home-search-panel" onSubmit={submitSearch}>
            <div className="home-search-tabs" role="tablist" aria-label="Rodzaj transakcji">
              <button
                type="button"
                className={transactionType === 'SALE' ? 'active' : ''}
                onClick={() => changeTransaction('SALE')}
              >
                Sprzedaż
              </button>
              <button
                type="button"
                className={transactionType === 'RENT' ? 'active' : ''}
                onClick={() => changeTransaction('RENT')}
              >
                Wynajem
              </button>
            </div>

            <label className="home-field home-field-wide">
              <span>Lokalizacja</span>
              <div>
                <MapPin size={18} />
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Warszawa, Kraków, Wrocław..."
                />
              </div>
            </label>

            <label className="home-field">
              <span>Typ</span>
              <div>
                <Building2 size={18} />
                <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="home-field">
              <span>Cena od</span>
              <div>
                <input
                  value={priceFrom}
                  onChange={(event) => setPriceFrom(event.target.value)}
                  type="number"
                  placeholder="300000"
                />
                <strong>zł</strong>
              </div>
            </label>

            <label className="home-field">
              <span>Cena do</span>
              <div>
                <input
                  value={priceTo}
                  onChange={(event) => setPriceTo(event.target.value)}
                  type="number"
                  placeholder="900000"
                />
                <strong>zł</strong>
              </div>
            </label>

            <label className="home-field">
              <span>Metraż od</span>
              <div>
                <input
                  value={areaFrom}
                  onChange={(event) => setAreaFrom(event.target.value)}
                  type="number"
                  placeholder="45"
                />
                <strong>m²</strong>
              </div>
            </label>

            <button className="home-search-button" type="submit">
              <Search size={19} />
              Szukaj
            </button>
          </form>
        </div>
      </section>

      <section className="home-stats" aria-label="Statystyki rynku">
        {MARKET_STATS.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
        <div className="home-stats-note">
          <ShieldCheck size={19} />
          Oferty z czytelnymi danymi kontaktowymi
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <div>
            <span className="home-section-kicker">Kategorie</span>
            <h2>Wybierz typ nieruchomości</h2>
          </div>
          <Link href="/properties">
            Wszystkie oferty
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="home-category-grid">
          {CATEGORIES.map(({ label, type, icon: Icon, image }) => (
            <Link
              key={type}
              href={`/properties?propertyType=${type}&transactionType=${transactionType}`}
              className="home-category-card"
            >
              <Image src={image} alt={label} width={640} height={420} unoptimized />
              <span>
                <Icon size={20} />
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section home-listings-section">
        <div className="home-section-head">
          <div>
            <span className="home-section-kicker">Najnowsze</span>
            <h2>{transactionType === 'SALE' ? 'Mieszkania i domy na sprzedaż' : 'Mieszkania i domy do wynajęcia'}</h2>
            {totalElements > 0 && (
              <p>{totalElements.toLocaleString('pl-PL')} aktywnych ogłoszeń w tej kategorii</p>
            )}
          </div>
          <div className="home-listing-controls">
            <button
              className={transactionType === 'SALE' ? 'active' : ''}
              onClick={() => changeTransaction('SALE')}
              type="button"
            >
              Sprzedaż
            </button>
            <button
              className={transactionType === 'RENT' ? 'active' : ''}
              onClick={() => changeTransaction('RENT')}
              type="button"
            >
              Wynajem
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="home-listings-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="home-listing-skeleton">
                <div />
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="home-listings-grid">
            {listings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="home-empty-state">
            <SlidersHorizontal size={34} />
            <h3>Brak ogłoszeń dla tego widoku</h3>
            <p>Spróbuj zmienić typ transakcji albo przejdź do pełnej listy ofert.</p>
            <Link href="/properties">Przeglądaj wszystkie</Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="home-pagination">
            <button onClick={() => changePage(page - 1)} disabled={page === 0} type="button">
              <ChevronLeft size={17} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, index) => {
              let pageNumber = index;
              if (totalPages > 7) {
                if (page < 4) pageNumber = index;
                else if (page > totalPages - 5) pageNumber = totalPages - 7 + index;
                else pageNumber = page - 3 + index;
              }
              return (
                <button
                  key={pageNumber}
                  className={pageNumber === page ? 'active' : ''}
                  onClick={() => changePage(pageNumber)}
                  type="button"
                >
                  {pageNumber + 1}
                </button>
              );
            })}
            <button onClick={() => changePage(page + 1)} disabled={page >= totalPages - 1} type="button">
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </section>

      <section className="home-editorial">
        <div>
          <span className="home-section-kicker">Dla kupujących</span>
          <h2>Porównuj oferty bez chaosu.</h2>
          <p>
            Karty ogłoszeń pokazują najważniejsze dane od razu: cenę, metraż,
            liczbę pokoi i lokalizację. Reszta czeka w szczegółach oferty.
          </p>
          <Link href="/properties">
            Otwórz katalog ofert
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-editorial-grid">
          <span><BedDouble size={18} /> układ i pokoje</span>
          <span><Bath size={18} /> wygodne filtry</span>
          <span><MapPin size={18} /> lokalizacja</span>
          <span><ShieldCheck size={18} /> kontakt do właściciela</span>
        </div>
      </section>
    </div>
  );
}
