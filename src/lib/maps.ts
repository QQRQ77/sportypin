'use server'

interface NominatimResponseItem {
  lat: string;
  lon: string;
  display_name: string;
  [key: string]: unknown;
}


export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function nominatimGeocode(address: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'sportpin.net/1.0 (tomaszkokot@o2.pl)' }, // wymagane
  });
  const data = await res.json();
  console.log('Nominatim response data:', data);
  if (!data.length) throw new Error('Not found');
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

export async function geocodeWithNominatim(address: string): Promise<GeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'sportpin.net/1.0 (tomaszkokot@o2.pl)', // wymagane
      },
    });

    if (!res.ok) {
      console.error('Nominatim HTTP error:', res.status, res.statusText);
      return null;
    }

    const data: NominatimResponseItem[] = await res.json();

    if (data?.length) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    return null;
  } catch (err) {
    console.error('Błąd geocoding Nominatim:', err);
    return null;
  }
}

// Funkcja pobierająca geocode używając Nominatim (OpenStreetMap)
export async function getGeocodeFromAddress(
  address: string,
): Promise<GeocodeResult | null> {
  try {
    // Formatuj adres
    const encodedAddress = encodeURIComponent(address);
    
    // Wywołaj API Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'Sportpin/1.0' // Nominatim wymaga User-Agent
        }
      }
    );
    
    if (!response.ok) {
      console.error('Błąd HTTP:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    
    console.warn('Nie znaleziono współrzędnych dla adresu:', address);
    return null;
  } catch (error) {
    console.error('Błąd podczas geocodingu:', error);
    return null;
  }
}


// 7. FUNKCJA POMOCNICZA DO FORMATOWANIA ADRESU
export async function formatAddressForGeocoding(address: string, city: string, zip_code: string, country = 'Polska') {
  const parts = [address, city, zip_code, country].filter(part => part && part.trim());
  return parts.join(', ');
}

export async function googleGeocodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key is not set');
  }
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  );

  const data = await response.json();

  console.log("ApiKey: ", apiKey)

  console.log('Google Geocode response status:', data);

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

export async function getGeocodeFromAddressGoogle(
  address: string,
) {
  try {

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Formatuj adres
    const encodedAddress = encodeURIComponent(address);
    
    // Wywołaj Google Maps Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&language=pl&region=pl`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Błąd HTTP:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    // Sprawdź status odpowiedzi
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      console.log(`✓ Google Maps znalazł: ${result.formatted_address}`);
      
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id
      };
    }
    
    // Obsługa różnych statusów błędów
    switch (data.status) {
      case 'ZERO_RESULTS':
        console.warn('Google Maps: Nie znaleziono wyników dla:', address);
        break;
      case 'OVER_QUERY_LIMIT':
        console.error('Google Maps: Przekroczono limit zapytań');
        break;
      case 'REQUEST_DENIED':
        console.error('Google Maps: Żądanie odrzucone. Sprawdź klucz API');
        break;
      case 'INVALID_REQUEST':
        console.error('Google Maps: Nieprawidłowe żądanie');
        break;
      default:
        console.error('Google Maps: Nieznany błąd:', data.status);
    }
    
    if (data.error_message) {
      console.error('Google Maps błąd:', data.error_message);
    }
    
    return null;
  } catch (error) {
    console.error('Błąd podczas geocodingu Google Maps:', error);
    return null;
  }
}