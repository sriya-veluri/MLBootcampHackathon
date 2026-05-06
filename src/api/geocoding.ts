import { GeocodingResult } from "../types";

const PHOTON_BASE_URL = "/geocode";

export const searchCities = async (query: string): Promise<GeocodingResult[]> => {
  if (!query || query.length < 2) return [];

  try {
    const url = `${PHOTON_BASE_URL}/api?q=${encodeURIComponent(query)}&limit=10`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Geocoding Error: ${response.status}`);

    const data = await response.json();
    const results: GeocodingResult[] = data.features
      .filter((item: any) =>
        item.properties.type === 'city' ||
        item.properties.type === 'town' ||
        item.properties.osm_value === 'city' ||
        item.properties.osm_value === 'town'
      )
      .map((item: any) => ({
        name: item.properties.name,
        displayName:
          item.properties.name +
          (item.properties.state   ? `, ${item.properties.state}`   : '') +
          (item.properties.country ? `, ${item.properties.country}` : ''),
        lat: item.geometry.coordinates[1],
        lng: item.geometry.coordinates[0],
        country: item.properties.country,
      }));

    return results;
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
};