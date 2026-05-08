import * as React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { useRouteError } from "react-router-dom";
import { useState, useEffect } from 'react';

import HomePage from './HomePage';
import CityPage from './CityPage';

import { AirQualityData, GeocodingResult } from "./types";
import { searchCities } from "./api/geocoding";
import { fetchAQIComparison } from './api/dataset';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
}

const App = () => {
  const [results, setResults]     = useState<GeocodingResult[]>();
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

  const navigate = useNavigate();

  const selectCity = async (c: GeocodingResult) => {
    setCityString(c.name);
    setResults([]);
    try {
      const aq = await fetchAQIComparison(c.name, c.country);
      setAirQuality(aq);
    } catch (error) {
      console.error("Error fetching AQI comparison:", error);
    }
    const countryParam = c.country ? `?country=${encodeURIComponent(c.country)}` : '';
    navigate(`/city/${encodeURIComponent(c.name)}${countryParam}`);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            city={cityString}
            input={input}
            results={results}
            onSelect={selectCity}
          />
        }
        errorElement={<ErrorPage />}
      />
      <Route
        path="/city/:cityName"
        element={
          <CityPage
            city={cityString}
            aqd={airquality}
          />
        }
        errorElement={<ErrorPage />}
      />
    </Routes>
  );
};

export default App;