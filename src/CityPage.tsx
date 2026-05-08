import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './City.css';
import CityCard from './CityCard'
import { AirQualityData } from "./types";
import { fetchAQIComparison } from './api/dataset';

type Props = {
    city: string;
    aqd?: AirQualityData;
};

function CityPage({ city, aqd}: Props) {
    const { cityName } = useParams<{ cityName: string }>();
    const [searchParams] = useSearchParams();
    const country = searchParams.get('country') || undefined;
    const [data, setData] = useState<AirQualityData | undefined>(aqd);
    const navigate = useNavigate();

    useEffect(() => {
        if (cityName) {
            setData(undefined); // Clear old data while loading
            const loadData = async () => {
                try {
                    const result = await fetchAQIComparison(decodeURIComponent(cityName), country);
                    setData(result);
                } catch (error) {
                    console.error("Error loading city data:", error);
                }
            };
            loadData();
        }
    }, [cityName, country]);

    const value = data;
    const stat = data?.dataset_aqi_category ?? "No Data";
    const timestamp = data?.lastUpdated ?? "Unknown";
    const dispcity = city || cityName || "Unknown";
    const location = data?.locationName ?? "Unknown";

    return (
        <>
            <div className="header">
                <button className="btn" onClick={() => navigate('/')}> ← Back to Search</button>
                <h1>Air Quality Predictor</h1>
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