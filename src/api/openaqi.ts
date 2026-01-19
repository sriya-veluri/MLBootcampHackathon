import { AirQualityData, LatestMeasurementResponse, LocationSearchResponse } from "../types";

const API_KEY = "9921b318c8bd88c80fc00f8a9139a53d852fe077ef50e42a3ca95d7f34986fef";
const BASE_URL = "/api";

// Main function that searches by coordinates
export const fetchAirQualityByCoordinates = async (latitude: number, longitude: number): Promise<AirQualityData> => {
    try { 
        // Step 1: Search for nearby PM2.5 monitors using bounding box
        // bounding box (25km)
        const minLat = latitude - 0.2;
        const maxLat = latitude + 0.2;
        const minLong = longitude - 0.2;
        const maxLong = longitude + 0.2;

        const url = `${BASE_URL}/locations?bbox=${minLong},${minLat},${maxLong},${maxLat}&parameter=pm25&limit=10`;
        const response = await fetch(url, {
            headers: {
                "X-API-Key": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`OpenAqi Error: ${response.status}`);
        }

        const data: LocationSearchResponse = await response.json();

        // Step 2: Find the most recently active location
        const results = data.results
        // Find PM2.5 sensor
        .filter((item: any) => 
            Date.now() - new Date(item.datetimeLast.utc).getTime() <= 7*24*60*60*1000 &&
            item.sensors.some((s: any) => s.parameter.id === 2)
        )
        .map((item: any) => ({
            id: item.id,
            name: item.name,
            lat: item.coordinates.latitude,
            lng: item.coordinates.longitude,
            country: item.country,
            lastUpdated: item.datetimeLast.utc,
            sensorId: item.sensors.find((s: any) => s.parameter.id === 2),
        }))
        .sort((a, b) => 
            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );

        // most active location
        const location = results[0];
        console.log("Most recent active location:"+ JSON.stringify(location));
        
        // Step 3: Get latest measurements
        const latesturl = `${BASE_URL}/sensors/${location.sensorId.id}`;

        const latestresponse = await fetch(latesturl, {
            headers: { "X-API-Key": API_KEY },
        });

        if (!latestresponse.ok) {
            throw new Error(`OpenAqi Latest Measurement Error: ${latestresponse.status}`);
        }

        const latestdata = await latestresponse.json();

        // Match measurement to PM2.5 sensor by sensorsId
        const measurement = latestdata.results[0].latest;

        return {
            locationName: location.name,
            pm25: Math.round(measurement.value),
            unit: "µg/m³",
            lastUpdated: new Date(measurement.datetime.utc).toLocaleString("en-US")
        };
    }
    catch (error) {
        console.error("OpenAqi error:", error);
        return {
            locationName: "Unknown",
            pm25: null,
            unit: "µg/m³",
            lastUpdated: "Unknown"
        };
    }
};

export const fetchAirQuality = fetchAirQualityByCoordinates;