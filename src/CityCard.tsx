import './CityCard.css'

type Props={
    city: string;
    location: string;
    value: number;
    status: string;
    timestamp: Date;
}

function CityCard ({city, location, value, status, timestamp}: Props) {
    return(
        <div className="city-container">
            <div className="card-header">
                <h2 style={{color:"black", fontSize:"36px", paddingLeft:"30px"}}>{city}</h2>
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
            </div>

            <div className="value-row">
                <p className="value">{value}</p>
            </div>

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