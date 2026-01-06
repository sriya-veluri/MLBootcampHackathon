import './City.css';
import CityCard from './CityCard'

type Props = {
    city: string;
    Back: () => void;
};

function CityPage({ city, Back }: Props) {
    const value = 42;
    const stat = "Good";
    const timestamp = new Date();
    return (
        <>
            <div className="header">
                <button className="btn" onClick={Back}> ← Back to Search</button>
                <h1>🌏 Air Quality Tracker</h1>
            </div>
            <div className="city-center">
                <div className="city-container">
                    <h2 style={{color:"black", fontSize:"40px", paddingLeft:"30px"}}>{city}</h2>
                    {(<CityCard
                        location={city}
                        value={value}
                        status={stat}
                        timestamp={timestamp}
                    />)}
                </div>
            </div>
        </>
    );
}

export default CityPage;