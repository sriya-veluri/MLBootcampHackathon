import './City.css';
import CityCard from './CityCard'
import { AirQualityData, City } from "./types";

type Props = {
    city: string;
    aqd: AirQualityData;
    Back: () => void;
};

const status = (airquality: number | null): string => {
    if (airquality == null) {
        return "No Data"
    }
    if (airquality >= 0 && airquality <= 12) {
      return "Good"
    }
    else if (airquality >= 12 && airquality <= 35) {
        return "Moderate"
    }
    else if (airquality >= 35 && airquality <= 55) {
        return "Unhealthy"
    }
    else {
        return "Very Unhealthy"
    }
};

function CityPage({ city, aqd, Back }: Props) {
    const value = aqd;
    const stat = status(aqd.pm25);
    const timestamp = new Date();
    const dispcity = city;
    const location = "loc";
    return (
        <>
            <div className="header">
                <button className="btn" onClick={Back}> ← Back to Search</button>
                <h1>🌏 Air Quality Tracker</h1>
            </div>
            <div className="city-center">
                {(<CityCard
                    city={dispcity}
                    location={location}
                    aqd={value}
                    status={stat}
                    timestamp={timestamp}
                />)}
            </div>
        </>
    );
}

export default CityPage;