"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { PropertyListResponse, PageResponse, SearchParams } from "@/types/property";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchProperties(params: SearchParams): Promise<PageResponse<PropertyListResponse>> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 0));
  query.set("size", String(params.size ?? 12));
  if (params.sort) query.set("sort", params.sort);

  if (params.city)            query.set("city", params.city);
  if (params.propertyType)    query.set("propertyType", params.propertyType);
  if (params.transactionType) query.set("transactionType", params.transactionType);
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));

  const url = `${API_BASE}/api/properties/search?${query.toString()}`;

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Błąd pobierania ogłoszeń");
  const data = await res.json();

  if ("number" in data) {
    return {
      content: data.content,
      currentPage: data.number,
      pageSize: data.size,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      last: data.last,
      first: data.first,
    };
  }
  return data;
}

export default function Home() {
  const [properties, setProperties] = useState<PropertyListResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<SearchParams>({
    page: 0,
    size: 12,
    sort: "createdAt,desc",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProperties(params);
      setProperties(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError("Nie udało się załadować ogłoszeń.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (newParams: Partial<SearchParams>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 0 }));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams((prev) => ({ ...prev, sort: e.target.value, page: 0 }));
  };

  const handlePage = (p: number) => {
    setParams((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      {/* HERO + WYSZUKIWARKA */}
      <section style={{
        background: "linear-gradient(135deg, #1a3c5e 0%, #2d6a9f 100%)",
        padding: "48px 16px 64px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, marginBottom: 8, margin: "0 0 8px" }}>
            Znajdź swoje wymarzone miejsce
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 32, fontSize: 16 }}>
            Tysiące ofert nieruchomości w całej Polsce
          </p>
          <SearchBar onSearch={handleSearch} currentParams={params} />
        </div>
      </section>

      {/* WYNIKI */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>
        {/* Pasek wyników + sortowanie */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20, flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ color: "#555", fontSize: 14 }}>
            {loading ? "Ładowanie..." : `Znaleziono ${totalElements.toLocaleString("pl-PL")} ogłoszeń`}
          </span>
          <select
            onChange={handleSort}
            value={params.sort}
            style={{
              padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd",
              background: "#fff", fontSize: 14, cursor: "pointer",
            }}
          >
            <option value="createdAt,desc">Najnowsze</option>
            <option value="createdAt,asc">Najstarsze</option>
            <option value="price,asc">Cena rosnąco</option>
            <option value="price,desc">Cena malejąco</option>
            <option value="area,asc">Powierzchnia rosnąco</option>
            <option value="area,desc">Powierzchnia malejąco</option>
          </select>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* SIATKA */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#888" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🏘️</div>
            <p style={{ fontSize: 18 }}>Brak ogłoszeń spełniających kryteria</p>
            <button
              onClick={() => setParams({ page: 0, size: 12, sort: "createdAt,desc" })}
              style={{ marginTop: 16, padding: "10px 24px", background: "#2d6a9f", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}
            >
              Resetuj filtry
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}

        {/* PAGINACJA */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
            <PageBtn onClick={() => handlePage(0)} disabled={(params.page ?? 0) === 0} label="«" />
            <PageBtn onClick={() => handlePage((params.page ?? 1) - 1)} disabled={(params.page ?? 0) === 0} label="‹" />
            {Array.from({ length: totalPages }, (_, i) => i)
              .filter((i) => Math.abs(i - (params.page ?? 0)) <= 2)
              .map((i) => (
                <PageBtn key={i} onClick={() => handlePage(i)} disabled={false} label={String(i + 1)} active={i === params.page} />
              ))}
            <PageBtn onClick={() => handlePage((params.page ?? 0) + 1)} disabled={(params.page ?? 0) >= totalPages - 1} label="›" />
            <PageBtn onClick={() => handlePage(totalPages - 1)} disabled={(params.page ?? 0) >= totalPages - 1} label="»" />
          </div>
        )}
      </section>
    </main>
  );
}

function PageBtn({ onClick, disabled, label, active }: { onClick: () => void; disabled: boolean; label: string; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "8px 14px", borderRadius: 8,
      border: "1px solid " + (active ? "#2d6a9f" : "#ddd"),
      background: active ? "#2d6a9f" : "#fff",
      color: active ? "#fff" : disabled ? "#bbb" : "#333",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: active ? 700 : 400, fontSize: 14,
    }}>
      {label}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
      <div style={{ height: 180, background: "linear-gradient(90deg, #e8e8e8 25%, #f0f0f0 50%, #e8e8e8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
      <div style={{ padding: 16 }}>
        <div style={{ height: 16, background: "#e8e8e8", borderRadius: 4, marginBottom: 10 }} />
        <div style={{ height: 13, background: "#e8e8e8", borderRadius: 4, width: "55%", marginBottom: 8 }} />
        <div style={{ height: 13, background: "#e8e8e8", borderRadius: 4, width: "40%" }} />
      </div>
    </div>
  );
}
