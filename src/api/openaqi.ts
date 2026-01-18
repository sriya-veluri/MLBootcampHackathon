import { AirQualityData, LatestMeasurementResponse, LocationSearchResponse } from "../types";
import { searchCities } from '../api/geocoding'; 

const API_KEY = "9921b318c8bd88c80fc00f8a9139a53d852fe077ef50e42a3ca95d7f34986fef";
const BASE_URL = "/api";

// Main function that searches by coordinates
export const fetchAirQualityByCoordinates = async (latitude: number, longitude: number): Promise<AirQualityData[]> => {
    try { 
        // Step 1: Search for nearby PM2.5 monitors using bounding box
        

        // Step 2: Find the most recently active location
        

        // Find PM2.5 sensor
        

        // Step 3: Get latest measurements
        

        // Match measurement to PM2.5 sensor by sensorsId

        return results;
    }
    catch (error) {
        console.error("OpenAqi error:", error);
        return [];
    }
};

export const fetchAirQuality = fetchAirQualityByCoordinates;