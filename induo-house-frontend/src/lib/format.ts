const typeLabels: Record<string, string> = {
  APARTMENT: 'Mieszkanie',
  HOUSE: 'Dom',
  LAND: 'Działka',
  COMMERCIAL: 'Lokal',
};

const transactionLabels: Record<string, string> = {
  SALE: 'Sprzedaż',
  RENT: 'Wynajem',
};

export function money(value: number) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(value);
}

export function number(value: number) {
  return new Intl.NumberFormat('pl-PL').format(value);
}

export function typeLabel(value?: string) {
  return value ? typeLabels[value] || value : 'Nieruchomość';
}

export function transactionLabel(value?: string) {
  return value ? transactionLabels[value] || value : 'Oferta';
}

export function pricePerMeter(price: number, area: number) {
  if (!area) return null;
  return `${number(Math.round(price / area))} zł/m²`;
}
