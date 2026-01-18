import HomePage from './HomePage'
import CityPage from './CityPage'
import { useState } from 'react';
import { City } from "./types";
import { searchCities } from "./api/geocoding";
import { GeocodingResult } from "./types";
import { fetchAirQuality } from './api/openaqi';

type Page = 'home' | 'city';

const App = () => {
  const [page, setPage] = useState<Page>('home')
  const [city, setCity] = useState<City>();
  const [cityString, setCityString] = useState('');

  const input = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityString(event.target.value);
  };

  return (
    <>
      {page === 'home' && (
        <HomePage
          city={cityString}
          input={input}
          Enter={() => setPage('city')}
        />
      )}

      {page === 'city' && (
        <CityPage
          city={cityString}
          //airquality={fetchAirQuality}
          airquality = {100} // testing 
          Back={() => setPage('home')}
        />
      )}
    </>
  );
};

export default App;