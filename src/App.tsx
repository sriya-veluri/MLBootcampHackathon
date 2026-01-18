import HomePage from './HomePage'
import CityPage from './CityPage'
import { useState, useEffect } from 'react';
import { AirQualityData, City } from "./types";
import { searchCities } from "./api/geocoding";
import { GeocodingResult } from "./types";
import { fetchAirQuality } from './api/openaqi';

type Page = 'home' | 'city';

const App = () => {
  const [page, setPage] = useState<Page>('home')
  const [city, setCity] = useState<City>();
  const [cityString, setCityString] = useState('');
  const [airquality, setAirQuality] = useState<AirQualityData>();

  const input = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityString(event.target.value);
  };

  useEffect(() => {
    if (page !== 'city' || cityString.length < 2) {
      return;
    }
    const getCities = async () => {
      try {
        const cities = await searchCities(cityString); // Returns array of cities with: name, displayName, lat, lng, country
        const aq = await fetchAirQuality(cities[0].lat, cities[0].lng);
        setAirQuality(aq);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    
    getCities();
  }, [page, cityString]);

  return (
    <>
      {page === 'home' && (
        <HomePage
          city={cityString}
          input={input}
          Enter={() => setPage('city')}
        />
      )}

      {page === 'city' && airquality && (
        <CityPage
          city={cityString}
          aqd={airquality}
          Back={() => setPage('home')}
        />
      )} 
    </>
  );
};

export default App;