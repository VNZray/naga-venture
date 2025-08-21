import React, { useEffect, useRef } from 'react';

type LeafletMapPickerProps = {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
  height?: number;
};

const DEFAULT_CENTER = { lat: 13.6257, lng: 123.1853 }; // Naga City vicinity

const ensureLeafletCss = () => {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('leaflet-css');
  if (existing) return;
  const link = document.createElement('link');
  link.id = 'leaflet-css';
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.crossOrigin = '';
  document.head.appendChild(link);
};

const LeafletMapPicker: React.FC<LeafletMapPickerProps> = ({
  latitude,
  longitude,
  onChange,
  height = 350,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    ensureLeafletCss();
    let L: any;
    let map: any;
    let marker: any;
    const setup = async () => {
      const leaflet = await import('leaflet');
      L = leaflet.default || leaflet;

      // Prepare a robust custom marker icon (works even if image assets fail)
      const customIcon = L.divIcon({
        className: '',
        html:
          '<div style="width:22px;height:22px;background:#0A1B47;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      if (!mapRef.current) return;
      const center =
        typeof latitude === 'number' && typeof longitude === 'number'
          ? { lat: latitude, lng: longitude }
          : DEFAULT_CENTER;

      map = L.map(mapRef.current).setView([center.lat, center.lng], 15);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      marker = L.marker([center.lat, center.lng], { draggable: true, icon: customIcon }).addTo(map);
      markerRef.current = marker;

      const update = (lat: number, lng: number) => {
        if (marker) marker.setLatLng([lat, lng]);
        onChange(lat, lng);
      };

      map.on('click', (e: any) => {
        update(e.latlng.lat, e.latlng.lng);
      });

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        update(pos.lat, pos.lng);
      });
    };

    setup();

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (_) {
        // no-op
      }
    };
  }, []);

  useEffect(() => {
    // Keep marker in sync if props change externally
    if (!markerRef.current || !mapInstanceRef.current) return;
    if (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      !Number.isNaN(latitude) &&
      !Number.isNaN(longitude)
    ) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.setView([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div
      style={{ width: '100%', height, borderRadius: 8, overflow: 'hidden', border: '1px solid #ccc' }}
      ref={mapRef}
    />
  );
};

export default LeafletMapPicker;


