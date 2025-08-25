// api.ts - All API logic for location and gynecologist search

export interface LocationData {
  lat: number;
  lng: number;
  displayName: string;
}

export interface GynecologistData {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  lat: number;
  lng: number;
  opening_hours?: string;
}

// Convert pincode to latitude/longitude using Nominatim API
export const getPincodeCoordinates = async (pincode: string): Promise<LocationData> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'GynecologistFinderApp/1.0'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    
    throw new Error('Pincode not found');
  } catch (error) {
    console.error('Error converting pincode:', error);
    throw error;
  }
};

// Build address from OSM tags
const buildAddress = (tags: any): string => {
  const parts = [];
  if (tags?.['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags?.['addr:street']) parts.push(tags['addr:street']);
  if (tags?.['addr:suburb']) parts.push(tags['addr:suburb']);
  if (tags?.['addr:city']) parts.push(tags['addr:city']);
  if (tags?.['addr:postcode']) parts.push(tags['addr:postcode']);
  
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
};

// Format raw Overpass API response to structured data
const formatGynecologistData = (elements: any[]): GynecologistData[] => {
  return elements
    .filter(element => element.tags && element.tags.name)
    .map(element => ({
      id: element.id.toString(),
      name: element.tags.name || 'Unnamed Healthcare Facility',
      address: buildAddress(element.tags),
      phone: element.tags.phone || element.tags['contact:phone'] || undefined,
      website: element.tags.website || element.tags['contact:website'] || undefined,
      lat: element.lat || element.center?.lat || 0,
      lng: element.lon || element.center?.lon || 0,
      opening_hours: element.tags.opening_hours || undefined
    }))
    .filter(item => item.lat !== 0 && item.lng !== 0);
};
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter'
];

// Retry with exponential backoff
const fetchWithRetry = async (url: string, options: RequestInit, retries: number = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(60000) // 60 second timeout
      });
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 504 && i < retries - 1) {
        // Wait with exponential backoff: 2s, 4s, 8s
        const waitTime = Math.pow(2, i + 1) * 1000;
        console.log(`504 timeout, retrying in ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Wait before retry
      const waitTime = Math.pow(2, i + 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new Error('Max retries exceeded');
};

// Search for gynecologists using Overpass API
export const findGynecologists = async (latitude: number, longitude: number): Promise<GynecologistData[]> => {
  // Reduced radius from 15000 to 10000 meters
  const query = `
    [out:json][timeout:60];
    (
      node["amenity"="hospital"](around:10000,${latitude},${longitude});
      node["amenity"="clinic"](around:10000,${latitude},${longitude});
      way["amenity"="hospital"](around:10000,${latitude},${longitude});
      way["amenity"="clinic"](around:10000,${latitude},${longitude});
      node["name"~"gynaecology|gynaecologist|women|maternity|obstetric",i](around:10000,${latitude},${longitude});
    );
    out center meta;
  `;

  let lastError: Error | null = null;

  // Try multiple endpoints
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      
      const response = await fetchWithRetry(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: query
      });

      const data = await response.json();
      return formatGynecologistData(data.elements || []);
      
    } catch (error) {
      console.error(`Endpoint ${endpoint} failed:`, error);
      lastError = error as Error;
      continue;
    }
  }

  // If all endpoints failed
  throw new Error(`All Overpass endpoints failed. Last error: ${lastError?.message || 'Unknown error'}`);
};
// Combined search function - pincode to gynecologists
export const searchGynecologistsByPincode = async (pincode: string) => {
  try {
    // Step 1: Get coordinates from pincode
    const location = await getPincodeCoordinates(pincode);
    
    // Step 2: Search for gynecologists near those coordinates
    const gynecologists = await findGynecologists(location.lat, location.lng);
    
    return {
      location,
      gynecologists,
      count: gynecologists.length,
      success: true
    };
  } catch (error) {
    return {
      location: null,
      gynecologists: [],
      count: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Search failed'
    };
  }
};
