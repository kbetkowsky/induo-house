import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/SearchBar';

const defaultParams = {};

describe('SearchBar', () => {
  it('renders city input and search button', () => {
    render(<SearchBar onSearch={vi.fn()} currentParams={defaultParams} />);
    expect(screen.getByPlaceholderText(/warszawa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /szukaj/i })).toBeInTheDocument();
  });

  it('calls onSearch with city value on submit', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} currentParams={defaultParams} />);

    await userEvent.type(screen.getByPlaceholderText(/warszawa/i), 'Kraków');
    fireEvent.submit(screen.getByRole('button', { name: /szukaj/i }).closest('form')!);

    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'Kraków' })
    );
  });

  it('calls onSearch with empty object on reset', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} currentParams={{ city: 'Gdańsk' }} />);

    const resetBtn = screen.getByRole('button', { name: /wyczyść/i });
    await userEvent.click(resetBtn);

    expect(onSearch).toHaveBeenCalledWith({});
  });

  it('shows price inputs after clicking "Filtruj po cenie"', async () => {
    render(<SearchBar onSearch={vi.fn()} currentParams={defaultParams} />);

    expect(screen.queryByPlaceholderText(/200 000/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /filtruj po cenie/i }));

    expect(screen.getByPlaceholderText(/200 000/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/800 000/i)).toBeInTheDocument();
  });

  it('calls onSearch with minPrice and maxPrice when advanced filters used', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} currentParams={defaultParams} />);

    await userEvent.click(screen.getByRole('button', { name: /filtruj po cenie/i }));
    await userEvent.type(screen.getByPlaceholderText(/200 000/i), '300000');
    await userEvent.type(screen.getByPlaceholderText(/800 000/i), '600000');
    fireEvent.submit(screen.getByRole('button', { name: /szukaj/i }).closest('form')!);

    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ minPrice: 300000, maxPrice: 600000 })
    );
  });
});
