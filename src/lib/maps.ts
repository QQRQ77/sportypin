'use server'

interface NominatimResponseItem {
  lat: string;
  lon: string;
  display_name: string;
  [key: string]: any;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeWithNominatim(address: string): Promise<GeocodeResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
    );
    const data: NominatimResponseItem[] = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Błąd geocoding Nominatim:', error);
    return null;
  }
}

function validatePolishAddress(address: string): { isValid: boolean; hasPostalCode: boolean; suggestion: string } {
  // Podstawowa walidacja polskiego adresu
  const postalCodeRegex = /\d{2}-\d{3}/;
  const hasPostalCode = postalCodeRegex.test(address);
  
  return {
    isValid: hasPostalCode,
    hasPostalCode: hasPostalCode,
    suggestion: hasPostalCode ? address : `${address}, Polska`
  };
}

// 7. FUNKCJA POMOCNICZA DO FORMATOWANIA ADRESU
export async function formatAddressForGeocoding(address: string, city: string, zip_code: string, country = 'Polska') {
  const parts = [address, city, zip_code, country].filter(part => part && part.trim());
  return parts.join(', ');
}

export async function googleGeocodeAddress(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key is not set');
  }
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  );

  const data = await response.json();
  if (data.status === 'OK' && data.results.length > 0) {
    const result = data.results[0].geometry.location;
    return {
      lat: result.lat || 0,
      lng: result.lng || 0,
    };
  } else {
    throw new Error('Geocoding failed: ' + data.status);
  }
}