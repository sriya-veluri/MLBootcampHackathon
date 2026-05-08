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

function getDifferenceColor(difference: number): string {
  if (difference < -10) return "#4CAF50"; // Green: model predicts lower (better)
  if (difference > 10) return "#f44336"; // Red: model predicts higher (worse)
  return "#FF9800"; // Orange: close to dataset
}

function CityCard({ city, location, aqd, status, timestamp }: Props) {
  return (
    <div className="city-container">

      <div className="card-header">
        <h2 style={{ color: "#333333", fontSize: "36px", paddingLeft: "30px" }}>{city}</h2>
      </div>

      {aqd ? (
        <>
          {/* Dataset AQI Section */}
          <div className="aqi-section">
            <p className="label" style={{ marginTop: "0" }}>DATASET AQI</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
              <p style={{ fontSize: "40px", fontWeight: 700, margin: 0, color: "#333" }}>
                {aqd.dataset_aqi}
              </p>
              {aqd.dataset_aqi_category === "Good" &&
                <div className="status status-good"><p>{aqd.dataset_aqi_category}</p></div>}
              {aqd.dataset_aqi_category === "Moderate" &&
                <div className="status status-moderate"><p>{aqd.dataset_aqi_category}</p></div>}
              {(aqd.dataset_aqi_category === "Unhealthy" ||
                aqd.dataset_aqi_category === "Unhealthy for Sensitive Groups") &&
                <div className="status status-unhealthy"><p>{aqd.dataset_aqi_category}</p></div>}
              {(aqd.dataset_aqi_category === "Very Unhealthy" ||
                aqd.dataset_aqi_category === "Hazardous") &&
                <div className="status status-very-unhealthy"><p>{aqd.dataset_aqi_category}</p></div>}
            </div>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
              Based on pollutant data: CO ({aqd.co_aqi}), Ozone ({aqd.ozone_aqi}), NO₂ ({aqd.no2_aqi}), PM2.5 ({aqd.pm25_aqi})
            </p>
          </div>

          <div className="gradient-line" />

          {/* Model Prediction Section */}
          <div className="aqi-section">
            <p className="label">MODEL-PREDICTED AQI</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
              <p style={{ fontSize: "40px", fontWeight: 700, margin: 0, color: "#333" }}>
                {aqd.predicted_aqi}
              </p>
              {aqd.predicted_aqi_category === "Good" &&
                <div className="status status-good"><p>{aqd.predicted_aqi_category}</p></div>}
              {aqd.predicted_aqi_category === "Moderate" &&
                <div className="status status-moderate"><p>{aqd.predicted_aqi_category}</p></div>}
              {(aqd.predicted_aqi_category === "Unhealthy" ||
                aqd.predicted_aqi_category === "Unhealthy for Sensitive Groups") &&
                <div className="status status-unhealthy"><p>{aqd.predicted_aqi_category}</p></div>}
              {(aqd.predicted_aqi_category === "Very Unhealthy" ||
                aqd.predicted_aqi_category === "Hazardous") &&
                <div className="status status-very-unhealthy"><p>{aqd.predicted_aqi_category}</p></div>}
            </div>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
              Predicted using linear regression on pollutant sub-indices
            </p>
          </div>

          <div className="gradient-line" />

          {/* Comparison Section */}
          <div className="aqi-section">
            <p className="label">DIFFERENCE (Model - Dataset)</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
              <p style={{ 
                fontSize: "32px", 
                fontWeight: 700, 
                margin: 0, 
                color: getDifferenceColor(aqd.difference) 
              }}>
                {aqd.difference > 0 ? '+' : ''}{aqd.difference}
              </p>
            </div>
            <p style={{ fontSize: "13px", color: "#666", marginTop: "8px" }}>
              {aqd.difference < -10 && "Model predicts better air quality than dataset"}
              {aqd.difference > 10 && "Model predicts worse air quality than dataset"}
              {aqd.difference >= -10 && aqd.difference <= 10 && "Model and dataset predictions are close"}
            </p>
          </div>

          <div className="gradient-line" />

          <div className="info">
            <p className="label">LOCATION</p>
            <p>{location}</p>
            <p className="label">LAST UPDATED</p>
            <p>{timestamp}</p>
          </div>
        </>
      ) : (
        <div className="value-row">
          <p style={{ color: "#999" }}>Loading data...</p>
        </div>
      )}
    </div>
  );
}

export default CityCard;