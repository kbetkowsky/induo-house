const KEY = 'induo-house-favorites';

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as number[];
  } catch {
    return [];
  }
}

export function isFavorite(id: number) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: number) {
  const current = getFavorites();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('favorites:change'));
  return next.includes(id);
}
