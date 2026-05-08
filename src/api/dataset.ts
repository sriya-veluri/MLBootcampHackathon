import { AirQualityData } from "../types";

const BACKEND_URL = "http://localhost:8000";

export const fetchAQIComparison = async (
  cityName: string,
  country?: string
): Promise<AirQualityData> => {
  try {
    const params = new URLSearchParams();
    if (country) {
      params.append("country", country);
    }

    const res = await fetch(
      `${BACKEND_URL}/city/${encodeURIComponent(cityName)}?${params.toString()}`
    );

    if (!res.ok) {
      throw new Error(`City not found: ${cityName}`);
    }

    const data = await res.json();
    
    // Add additional fields for compatibility
    return {
      ...data,
      locationName: `${data.city}, ${data.country}`,
      unit: "AQI",
      lastUpdated: new Date().toLocaleString("en-US"),
    };
  } catch (error) {
    console.error("Dataset API error:", error);
    throw error;
  }
};
