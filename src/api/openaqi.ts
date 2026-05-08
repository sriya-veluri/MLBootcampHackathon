// This file is deprecated - using dataset API instead
// Kept for backward compatibility only

import { AirQualityData } from "../types";

// Re-export for backward compatibility
export const fetchAirQuality = async (): Promise<AirQualityData> => {
  throw new Error("fetchAirQuality is deprecated. Use fetchAQIComparison from dataset.ts instead.");
};

export const fetchAirQualityByCoordinates = fetchAirQuality;