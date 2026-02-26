'use client';

import { useEffect, useState } from 'react';

interface Props {
  city: string;
  street?: string;
  postalCode?: string;
}

export default function PropertyMap({ city, street, postalCode }: Props) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });

    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup }) => {
      const Component = ({ coords }: { coords: [number, number] }) => (
        <MapContainer
          center={coords}
          zoom={15}
          style={{ height: '100%', width: '100%', borderRadius: 14 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          <Marker position={coords}>
            <Popup>{[street, city, postalCode].filter(Boolean).join(', ')}</Popup>
          </Marker>
        </MapContainer>
      );
      setMapComponent(() => Component);
    });
  }, []);

  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const address = [street, city, postalCode].filter(Boolean).join(', ');
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    fetch(url, { headers: { 'Accept-Language': 'pl', 'User-Agent': 'induo-house/1.0' } })
      .then(r => r.json())
      .then(data => {
        if (data[0]) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
          return fetch(fallbackUrl, { headers: { 'Accept-Language': 'pl', 'User-Agent': 'induo-house/1.0' } })
            .then(r => r.json())
            .then(d => {
              if (d[0]) setCoords([parseFloat(d[0].lat), parseFloat(d[0].lon)]);
              else setError(true);
            });
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [city, street, postalCode]);

  if (loading) return (
    <div style={{ height: 300, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 14 }}>
      Ładowanie mapy…
    </div>
  );

  if (error || !coords || !MapComponent) return (
    <div style={{ height: 300, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 14 }}>
      Nie udało się załadować mapy
    </div>
  );

  return (
    <div style={{ height: 300, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <MapComponent coords={coords} />
    </div>
  );
}