'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Home, LogOut, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">InduoHouse Dashboard</h1>
            </div>

            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Witaj, {user.firstName || user.email}!
              </h2>
              <p className="text-gray-600">
                Zalogowany jako: {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informacje o koncie
          </h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Imię</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.firstName || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nazwisko</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.lastName || '-'}</dd>
            </div>
            {user.phoneNumber && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.phoneNumber}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Szybkie akcje
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={() => router.push('/properties/create')}
            >
              Dodaj ogłoszenie
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/properties')}
            >
              Przeglądaj oferty
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/profile')}
            >
              Edytuj profil
            </Button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Autentykacja działa!</strong> Token JWT jest przechowywany w httpOnly cookie i automatycznie wysyłany z każdym requestem do backendu.
          </p>
        </div>
      </main>
    </div>
  );
}
