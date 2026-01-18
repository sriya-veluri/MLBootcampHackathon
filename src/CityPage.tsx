import './City.css';
import CityCard from './CityCard'
import { City } from "./types";

type Props = {
    city: string;
    airquality?: number;
    Back: () => void;
};

const status = (airquality?: number): string => {
    if (airquality == null) {
        return "No data"
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

function CityPage({ city, airquality, Back }: Props) {
    const value = 42;
    const stat = status(airquality);
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
                    value={value}
                    status={stat}
                    timestamp={timestamp}
                />)}
            </div>
        </>
    );
}

export default CityPage;