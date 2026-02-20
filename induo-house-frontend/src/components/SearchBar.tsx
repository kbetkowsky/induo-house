"use client";

import { useState } from "react";
import { SearchParams } from "@/types/property";

interface Props {
  onSearch: (params: Partial<SearchParams>) => void;
  currentParams: SearchParams;
}

export default function SearchBar({ onSearch, currentParams }: Props) {
  const [city, setCity] = useState(currentParams.city || "");
  const [propertyType, setPropertyType] = useState(currentParams.propertyType || "");
  const [transactionType, setTransactionType] = useState(currentParams.transactionType || "");
  const [minPrice, setMinPrice] = useState(currentParams.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice?.toString() || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      city: city.trim() || undefined,
      propertyType: propertyType || undefined,
      transactionType: transactionType || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setCity(""); setPropertyType(""); setTransactionType("");
    setMinPrice(""); setMaxPrice("");
    onSearch({});
  };

  const inp: React.CSSProperties = {
    padding: "11px 14px", borderRadius: 8, border: "1px solid #e0e0e0",
    fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none",
    background: "#fff", transition: "border-color 0.2s",
  };
  const lbl: React.CSSProperties = {
    display: "block", fontSize: 11, color: "#888", marginBottom: 5,
    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#fff", borderRadius: 16, padding: "20px 24px",
      boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
    }}>
      {/* GŁÓWNY RZĄD */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
        <div>
          <label style={lbl}>Miasto lub region</label>
          <input
            type="text"
            placeholder="np. Warszawa, Kraków, Gdańsk..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Oferta</label>
          <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} style={inp}>
            <option value="">Wszystkie</option>
            <option value="SALE">Sprzedaż</option>
            <option value="RENT">Wynajem</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Rodzaj</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} style={inp}>
            <option value="">Wszystkie</option>
            <option value="APARTMENT">Mieszkanie</option>
            <option value="HOUSE">Dom</option>
            <option value="LAND">Działka</option>
          </select>
        </div>
        <button type="submit" style={{
          padding: "11px 26px", background: "#2d6a9f", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700,
          cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s",
        }}>
          🔍 Szukaj
        </button>
      </div>

      {/* TOGGLE FILTRÓW */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} style={{
          background: "none", border: "none", color: "#2d6a9f",
          cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0,
        }}>
          {showAdvanced ? "▲ Ukryj filtry cenowe" : "▼ Filtruj po cenie"}
        </button>
        {(city || propertyType || transactionType || minPrice || maxPrice) && (
          <button type="button" onClick={handleReset} style={{
            background: "none", border: "none", color: "#999",
            cursor: "pointer", fontSize: 12, padding: 0,
          }}>
            ✕ Wyczyść filtry
          </button>
        )}
      </div>

      {showAdvanced && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <div>
            <label style={lbl}>Cena minimalna (PLN)</label>
            <input type="number" min={0} placeholder="np. 200 000" value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Cena maksymalna (PLN)</label>
            <input type="number" min={0} placeholder="np. 800 000" value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)} style={inp} />
          </div>
        </div>
      )}
    </form>
  );
}
