import './City.css';

type Props = {
    city: string;
    Back: () => void;
};

function CityPage({ city, Back }: Props) {
    return (
        <>
            <div className="header">
                <button className="btn" onClick={Back}> ← Back to Search</button>
                <h1>🌏 Air Quality Tracker</h1>
            </div>
            <div className="city-center">
                <div className="city-container">
                    <h2>{city}</h2>
                </div>
            </div>
        </>
    );
}

export default CityPage;