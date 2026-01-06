import './City.css';
import CityCard from './CityCard'

type Props = {
    city: string;
    Back: () => void;
};

function CityPage({ city, Back }: Props) {
    const value = 42;
    const stat = "Very Unhealthy";
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