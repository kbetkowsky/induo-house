'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Search } from 'lucide-react';

export function SearchDock() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [transactionType, setTransactionType] = useState('SALE');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (transactionType) params.set('transactionType', transactionType);
    if (propertyType) params.set('propertyType', propertyType);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minArea) params.set('minArea', minArea);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div className="search-dock">
      <div className="container">
        <div className="search-card">
          <form className="search-form" onSubmit={submit}>
            <div className="field">
              <label>Lokalizacja</label>
              <div className="field-box"><MapPin size={18} /><input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Miasto lub dzielnica" /></div>
            </div>
            <div className="field">
              <label>Transakcja</label>
              <div className="field-box"><select value={transactionType} onChange={(event) => setTransactionType(event.target.value)}><option value="SALE">Sprzedaż</option><option value="RENT">Wynajem</option></select></div>
            </div>
            <div className="field">
              <label>Typ</label>
              <div className="field-box"><Building2 size={18} /><select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}><option value="">Dowolny</option><option value="APARTMENT">Mieszkanie</option><option value="HOUSE">Dom</option><option value="LAND">Działka</option></select></div>
            </div>
            <div className="field">
              <label>Cena do</label>
              <div className="field-box"><input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} type="number" placeholder="900000" /></div>
            </div>
            <div className="field">
              <label>Metraż od</label>
              <div className="field-box"><input value={minArea} onChange={(event) => setMinArea(event.target.value)} type="number" placeholder="45" /></div>
            </div>
            <button className="btn-primary" type="submit"><Search size={18} /> Szukaj</button>
          </form>
        </div>
      </div>
    </div>
  );
}
