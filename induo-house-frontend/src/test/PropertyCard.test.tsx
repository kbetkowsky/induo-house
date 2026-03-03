import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from '@/components/PropertyCard';
import { PropertyListResponse } from '@/types/property';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockProperty: PropertyListResponse = {
  id: 1,
  title: 'Przestronne mieszkanie w centrum',
  price: 650000,
  area: 72,
  city: 'Kraków',
  numberOfRooms: 3,
  transactionType: 'SALE',
  propertyType: 'APARTMENT',
  status: 'ACTIVE',
  thumbnailUrl: null,
  ownerFirstName: 'Jan',
  ownerLastName: 'Kowalski',
  ownerPhoneNumber: '123456789',
};

describe('PropertyCard', () => {
  beforeEach(() => localStorageMock.clear());

  it('renders property title', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Przestronne mieszkanie w centrum')).toBeInTheDocument();
  });

  it('renders city', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/kraków/i)).toBeInTheDocument();
  });

  it('renders formatted price in PLN', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/650\s*000/)).toBeInTheDocument();
  });

  it('renders "Sprzedaż" badge for SALE transaction', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/sprzedaż/i)).toBeInTheDocument();
  });

  it('renders "Wynajem" badge for RENT transaction', () => {
    render(<PropertyCard property={{ ...mockProperty, transactionType: 'RENT' }} />);
    expect(screen.getByText(/wynajem/i)).toBeInTheDocument();
  });

  it('renders "Mieszkanie" type label', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Mieszkanie')).toBeInTheDocument();
  });

  it('renders owner name', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/jan kowalski/i)).toBeInTheDocument();
  });

  it('renders placeholder icon when no image', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('🏠')).toBeInTheDocument();
  });

  it('toggles favorite on heart button click', () => {
    render(<PropertyCard property={mockProperty} />);
    const favBtn = screen.getByTitle(/dodaj do ulubionych/i);
    fireEvent.click(favBtn);
    expect(screen.getByTitle(/usuń z ulubionych/i)).toBeInTheDocument();
  });
});
