'use client';

import React, { useEffect, useRef } from 'react';

// Declare Leaflet on the window object for TypeScript
declare global {
  interface Window {
    L: any;
  }
}

type Address = {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  address?: string;
  icon?: string;
};

interface MapComponentProps {
  addresses?: Address[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  addresses = [], 
  center = [52.237049, 21.017532], // Warszawa jako domyślny środek
  zoom = 10,
  height = '400px',
  width = '100%'
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null); // Use 'any' or a more specific Leaflet map type if available

  useEffect(() => {
    // Sprawdź czy Leaflet jest dostępny
    if (typeof window !== 'undefined' && window.L && mapRef.current) {
      // Usuń poprzednią instancję mapy jeśli istnieje
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Stwórz nową mapę
      const map = window.L.map(mapRef.current).setView(center, zoom);

      // Dodaj warstwę mapy
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Dodaj pinezki dla każdego adresu
      addresses.forEach((address, index) => {
        if (address.lat && address.lng) {
          const marker = window.L.marker([address.lat, address.lng]).addTo(map);
          
          // Dodaj popup z informacjami
          if (address.title || address.description) {
            const popupContent = `
              ${address.title ? `<h3 style="margin: 0 0 8px 0; font-weight: bold;">${address.title}</h3>` : ''}
              ${address.description ? `<p style="margin: 0;">${address.description}</p>` : ''}
              ${address.address ? `<p style="margin: 4px 0 0 0; font-size: 0.9em; color: #666;">${address.address}</p>` : ''}
            `;
            marker.bindPopup(popupContent);
          }

          // Możliwość dodania custom ikony
          if (address.icon) {
            const customIcon = window.L.icon({
              iconUrl: address.icon,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            });
            marker.setIcon(customIcon);
          }
        }
      });

      // Jeśli mamy więcej niż jeden adres, dostosuj widok do wszystkich pinezek
      if (addresses.length > 1) {
        const validAddresses = addresses.filter(addr => addr.lat && addr.lng);
        if (validAddresses.length > 0) {
          const group = new window.L.featureGroup(
            validAddresses.map(addr => window.L.marker([addr.lat, addr.lng]))
          );
          map.fitBounds(group.getBounds().pad(0.1));
        }
      }

      mapInstanceRef.current = map;
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [addresses, center, zoom]);

  // Załaduj Leaflet CSS i JS jeśli nie są dostępne
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.L) {
      // Dodaj CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Dodaj JavaScript
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        // Wymuś re-render po załadowaniu Leaflet
        if (mapRef.current) {
          mapRef.current.style.display = 'none';
          mapRef.current.offsetHeight; // Trigger reflow
          mapRef.current.style.display = 'block';
        }
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(link);
        document.head.removeChild(script);
      };
    }
  }, []);

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        style={{ 
          height: height, 
          width: width,
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}
        className="shadow-md"
      />
    </div>
  );
};

// Przykład użycia
const MapExample = () => {
  const sampleAddresses = [
    {
      lat: 52.237049,
      lng: 21.017532,
      title: "Warszawa - Centrum",
      description: "Stolica Polski",
      address: "ul. Przykładowa 1, 00-001 Warszawa"
    },
    {
      lat: 52.229676,
      lng: 21.012229,
      title: "Warszawa - Stare Miasto",
      description: "Historyczne centrum",
      address: "Rynek Starego Miasta, Warszawa"
    },
    {
      lat: 52.247573,
      lng: 21.013463,
      title: "Warszawa - Żoliborz",
      description: "Dzielnica mieszkaniowa",
      address: "ul. Krasińskiego, Warszawa"
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Mapa z Pinezkami</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Lokalizacje:</h2>
        <ul className="space-y-2">
          {sampleAddresses.map((addr, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-lg">
              <strong>{addr.title}</strong> - {addr.description}
              <br />
              <span className="text-sm text-gray-600">{addr.address}</span>
            </li>
          ))}
        </ul>
      </div>

      <MapComponent 
        addresses={sampleAddresses}
        center={[52.237049, 21.017532]}
        zoom={12}
        height="500px"
      />
    </div>
  );
};

export default MapExample;