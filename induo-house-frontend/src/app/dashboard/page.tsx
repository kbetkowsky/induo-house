'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import {
  Building2, LogOut, User, Mail, Phone, Shield,
  Plus, ArrowRight, Home, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const isAgent = user.role === 'AGENT' || user.role === 'ADMIN';

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map(s => s![0].toUpperCase())
    .join('') || user.email[0].toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
            <Building2 className="h-5 w-5" />
            <span className="hidden sm:inline">InduoHouse</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Strona główna</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Wyloguj</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Welcome hero */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">Witaj w panelu,</p>
              <h1 className="text-2xl font-bold">
                {user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user.email}
              </h1>
              {isAgent && (
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mt-3">
                  <Shield className="h-3 w-3" />
                  Agent nieruchomości
                </span>
              )}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
              {initials}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                Dane konta
              </h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isAgent
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {user.role ?? 'USER'}
              </span>
            </div>

            <div className="space-y-4">
              {[
                { icon: <Mail className="h-4 w-4" />, label: 'Email', value: user.email },
                { icon: <User className="h-4 w-4" />, label: 'Imię i nazwisko', value: user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : '—' },
                { icon: <Phone className="h-4 w-4" />, label: 'Telefon', value: user.phoneNumber ?? '—' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-slate-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {isAgent && (
              <Link href="/properties/create" className="block">
                <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl p-5 text-white cursor-pointer group">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-1">Dodaj ogłoszenie</h3>
                  <p className="text-blue-100 text-xs">Opublikuj nową ofertę nieruchomości</p>
                  <ArrowRight className="h-4 w-4 mt-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}

            <Link href="/properties" className="block">
              <div className="bg-white hover:bg-slate-50 transition-colors rounded-2xl border border-slate-100 p-5 cursor-pointer group shadow-sm">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="h-5 w-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Przeglądaj oferty</h3>
                <p className="text-slate-400 text-xs">Znajdź wymarzoną nieruchomość</p>
                <ArrowRight className="h-4 w-4 mt-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {isAgent && (
              <Link href="/dashboard/my-properties" className="block">
                <div className="bg-white hover:bg-slate-50 transition-colors rounded-2xl border border-slate-100 p-5 cursor-pointer group shadow-sm">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Moje ogłoszenia</h3>
                  <p className="text-slate-400 text-xs">Zarządzaj swoimi ofertami</p>
                  <ArrowRight className="h-4 w-4 mt-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
