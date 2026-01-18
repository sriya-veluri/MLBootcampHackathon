import HomePage from './HomePage'
import CityPage from './CityPage'
import { useState, useEffect } from 'react';
import { AirQualityData, City } from "./types";
import { searchCities } from "./api/geocoding";
import { fetchAirQuality } from './api/openaqi';

type Page = 'home' | 'city';

const App = () => {
  const [page, setPage] = useState<Page>('home')
  const [city, setCity] = useState<City>();
  const [results, setResults] = useState<City[]>();
  const [cityString, setCityString] = useState('');
  const [airquality, setAirQuality] = useState<AirQualityData>();

  const input = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityString(event.target.value);
  };

  useEffect(() => {
    if (cityString.length < 1) {
      setResults([]);
      return;
    }

    const getCities = async () => {
      try {
        const cities = await searchCities(cityString);
        setResults(cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    getCities();
  }, [cityString]);

  const selectCity = async (c: City) => {
    setCity(c);
    setCityString(c.name);
    setResults([]);

    try {
      const aq = await fetchAirQuality(c.lat, c.lng);
      setAirQuality(aq);
      setPage('city');
    } catch (error) {
      console.error("Error fetching air quality:", error);
    }
  };

  return (
    <>
      {page === 'home' && (
        <HomePage
          city={cityString}
          input={input}
          results={results}
          onSelect={selectCity}
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