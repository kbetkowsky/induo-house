'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { UploadCloud, X } from 'lucide-react';
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
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  if (user === null) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    setPreviews((prev) => prev.filter((_, currentIndex) => currentIndex !== index));

    if (primaryIndex === index) {
      setPrimaryIndex(0);
    } else if (primaryIndex > index) {
      setPrimaryIndex((prev) => prev - 1);
    }
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Dodaj ogłoszenie</h1>

      {error && (
        <div className="mb-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Tytuł *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full rounded-lg border px-4 py-2" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Opis *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className="w-full rounded-lg border px-4 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Typ *</label>
            <select name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full rounded-lg border px-4 py-2">
              <option value="APARTMENT">Mieszkanie</option>
              <option value="HOUSE">Dom</option>
              <option value="LAND">Działka</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Transakcja *</label>
            <select name="transactionType" value={form.transactionType} onChange={handleChange} className="w-full rounded-lg border px-4 py-2">
              <option value="SALE">Sprzedaż</option>
              <option value="RENT">Wynajem</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Cena (zł) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full rounded-lg border px-4 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Powierzchnia (m²) *</label>
            <input type="number" step="0.01" name="area" value={form.area} onChange={handleChange} required className="w-full rounded-lg border px-4 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Liczba pokoi</label>
            <input type="number" name="numberOfRooms" value={form.numberOfRooms} onChange={handleChange} className="w-full rounded-lg border px-4 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Piętro</label>
            <input type="number" name="floor" value={form.floor} onChange={handleChange} className="w-full rounded-lg border px-4 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Pięter w budynku</label>
            <input type="number" name="totalFloors" value={form.totalFloors} onChange={handleChange} className="w-full rounded-lg border px-4 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Miasto *</label>
            <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full rounded-lg border px-4 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Kod pocztowy *</label>
            <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required pattern="\d{2}-\d{3}" className="w-full rounded-lg border px-4 py-2" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ulica *</label>
          <input type="text" name="street" value={form.street} onChange={handleChange} required className="w-full rounded-lg border px-4 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Zdjęcia</label>
          <label className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:bg-gray-50">
            <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500">Kliknij, aby dodać zdjęcia</span>
            <span className="mt-1 text-xs text-gray-400">JPG, PNG, WebP - max 10MB każde</span>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
          </label>

          {previews.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-gray-500">Kliknij gwiazdkę, aby ustawić zdjęcie główne</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {previews.map((src, index) => (
                  <div key={src} className={`relative overflow-hidden rounded-lg border-2 ${index === primaryIndex ? 'border-blue-500' : 'border-gray-200'}`}>
                    <Image src={src} alt="" className="h-28 w-full object-cover" width={320} height={112} unoptimized />
                    {index === primaryIndex && (
                      <div className="absolute left-1 top-1 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">Główne</div>
                    )}
                    <button type="button" onClick={() => setPrimaryIndex(index)} className="absolute right-7 top-1 text-base leading-none text-yellow-400 hover:text-yellow-500" title="Ustaw jako główne">
                      *
                    </button>
                    <button type="button" onClick={() => removeImage(index)} className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <button type="button" onClick={() => router.back()} className="flex-1 rounded-xl border py-3 hover:bg-gray-50">
            Anuluj
          </button>
          <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Dodawanie...' : 'Dodaj ogłoszenie'}
          </button>
        </div>
      </form>
    </div>
  );
}
