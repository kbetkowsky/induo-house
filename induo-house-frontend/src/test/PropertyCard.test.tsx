import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyListItem } from '@/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const property: PropertyListItem = {
  id: 1,
  title: 'Apartament przy parku',
  price: 780000,
  area: 64,
  city: 'Kraków',
  numberOfRooms: 3,
  transactionType: 'SALE',
  propertyType: 'APARTMENT',
  status: 'ACTIVE',
  thumbnailUrl: null,
  ownerFirstName: 'Anna',
  ownerLastName: 'Nowak',
  ownerPhoneNumber: '123456789',
};

describe('PropertyCard', () => {
  it('renders key listing information', () => {
    render(<PropertyCard property={property} />);

    expect(screen.getByText('Apartament przy parku')).toBeInTheDocument();
    expect(screen.getByText('Kraków')).toBeInTheDocument();
    expect(screen.getByText('Mieszkanie')).toBeInTheDocument();
    expect(screen.getByText('Sprzedaż')).toBeInTheDocument();
    expect(screen.getByLabelText('Brak zdjęcia')).toBeInTheDocument();
  });
});
