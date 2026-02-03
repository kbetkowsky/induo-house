import { getProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';

export default async function PropertiesPage() {
  let properties = [];
  let error = null;

  try {
    const response = await getProperties();
    console.log('API Response:', response);

    // Sprawdź czy response to tablica czy obiekt z tablicą
    if (Array.isArray(response)) {
      properties = response;
    } else if (response && Array.isArray(response.content)) {
      // Spring Boot często zwraca paginated response z polem 'content'
      properties = response.content;
    } else if (response && typeof response === 'object') {
      // Jeśli to obiekt, wyświetl jego strukturę
      console.error('Unexpected response format:', response);
      error = `Nieoczekiwany format odpowiedzi: ${JSON.stringify(Object.keys(response))}`;
    }
  } catch (e: any) {
    error = e.message || 'Nie udało się pobrać nieruchomości. Upewnij się, że backend działa na http://localhost:8080';
    console.error('Error fetching properties:', e);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Dostępne nieruchomości
        </h1>
        <a
          href="/properties/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + Dodaj ogłoszenie
        </a>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {properties.length === 0 && !error ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            Brak nieruchomości w bazie danych
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
