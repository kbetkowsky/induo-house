"use client";

import { useRouter } from "next/navigation";
import { PropertyListResponse } from "@/types/property";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Mieszkanie", HOUSE: "Dom", LAND: "Działka", COMMERCIAL: "Lokal",
};

export default function PropertyCard({ property }: { property: PropertyListResponse }) {
  const router = useRouter();

  const imageUrl = property.thumbnailUrl
    ? property.thumbnailUrl.startsWith("http")
      ? property.thumbnailUrl
      : `${API_BASE}${property.thumbnailUrl}`
    : null;

  const formattedPrice = new Intl.NumberFormat("pl-PL", {
    style: "currency", currency: "PLN", maximumFractionDigits: 0,
  }).format(property.price);

  const pricePerM2 = property.area
    ? Math.round(property.price / property.area).toLocaleString("pl-PL")
    : null;

  return (
    <div
      onClick={() => router.push(`/properties/${property.id}`)}
      style={{
        background: "#fff", borderRadius: 12, overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)", cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.13)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
      }}
    >
      {/* ZDJĘCIE */}
      <div style={{ position: "relative", height: 192, overflow: "hidden", background: "#f0f0f0", flexShrink: 0 }}>
        {imageUrl ? (
          <img src={imageUrl} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "#ccc" }}>🏠</div>
        )}

        {/* Badges */}
        <span style={{
          position: "absolute", top: 10, left: 10,
          background: property.transactionType === "RENT" ? "#f59e0b" : "#16a34a",
          color: "#fff", padding: "3px 10px", borderRadius: 20,
          fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        }}>
          {property.transactionType === "RENT" ? "Wynajem" : "Sprzedaż"}
        </span>
        <span style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 11,
        }}>
          {TYPE_LABELS[property.propertyType] || property.propertyType}
        </span>
      </div>

      {/* TREŚĆ */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <h3 style={{
          margin: 0, fontSize: 15, fontWeight: 700, color: "#111", lineHeight: 1.35,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {property.title}
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
          📍 {property.city}
        </p>
        <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#4b5563", marginTop: 2 }}>
          <span title="Powierzchnia">📐 {property.area} m²</span>
          {property.numberOfRooms != null && property.numberOfRooms > 0 && (
            <span title="Liczba pokoi">🛏 {property.numberOfRooms} pok.</span>
          )}
        </div>

        {/* Kontakt do właściciela */}
        {property.ownerFirstName && (
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#9ca3af", borderTop: "1px solid #f3f4f6", paddingTop: 8 }}>
            👤 {property.ownerFirstName} {property.ownerLastName}
            {property.ownerPhoneNumber && ` · 📞 ${property.ownerPhoneNumber}`}
          </p>
        )}
      </div>

      {/* CENA */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid #f3f4f6",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: "#2d6a9f" }}>
          {formattedPrice}
        </span>
        {pricePerM2 && (
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            {pricePerM2} PLN/m²
          </span>
        )}
      </div>
    </div>
  );
}
