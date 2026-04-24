'use client';

import { useEffect, useState, type ComponentType, type CSSProperties, type ReactNode } from 'react';

interface Props {
  city: string;
  street?: string;
  postalCode?: string;
}

type Coordinates = [number, number];

type MapViewProps = {
  coords: Coordinates;
};

type LeafletModule = {
  Icon: {
    Default: {
      prototype: { _getIconUrl?: string };
      mergeOptions: (options: {
        iconRetinaUrl: string;
        iconUrl: string;
        shadowUrl: string;
      }) => void;
    };
  };
};

type ReactLeafletModule = {
  MapContainer: ComponentType<{
    center: Coordinates;
    zoom: number;
    style: CSSProperties;
    scrollWheelZoom: boolean;
    children: ReactNode;
  }>;
  TileLayer: ComponentType<{
    url: string;
    attribution: string;
  }>;
  Marker: ComponentType<{
    position: Coordinates;
    children: ReactNode;
  }>;
  Popup: ComponentType<{
    children: ReactNode;
  }>;
};

type NominatimResponse = Array<{
  lat: string;
  lon: string;
}>;

async function geocodeAddress(address: string): Promise<Coordinates | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
    { headers: { 'Accept-Language': 'pl', 'User-Agent': 'induo-house/1.0' } }
  );
  const data = (await response.json()) as NominatimResponse;

  if (!data[0]) {
    return null;
  }

  return [Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)];
}

export default function PropertyMap({ city, street, postalCode }: Props) {
  const [MapComponent, setMapComponent] = useState<ComponentType<MapViewProps> | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      const leafletModule = (await import('leaflet')) as unknown as LeafletModule;
      delete leafletModule.Icon.Default.prototype._getIconUrl;
      leafletModule.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const reactLeafletModule = (await import('react-leaflet')) as unknown as ReactLeafletModule;
      const { MapContainer, TileLayer, Marker, Popup } = reactLeafletModule;

      const Component = ({ coords: nextCoords }: MapViewProps) => (
        <MapContainer
          center={nextCoords}
          zoom={15}
          style={{ height: '100%', width: '100%', borderRadius: 14 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          <Marker position={nextCoords}>
            <Popup>{[street, city, postalCode].filter(Boolean).join(', ')}</Popup>
          </Marker>
        </MapContainer>
      );

      if (!cancelled) {
        setMapComponent(() => Component);
      }
    };

    void loadMap();

    return () => {
      cancelled = true;
    };
  }, [city, postalCode, street]);

  useEffect(() => {
    let cancelled = false;

    const loadCoordinates = async () => {
      setLoading(true);
      setError(false);

      try {
        const fullAddress = [street, city, postalCode].filter(Boolean).join(', ');
        const exactMatch = await geocodeAddress(fullAddress);
        const fallbackMatch = exactMatch ?? (await geocodeAddress(city));

        if (!cancelled) {
          if (fallbackMatch) {
            setCoords(fallbackMatch);
          } else {
            setError(true);
          }
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadCoordinates();

    return () => {
      cancelled = true;
    };
  }, [city, postalCode, street]);

  if (loading) {
    return (
      <div style={{ height: 300, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 14 }}>
        Ładowanie mapy...
      </div>
    );
  }

  if (error || !coords || !MapComponent) {
    return (
      <div style={{ height: 300, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 14 }}>
        Nie udało się załadować mapy
      </div>
    );
  }

  return (
    <div style={{ height: 300, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <MapComponent coords={coords} />
    </div>
  );
}
