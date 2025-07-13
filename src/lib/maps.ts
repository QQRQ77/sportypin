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
function formatAddressForGeocoding(street: string, city: string, postalCode: string, country = 'Polska') {
  const parts = [street, city, postalCode, country].filter(part => part && part.trim());
  return parts.join(', ');
}