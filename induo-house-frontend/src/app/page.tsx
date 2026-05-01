'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, KeyRound, Map, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchDock } from '@/components/SearchDock';
import { getProperties } from '@/lib/properties';
import { PropertyListItem } from '@/types';

const heroImages = [
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=90',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1100&q=90',
];

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);

  useEffect(() => {
    getProperties({ size: 6 }).then((data) => setProperties(data.content)).catch(() => setProperties([]));
  }, []);

  return (
    <>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow"><Sparkles size={16} /> Nowy standard szukania mieszkań</span>
              <h1>Dom, który wygląda dobrze już na etapie szukania.</h1>
              <p className="hero-lead">
                InduoHouse łączy katalog nieruchomości z dopracowanym doświadczeniem użytkownika:
                duże zdjęcia, czytelne dane i szybkie przejście do kontaktu.
              </p>
              <div className="hero-actions">
                <Link href="/properties" className="btn-primary">Przeglądaj oferty <ArrowRight size={18} /></Link>
                <Link href="/properties/create" className="btn-secondary">Dodaj ogłoszenie</Link>
              </div>
            </div>

            <div className="showcase" aria-hidden="true">
              <div className="showcase-card showcase-main">
                <Image src={heroImages[0]} alt="" fill unoptimized priority />
              </div>
              <div className="showcase-card showcase-side">
                <Image src={heroImages[1]} alt="" fill unoptimized />
              </div>
              <div className="floating-panel">
                <strong>38</strong>
                <span>miast z aktywnymi ofertami i wygodnym filtrowaniem</span>
              </div>
            </div>
          </div>
        </section>

        <SearchDock />

        <section className="section">
          <div className="container">
            <div className="stats-grid">
              <Stat value="2.4k+" label="ofert w katalogu" />
              <Stat value="120+" label="nowych ofert dziennie" />
              <Stat value="8 min" label="średni czas porównania" />
              <Stat value="24/7" label="dostęp do zapisanych ofert" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">Dlaczego inaczej</span>
                <h2 className="section-title">Mniej hałasu, więcej decyzji.</h2>
              </div>
              <Link href="/properties" className="btn-ghost">Katalog ofert <ArrowRight size={17} /></Link>
            </div>
            <div className="feature-grid">
              <Feature icon={<Map size={26} />} title="Czytelna lokalizacja" text="Miasto, parametry i cena są widoczne bez przekopywania się przez opis." />
              <Feature dark icon={<KeyRound size={26} />} title="Szybki kontakt" text="Dane właściciela i szczegóły oferty są zawsze blisko najważniejszych informacji." />
              <Feature warm icon={<ShieldCheck size={26} />} title="Panel dla sprzedających" text="Dodawanie ofert ma prowadzić przez proces, nie straszyć formularzem." />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">Najnowsze</span>
                <h2 className="section-title">Oferty gotowe do obejrzenia.</h2>
              </div>
            </div>
            <div className="property-grid">
              {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="stat-card"><strong>{value}</strong><span>{label}</span></div>;
}

function Feature({ icon, title, text, dark, warm }: { icon: React.ReactNode; title: string; text: string; dark?: boolean; warm?: boolean }) {
  return (
    <div className={`feature-card ${dark ? 'dark' : ''} ${warm ? 'warm' : ''}`}>
      <div>{icon}</div>
      <div><h3>{title}</h3><p>{text}</p></div>
    </div>
  );
}
