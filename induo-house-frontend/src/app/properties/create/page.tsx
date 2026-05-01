'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, Check, UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { createProperty, uploadPropertyImage } from '@/lib/properties';
import { CreatePropertyPayload, PropertyType, TransactionType } from '@/types';

type FormState = Record<keyof CreatePropertyPayload, string>;

const initial: FormState = {
  title: '',
  description: '',
  price: '',
  area: '',
  city: '',
  street: '',
  postalCode: '',
  numberOfRooms: '',
  floor: '',
  totalFloors: '',
  propertyType: 'APARTMENT',
  transactionType: 'SALE',
};

export default function CreatePropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [primary, setPrimary] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user === null) router.push('/login');
  }, [router, user]);

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  if (user === null) return null;

  function update(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const next = Array.from(event.target.files || []);
    setFiles((current) => [...current, ...next]);
    setPreviews((current) => [...current, ...next.map((file) => URL.createObjectURL(file))]);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload: CreatePropertyPayload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        area: Number(form.area),
        city: form.city,
        street: form.street,
        postalCode: form.postalCode,
        numberOfRooms: form.numberOfRooms ? Number(form.numberOfRooms) : null,
        floor: form.floor ? Number(form.floor) : null,
        totalFloors: form.totalFloors ? Number(form.totalFloors) : null,
        propertyType: form.propertyType as PropertyType,
        transactionType: form.transactionType as TransactionType,
      };
      const property = await createProperty(payload);
      for (let index = 0; index < files.length; index += 1) {
        await uploadPropertyImage(property.id, files[index], index === primary);
      }
      router.push(`/properties/${property.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się opublikować ogłoszenia');
    } finally {
      setLoading(false);
    }
  }

  function remove(index: number) {
    URL.revokeObjectURL(previews[index]);
    setFiles((current) => current.filter((_, i) => i !== index));
    setPreviews((current) => current.filter((_, i) => i !== index));
    if (primary === index) setPrimary(0);
  }

  return (
    <main className="page">
      <section className="container page-hero">
        <span className="eyebrow">Publikacja oferty</span>
        <h1>Dodaj ogłoszenie, które wygląda profesjonalnie od pierwszego kliknięcia.</h1>
        <p>Uzupełnij parametry, lokalizację i zdjęcia. Po zapisie oferta trafi do katalogu.</p>
      </section>
      <form className="container create-layout" onSubmit={submit}>
        <div className="create-stack">
          {error ? <div className="error">{error}</div> : null}
          <Panel title="Opis oferty">
            <Field label="Tytuł"><input name="title" value={form.title} onChange={update} required placeholder="Jasne 3 pokoje z balkonem" /></Field>
            <Field label="Opis"><textarea name="description" value={form.description} onChange={update} rows={6} placeholder="Opisz standard, układ i najważniejsze atuty..." /></Field>
          </Panel>
          <Panel title="Parametry">
            <div className="form-grid">
              <Field label="Typ"><select name="propertyType" value={form.propertyType} onChange={update}><option value="APARTMENT">Mieszkanie</option><option value="HOUSE">Dom</option><option value="LAND">Działka</option></select></Field>
              <Field label="Transakcja"><select name="transactionType" value={form.transactionType} onChange={update}><option value="SALE">Sprzedaż</option><option value="RENT">Wynajem</option></select></Field>
              <Field label="Cena"><input name="price" type="number" value={form.price} onChange={update} required placeholder="780000" /></Field>
              <Field label="Metraż"><input name="area" type="number" step="0.01" value={form.area} onChange={update} required placeholder="64" /></Field>
              <Field label="Pokoje"><input name="numberOfRooms" type="number" value={form.numberOfRooms} onChange={update} placeholder="3" /></Field>
              <Field label="Piętro"><input name="floor" type="number" value={form.floor} onChange={update} placeholder="2" /></Field>
            </div>
          </Panel>
          <Panel title="Lokalizacja">
            <div className="form-grid">
              <Field label="Miasto"><input name="city" value={form.city} onChange={update} required placeholder="Kraków" /></Field>
              <Field label="Kod pocztowy"><input name="postalCode" value={form.postalCode} onChange={update} required placeholder="31-000" pattern="\d{2}-\d{3}" /></Field>
            </div>
            <Field label="Ulica"><input name="street" value={form.street} onChange={update} placeholder="Floriańska 5" /></Field>
          </Panel>
          <Panel title="Zdjęcia">
            <label className="upload-zone">
              <div><UploadCloud size={34} /><h3>Dodaj zdjęcia nieruchomości</h3><p>JPG, PNG lub WebP. Pierwsze zdjęcie będzie miniaturą.</p></div>
              <input type="file" accept="image/*" multiple onChange={addFiles} />
            </label>
            {previews.length ? (
              <div className="preview-grid">
                {previews.map((src, index) => (
                  <div className={index === primary ? 'preview active' : 'preview'} key={src}>
                    <Image src={src} alt="" width={320} height={220} unoptimized />
                    <button type="button" className="primary" onClick={() => setPrimary(index)} title="Ustaw jako główne">{index === primary ? <Check size={15} /> : <Camera size={15} />}</button>
                    <button type="button" className="remove" onClick={() => remove(index)} title="Usuń"><X size={15} /></button>
                  </div>
                ))}
              </div>
            ) : null}
          </Panel>
        </div>
        <aside className="panel side-summary">
          <h2>Podsumowanie</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>Oferta zostanie opublikowana po utworzeniu rekordu i wysłaniu zdjęć.</p>
          <div className="facts" style={{ display: 'grid', margin: '22px 0' }}>
            <span>{form.title || 'Brak tytułu'}</span>
            <span>{form.city || 'Brak miasta'}</span>
            <span>{files.length} zdjęć</span>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} disabled={loading} type="submit">{loading ? 'Publikowanie...' : 'Opublikuj'}</button>
        </aside>
      </form>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="panel create-card"><h2>{title}</h2>{children}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span><div className="field-box">{children}</div></label>;
}
