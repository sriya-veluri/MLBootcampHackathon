import './CityCard.css';
import { AirQualityData } from './types';

type Props = {
  city: string;
  location: string;
  aqd?: AirQualityData;
  status: string;
  timestamp: string;
};

function getAdvice(category: string): string {
  switch (category) {
    case "Good":
      return "Air quality is healthy. Enjoy outdoor activities freely.";
    case "Moderate":
      return "Unusually sensitive individuals should consider limiting prolonged outdoor exertion.";
    case "Unhealthy for Sensitive Groups":
      return "Elderly, children, and people with heart or lung disease should reduce outdoor activity.";
    case "Unhealthy":
      return "Everyone should reduce prolonged outdoor exertion. Sensitive groups should stay indoors.";
    case "Very Unhealthy":
      return "Everyone should avoid outdoor activity. Keep windows closed.";
    case "Hazardous":
      return "Health emergency. Everyone should stay indoors with air purifiers if possible.";
    default:
      return "No health advice available.";
  }
}

function CityCard({ city, location, aqd, status, timestamp }: Props) {
  return (
    <div className="city-container">

      <div className="card-header">
        <h2 style={{ color: "#333333", fontSize: "36px", paddingLeft: "30px" }}>{city}</h2>
        {status === "Good"           && <div className="status status-good"><p>{status}</p></div>}
        {status === "Moderate"       && <div className="status status-moderate"><p>{status}</p></div>}
        {status === "Unhealthy"      && <div className="status status-unhealthy"><p>{status}</p></div>}
        {status === "Very Unhealthy" && <div className="status status-very-unhealthy"><p>{status}</p></div>}
        {status === "No Data"        && <div className="status status-none"><p>{status}</p></div>}
      </div>

      {aqd?.pm25 == null
        ? <div className="value-row"><p className="value">–</p></div>
        : <div className="value-row">
            <p className="value">{aqd.pm25}</p>
            <p style={{ fontSize: "30px", color: "#666666" }}>{aqd.unit}</p>
          </div>
      }
      <span>PM2.5</span>

      <div className="gradient-line" />

      <div className="info">
        <p className="label">MONITOR LOCATION</p>
        <p>{location}</p>
        <p className="label">LAST UPDATED</p>
        <p>{timestamp}</p>
      </div>

      {aqd?.predictedAqi != null && (
        <>
          <div className="gradient-line" />
          <div className="info">
            <p className="label">AQI PREDICTION</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
              <p style={{ fontSize: "28px", fontWeight: 700, margin: 0, color: "#333" }}>
                {aqd.predictedAqi}
              </p>
              {aqd.predictedCategory === "Good" &&
                <div className="status status-good"><p>{aqd.predictedCategory}</p></div>}
              {aqd.predictedCategory === "Moderate" &&
                <div className="status status-moderate"><p>{aqd.predictedCategory}</p></div>}
              {(aqd.predictedCategory === "Unhealthy" ||
                aqd.predictedCategory === "Unhealthy for Sensitive Groups") &&
                <div className="status status-unhealthy"><p>{aqd.predictedCategory}</p></div>}
              {(aqd.predictedCategory === "Very Unhealthy" ||
                aqd.predictedCategory === "Hazardous") &&
                <div className="status status-very-unhealthy"><p>{aqd.predictedCategory}</p></div>}
            </div>
            <p className="label" style={{ marginTop: "6px" }}>BASED ON CO, OZONE, NO₂, PM2.5</p>
            <p>{getAdvice(aqd.predictedCategory ?? "")}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default CityCard;