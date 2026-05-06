import { AirQualityData } from "../types";

const API_KEY = "9921b318c8bd88c80fc00f8a9139a53d852fe077ef50e42a3ca95d7f34986fef";
const BASE_URL = "/api";

const PARAM = { pm25: 2, co: 4, ozone: 3, no2: 7 };

function pm25ToAqi(pm: number): number {
  if (pm <= 12.0)  return Math.round((50 / 12.0) * pm);
  if (pm <= 35.4)  return Math.round(50  + ((100 - 50)  / (35.4  - 12.1)) * (pm - 12.1));
  if (pm <= 55.4)  return Math.round(100 + ((150 - 100) / (55.4  - 35.5)) * (pm - 35.5));
  if (pm <= 150.4) return Math.round(150 + ((200 - 150) / (150.4 - 55.5)) * (pm - 55.5));
  return Math.min(Math.round(200 + ((300 - 200) / (250.4 - 150.5)) * (pm - 150.5)), 500);
}

function coToAqi(co: number): number {
  if (co <= 4.4)  return Math.round((50 / 4.4) * co);
  if (co <= 9.4)  return Math.round(50  + ((100 - 50)  / (9.4  - 4.5)) * (co - 4.5));
  if (co <= 12.4) return Math.round(100 + ((150 - 100) / (12.4 - 9.5)) * (co - 9.5));
  return Math.min(Math.round(150 + ((200 - 150) / (15.4 - 12.5)) * (co - 12.5)), 500);
}

function no2ToAqi(no2: number): number {
  if (no2 <= 53)  return Math.round((50 / 53) * no2);
  if (no2 <= 100) return Math.round(50  + ((100 - 50)  / (100 - 54))  * (no2 - 54));
  if (no2 <= 360) return Math.round(100 + ((150 - 100) / (360 - 101)) * (no2 - 101));
  return Math.min(Math.round(150 + ((200 - 150) / (649 - 361)) * (no2 - 361)), 500);
}

function ozoneToAqi(o3: number): number {
  if (o3 <= 54)  return Math.round((50 / 54) * o3);
  if (o3 <= 70)  return Math.round(50  + ((100 - 50)  / (70  - 55)) * (o3 - 55));
  if (o3 <= 85)  return Math.round(100 + ((150 - 100) / (85  - 71)) * (o3 - 71));
  if (o3 <= 105) return Math.round(150 + ((200 - 150) / (105 - 86)) * (o3 - 86));
  return Math.min(Math.round(200 + ((300 - 200) / (200 - 106)) * (o3 - 106)), 500);
}

async function fetchSensorValue(
  lat: number,
  lng: number,
  paramId: number
): Promise<number | null> {
  try {
    const minLat = lat - 0.2, maxLat = lat + 0.2;
    const minLng = lng - 0.2, maxLng = lng + 0.2;

    const res = await fetch(
      `${BASE_URL}/locations?bbox=${minLng},${minLat},${maxLng},${maxLat}&parameter=${paramId}&limit=10`,
      { headers: { "X-API-Key": API_KEY } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const week = 7 * 24 * 60 * 60 * 1000;

    const locations = (data.results ?? [])
      .filter((item: any) =>
        item.datetimeLast?.utc &&
        Date.now() - new Date(item.datetimeLast.utc).getTime() <= week &&
        item.sensors?.some((s: any) => s.parameter.id === paramId)
      )
      .sort((a: any, b: any) =>
        new Date(b.datetimeLast.utc).getTime() - new Date(a.datetimeLast.utc).getTime()
      );

    if (!locations.length) return null;

    const sensor = locations[0].sensors.find((s: any) => s.parameter.id === paramId);
    if (!sensor) return null;

    const sensorRes = await fetch(`${BASE_URL}/sensors/${sensor.id}`, {
      headers: { "X-API-Key": API_KEY },
    });
    if (!sensorRes.ok) return null;

    const sensorData = await sensorRes.json();
    return sensorData.results?.[0]?.latest?.value ?? null;
  } catch {
    return null;
  }
}

export const fetchAirQualityByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<AirQualityData> => {
  try {
    const [pm25Raw, coRaw, ozoneRaw, no2Raw] = await Promise.all([
      fetchSensorValue(latitude, longitude, PARAM.pm25),
      fetchSensorValue(latitude, longitude, PARAM.co),
      fetchSensorValue(latitude, longitude, PARAM.ozone),
      fetchSensorValue(latitude, longitude, PARAM.no2),
    ]);

    console.log("Raw sensor values:", { pm25Raw, coRaw, ozoneRaw, no2Raw });

    const pm25_aqi  = pm25Raw  != null ? pm25ToAqi(pm25Raw)   : null;
    const co_aqi    = coRaw    != null ? coToAqi(coRaw)       : null;
    const ozone_aqi = ozoneRaw != null ? ozoneToAqi(ozoneRaw) : null;
    const no2_aqi   = no2Raw   != null ? no2ToAqi(no2Raw)     : null;

    console.log("AQI sub-indices:", { pm25_aqi, co_aqi, ozone_aqi, no2_aqi });

    // Fallback defaults so ML always runs even if some sensors are missing
    const safe_co    = co_aqi    ?? 1;
    const safe_ozone = ozone_aqi ?? 30;
    const safe_no2   = no2_aqi   ?? 2;
    const safe_pm25  = pm25_aqi  ?? 50;

    let predictedAqi: number | undefined;
    let predictedCategory: string | undefined;

    try {
      const mlRes = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          co_aqi:    safe_co,
          ozone_aqi: safe_ozone,
          no2_aqi:   safe_no2,
          pm25_aqi:  safe_pm25,
        }),
      });
      if (mlRes.ok) {
        const mlData = await mlRes.json();
        predictedAqi = mlData.predicted_aqi;
        predictedCategory = mlData.aqi_category;
        console.log("ML prediction:", { predictedAqi, predictedCategory });
      }
    } catch {
      console.warn("ML backend unavailable, skipping prediction");
    }

    return {
      locationName: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
      pm25: pm25Raw != null ? Math.round(pm25Raw) : null,
      co_aqi,
      ozone_aqi,
      no2_aqi,
      unit: "µg/m³",
      lastUpdated: new Date().toLocaleString("en-US"),
      predictedAqi,
      predictedCategory,
    };
  } catch (error) {
    console.error("OpenAQ error:", error);
    return {
      locationName: "Unknown",
      pm25: null,
      co_aqi: null,
      ozone_aqi: null,
      no2_aqi: null,
      unit: "µg/m³",
      lastUpdated: "Unknown",
    };
  }
};

export const fetchAirQuality = fetchAirQualityByCoordinates;