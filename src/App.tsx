import HomePage from './HomePage'
import CityPage from './CityPage'
import { useState } from 'react';

type Page = 'home' | 'city';

const App = () => {
  const [page, setPage] = useState<Page>('home')
  const [city, setCity] = useState('');

  const input = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };
  return (
    <>
      {page === 'home' && (
        <HomePage
          city={city}
          input={input}
          Enter={() => setPage('city')}
        />
      )}

      {page === 'city' && (
        <CityPage
          city={city}
          Back={() => setPage('home')}
        />
      )}
    </>
  );
};

export default App;