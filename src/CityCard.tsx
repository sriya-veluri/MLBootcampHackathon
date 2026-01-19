import './CityCard.css'
import { AirQualityData } from './types';

type Props = {
    city: string;
    location: string;
    aqd?: AirQualityData;
    status: string;
    timestamp: string;
};

function CityCard ({city, location, aqd, status, timestamp}: Props) {
    return(
        <div className="city-container">
            <div className="card-header">
                <h2 style={{color:"#333333", fontSize:"36px", paddingLeft:"30px"}}>{city}</h2>
                {status === "Good" && (
                    <div className="status status-good">
                        <p>{status}</p>
                    </div>
                )}
                {status === "Moderate" && (
                    <div className="status status-moderate">
                        <p>{status}</p>
                    </div>
                )}
                {status === "Unhealthy" && (
                    <div className="status status-unhealthy">
                        <p>{status}</p>
                    </div>
                )}
                {status === "Very Unhealthy" && (
                    <div className="status status-very-unhealthy">
                        <p>{status}</p>
                    </div>
                )}
                {status === "No Data" && (
                    <div className="status status-none">
                        <p>{status}</p>
                    </div>
                )}
            </div>

            
            {aqd?.pm25 == null && (
                <div className="value-row">
                    <p className="value">No Data</p>
                </div>
            )}

            {aqd?.pm25 != null && (
                <div className="value-row">
                    <p className="value">{aqd.pm25}</p>
                    <p style={{ fontSize: "30px", color: "#666666" }}>{aqd.unit}</p>
                </div>
            )}

            <span>PM2.5</span>
            <div className="gradient-line"></div>

            <div className="info">
                <p className="label">MONITOR LOCATION</p>
                <p>{location}</p>
                <p className="label">LAST UPDATED</p>
                <p>{timestamp.toLocaleString()}</p>
            </div>

        </div>
    );
}

export default CityCard;