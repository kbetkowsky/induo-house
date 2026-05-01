'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { ArrowLeft, Camera, Check, Home, MapPin, UploadCloud, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createProperty, uploadPropertyImage } from '@/lib/properties';

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as { message?: string; error?: string } | undefined;
    return responseData?.message ?? responseData?.error ?? 'Błąd podczas dodawania ogłoszenia';
  }
  return 'Błąd podczas dodawania ogłoszenia';
}

export default function CreatePropertyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
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
  });
  const [images, setImages] = useState<File[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (user === null) router.push('/login');
  }, [router, user]);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview)), [previews]);

  if (user === null) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    setPreviews((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    if (primaryIndex === index) setPrimaryIndex(0);
    else if (primaryIndex > index) setPrimaryIndex((prev) => prev - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const property = await createProperty({
        title: form.title,
        description: form.description,
        price: Number.parseFloat(form.price),
        area: Number.parseFloat(form.area),
        city: form.city,
        street: form.street,
        postalCode: form.postalCode,
        numberOfRooms: form.numberOfRooms ? Number.parseInt(form.numberOfRooms, 10) : null,
        floor: form.floor ? Number.parseInt(form.floor, 10) : null,
        totalFloors: form.totalFloors ? Number.parseInt(form.totalFloors, 10) : null,
        propertyType: form.propertyType,
        transactionType: form.transactionType,
      });

      for (let index = 0; index < images.length; index += 1) {
        await uploadPropertyImage(property.id, images[index], index === primaryIndex);
      }
      router.push(`/properties/${property.id}`);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-page">
      <section className="create-hero">
        <button type="button" onClick={() => router.back()}><ArrowLeft size={17} /> Wróć</button>
        <span><Home size={16} /> Nowe ogłoszenie</span>
        <h1>Dodaj nieruchomość w formie, która dobrze się sprzedaje.</h1>
        <p>Uzupełnij najważniejsze dane, dodaj zdjęcia i opublikuj ofertę w katalogu.</p>
      </section>

      <form className="create-layout" onSubmit={handleSubmit}>
        <div className="create-main">
          {error && <div className="form-error">{error}</div>}

          <section className="form-section">
            <div className="form-section-head">
              <span>01</span>
              <div>
                <h2>Podstawy ogłoszenia</h2>
                <p>Nazwa i opis powinny szybko wyjaśniać, co wyróżnia ofertę.</p>
              </div>
            </div>

            <label className="form-field">
              <span>Tytuł</span>
              <div><input name="title" value={form.title} onChange={handleChange} required placeholder="np. Jasne 3 pokoje blisko parku" /></div>
            </label>

            <label className="form-field">
              <span>Opis</span>
              <div><textarea name="description" value={form.description} onChange={handleChange} required rows={6} placeholder="Opisz układ, standard, lokalizację i najważniejsze atuty..." /></div>
            </label>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <span>02</span>
              <div>
                <h2>Parametry</h2>
                <p>Cena, typ transakcji i dane techniczne nieruchomości.</p>
              </div>
            </div>

            <div className="form-grid-two">
              <label className="form-field">
                <span>Typ</span>
                <div>
                  <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                    <option value="APARTMENT">Mieszkanie</option>
                    <option value="HOUSE">Dom</option>
                    <option value="LAND">Działka</option>
                    <option value="COMMERCIAL">Lokal</option>
                  </select>
                </div>
              </label>
              <label className="form-field">
                <span>Transakcja</span>
                <div>
                  <select name="transactionType" value={form.transactionType} onChange={handleChange}>
                    <option value="SALE">Sprzedaż</option>
                    <option value="RENT">Wynajem</option>
                  </select>
                </div>
              </label>
              <label className="form-field">
                <span>Cena</span>
                <div><input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="650000" /></div>
              </label>
              <label className="form-field">
                <span>Powierzchnia m²</span>
                <div><input type="number" step="0.01" name="area" value={form.area} onChange={handleChange} required placeholder="72" /></div>
              </label>
              <label className="form-field">
                <span>Pokoje</span>
                <div><input type="number" name="numberOfRooms" value={form.numberOfRooms} onChange={handleChange} placeholder="3" /></div>
              </label>
              <label className="form-field">
                <span>Piętro</span>
                <div><input type="number" name="floor" value={form.floor} onChange={handleChange} placeholder="2" /></div>
              </label>
              <label className="form-field">
                <span>Pięter w budynku</span>
                <div><input type="number" name="totalFloors" value={form.totalFloors} onChange={handleChange} placeholder="5" /></div>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <span>03</span>
              <div>
                <h2>Lokalizacja</h2>
                <p>Adres pomaga kupującym szybciej ocenić dopasowanie oferty.</p>
              </div>
            </div>

            <div className="form-grid-two">
              <label className="form-field">
                <span>Miasto</span>
                <div><MapPin size={18} /><input name="city" value={form.city} onChange={handleChange} required placeholder="Kraków" /></div>
              </label>
              <label className="form-field">
                <span>Kod pocztowy</span>
                <div><input name="postalCode" value={form.postalCode} onChange={handleChange} required pattern="\d{2}-\d{3}" placeholder="31-000" /></div>
              </label>
            </div>

            <label className="form-field">
              <span>Ulica</span>
              <div><input name="street" value={form.street} onChange={handleChange} required placeholder="Floriańska 5" /></div>
            </label>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <span>04</span>
              <div>
                <h2>Zdjęcia</h2>
                <p>Pierwsze zdjęcie będzie miniaturą ogłoszenia.</p>
              </div>
            </div>

            <label className="upload-zone">
              <UploadCloud size={30} />
              <strong>Dodaj zdjęcia nieruchomości</strong>
              <span>JPG, PNG lub WebP, maksymalnie 10 MB na plik</span>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            </label>

            {previews.length > 0 && (
              <div className="preview-grid">
                {previews.map((src, index) => (
                  <div key={src} className={index === primaryIndex ? 'active' : ''}>
                    <Image src={src} alt="" width={320} height={210} unoptimized />
                    {index === primaryIndex && <span><Check size={13} /> Główne</span>}
                    <button type="button" onClick={() => setPrimaryIndex(index)} className="preview-primary" title="Ustaw jako główne">
                      <Camera size={14} />
                    </button>
                    <button type="button" onClick={() => removeImage(index)} className="preview-remove" title="Usuń zdjęcie">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="create-summary">
          <h2>Publikacja</h2>
          <p>Po zapisaniu oferta pojawi się w katalogu. Zdjęcia zostaną dodane po utworzeniu ogłoszenia.</p>
          <div>
            <span>Tytuł</span>
            <strong>{form.title || 'Jeszcze bez tytułu'}</strong>
          </div>
          <div>
            <span>Lokalizacja</span>
            <strong>{form.city || 'Nie podano miasta'}</strong>
          </div>
          <div>
            <span>Zdjęcia</span>
            <strong>{images.length}</strong>
          </div>
          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Publikowanie...' : 'Opublikuj ogłoszenie'}
          </button>
          <button type="button" className="form-secondary" onClick={() => router.back()}>
            Anuluj
          </button>
        </aside>
      </form>
    </main>
  );
}
