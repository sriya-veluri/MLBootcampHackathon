export interface City {
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

export interface AQIComparison {
  city: string;
  country: string;
  dataset_aqi: number;
  dataset_aqi_category: string;
  predicted_aqi: number;
  predicted_aqi_category: string;
  difference: number;
  co_aqi: number;
  ozone_aqi: number;
  no2_aqi: number;
  pm25_aqi: number;
}

export interface AirQualityData extends AQIComparison {
  locationName?: string;
  unit?: string;
  lastUpdated?: string;
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