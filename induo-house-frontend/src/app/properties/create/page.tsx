'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UploadCloud, X } from 'lucide-react';

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
  const [primaryIndex, setPrimaryIndex] = useState<number>(0);
  const [previews, setPreviews] = useState<string[]>([]);

  // ← PRZENIESIONE z renderowania do useEffect
  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  if (user === null) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    if (primaryIndex === index) setPrimaryIndex(0);
    else if (primaryIndex > index) setPrimaryIndex(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/properties', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          area: parseFloat(form.area),
          city: form.city,
          street: form.street,
          postalCode: form.postalCode,
          numberOfRooms: form.numberOfRooms ? parseInt(form.numberOfRooms) : null,
          floor: form.floor ? parseInt(form.floor) : null,
          totalFloors: form.totalFloors ? parseInt(form.totalFloors) : null,
          propertyType: form.propertyType,
          transactionType: form.transactionType,
        }),
      });

      if (!response.ok) throw new Error('Błąd podczas dodawania ogłoszenia');
      const property = await response.json();
      const propertyId = property.id;

      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append('file', images[i]);
        formData.append('isPrimary', String(i === primaryIndex));
        await fetch(`http://localhost:8080/api/properties/${propertyId}/images`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
      }

      router.push(`/properties/${propertyId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Dodaj ogłoszenie</h1>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Tytuł *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Opis *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className="w-full border rounded-lg px-4 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Typ *</label>
            <select name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full border rounded-lg px-4 py-2">
              <option value="APARTMENT">Mieszkanie</option>
              <option value="HOUSE">Dom</option>
              <option value="LAND">Działka</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Transakcja *</label>
            <select name="transactionType" value={form.transactionType} onChange={handleChange} className="w-full border rounded-lg px-4 py-2">
              <option value="SALE">Sprzedaż</option>
              <option value="RENT">Wynajem</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cena (zł) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Powierzchnia (m²) *</label>
            <input type="number" step="0.01" name="area" value={form.area} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Liczba pokoi</label>
            <input type="number" name="numberOfRooms" value={form.numberOfRooms} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Piętro</label>
            <input type="number" name="floor" value={form.floor} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pięter w budynku</label>
            <input type="number" name="totalFloors" value={form.totalFloors} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Miasto *</label>
            <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kod pocztowy *</label>
            <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required pattern="\d{2}-\d{3}" className="w-full border rounded-lg px-4 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ulica *</label>
          <input type="text" name="street" value={form.street} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Zdjęcia</label>
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
            <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Kliknij aby dodać zdjęcia</span>
            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 10MB każde</span>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
          </label>

          {previews.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Kliknij gwiazdkę ⭐ aby ustawić zdjęcie główne</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className={`relative rounded-lg overflow-hidden border-2 ${i === primaryIndex ? 'border-blue-500' : 'border-gray-200'}`}>
                    <img src={src} alt="" className="w-full h-28 object-cover" />
                    {i === primaryIndex && (
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">Główne</div>
                    )}
                    <button type="button" onClick={() => setPrimaryIndex(i)} className="absolute top-1 right-7 text-yellow-400 hover:text-yellow-500 text-base leading-none" title="Ustaw jako główne">⭐</button>
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <button type="button" onClick={() => router.back()} className="flex-1 border py-3 rounded-xl hover:bg-gray-50">Anuluj</button>
          <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Dodawanie...' : 'Dodaj ogłoszenie'}
          </button>
        </div>
      </form>
    </div>
  );
}
