export interface City {
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

export interface AirQualityData {
  locationName: string;
  pm25: number | null;
  co_aqi: number | null;
  ozone_aqi: number | null;
  no2_aqi: number | null;
  unit: string;
  lastUpdated: string;
  predictedAqi?: number;
  predictedCategory?: string;
}

export interface LocationSearchResponse {
  results: Array<{
    id: number;
    name: string;
    sensors: Array<{
      id: number;
      name: string;
      parameter: {
        id: number;
        name: string;
        units: string;
        displayName: string;
      };
    }>;
    datetimeLast: {
      utc: string;
      local: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }>;
}

export interface LatestMeasurementResponse {
  results: Array<{
    value: number;
    sensorsId: number;
    locationsId: number;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    datetime: {
      utc: string;
      local: string;
    };
  }>;
}

export interface GeocodingResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  country?: string;
}