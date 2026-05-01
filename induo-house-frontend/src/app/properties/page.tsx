'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RotateCcw, Search } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
import { getProperties } from '@/lib/properties';
import { number } from '@/lib/format';
import { PropertyListItem } from '@/types';

function PropertiesInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [city, setCity] = useState(params.get('city') || '');
  const [transactionType, setTransactionType] = useState(params.get('transactionType') || '');
  const [propertyType, setPropertyType] = useState(params.get('propertyType') || '');
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [minArea, setMinArea] = useState(params.get('minArea') || '');
  const [page, setPage] = useState(Number(params.get('page') || 0));
  const [items, setItems] = useState<PropertyListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getProperties({
      city: city || undefined,
      transactionType: transactionType || undefined,
      propertyType: propertyType || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minArea: minArea ? Number(minArea) : undefined,
      page,
      size: 12,
    }).catch(() => ({ content: [], totalElements: 0, totalPages: 0 }));
    setItems(data.content);
    setTotal(data.totalElements);
    setPages(data.totalPages);
    setLoading(false);
  }, [city, maxPrice, minArea, minPrice, page, propertyType, transactionType]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (city) next.set('city', city);
    if (transactionType) next.set('transactionType', transactionType);
    if (propertyType) next.set('propertyType', propertyType);
    if (minPrice) next.set('minPrice', minPrice);
    if (maxPrice) next.set('maxPrice', maxPrice);
    if (minArea) next.set('minArea', minArea);
    if (page) next.set('page', String(page));
    router.replace(`/properties?${next.toString()}`, { scroll: false });
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [city, load, maxPrice, minArea, minPrice, page, propertyType, router, transactionType]);

  function reset() {
    setCity('');
    setTransactionType('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setPage(0);
  }

  return (
    <main className="page">
      <section className="container page-hero">
        <span className="eyebrow"><Search size={16} /> Katalog ofert</span>
        <h1>Wybierz nieruchomość bez kompromisu w doświadczeniu.</h1>
        <p>Profesjonalny listing z filtrami, dużymi kartami i szybkim dostępem do szczegółów.</p>
      </section>
      <section className="container catalog-layout">
        <aside className="panel filters">
          <div className="filters-head">
            <h2>Filtry</h2>
            <button className="btn-ghost" type="button" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
          <Field label="Miasto"><input value={city} onChange={(e) => { setCity(e.target.value); setPage(0); }} placeholder="Kraków" /></Field>
          <Field label="Transakcja"><select value={transactionType} onChange={(e) => { setTransactionType(e.target.value); setPage(0); }}><option value="">Dowolna</option><option value="SALE">Sprzedaż</option><option value="RENT">Wynajem</option></select></Field>
          <Field label="Typ"><select value={propertyType} onChange={(e) => { setPropertyType(e.target.value); setPage(0); }}><option value="">Dowolny</option><option value="APARTMENT">Mieszkanie</option><option value="HOUSE">Dom</option><option value="LAND">Działka</option></select></Field>
          <Field label="Cena od"><input type="number" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(0); }} placeholder="300000" /></Field>
          <Field label="Cena do"><input type="number" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }} placeholder="900000" /></Field>
          <Field label="Metraż od"><input type="number" value={minArea} onChange={(e) => { setMinArea(e.target.value); setPage(0); }} placeholder="45" /></Field>
        </aside>
        <div>
          <div className="results-head">
            <div>
              <span className="section-kicker">{loading ? 'Ładowanie' : `${number(total)} ofert`}</span>
              <h2>{transactionType === 'RENT' ? 'Do wynajęcia' : transactionType === 'SALE' ? 'Na sprzedaż' : 'Wszystkie oferty'}</h2>
            </div>
          </div>
          {loading ? <SkeletonGrid /> : items.length ? (
            <>
              <div className="property-grid">{items.map((item) => <PropertyCard key={item.id} property={item} />)}</div>
              {pages > 1 && <div className="button-row">{Array.from({ length: pages }).slice(0, 8).map((_, index) => <button className={index === page ? 'btn-primary' : 'btn-secondary'} key={index} onClick={() => setPage(index)}>{index + 1}</button>)}</div>}
            </>
          ) : <div className="panel empty"><h2>Brak wyników</h2><p>Zmień filtry albo wyczyść kryteria wyszukiwania.</p><button className="btn-secondary" onClick={reset}>Wyczyść filtry</button></div>}
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span><div className="field-box">{children}</div></label>;
}

function SkeletonGrid() {
  return <div className="property-grid">{Array.from({ length: 6 }).map((_, i) => <div className="property-card" style={{ minHeight: 390 }} key={i} />)}</div>;
}

export default function PropertiesPage() {
  return <Suspense fallback={<main className="page" />}><PropertiesInner /></Suspense>;
}
