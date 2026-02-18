'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

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

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

      if (!response.ok) throw new Error('Błąd podczas dodawania');

      const data = await response.json();
      alert('Ogłoszenie dodane pomyślnie!');
      router.push('/');
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
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Opis *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border rounded-lg px-4 py-2"
          />
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

        <div className="flex gap-4">
          <button type="button" onClick={() => router.back()} className="flex-1 border py-3 rounded-xl">
            Anuluj
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl">
            {loading ? 'Dodawanie...' : 'Dodaj ogłoszenie'}
          </button>
        </div>

      </form>
    </div>
  );
}
