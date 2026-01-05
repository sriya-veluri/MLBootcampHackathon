import './Home.css';
import React, {useState} from 'react';

const App = () => {
  const [city, setCity] = useState('');
  const input = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };
  return (
    <div className="center">
      <h1>🌏 Air Quality Tracker</h1>
      <p style={{ color: "white" }}>Search for any city to see PM2.5 air quality data</p>
      <input
        type="text"
        placeholder='Search for a city (e.g., Tokyo, Paris, New York)...'
        value={city}
        onChange={input}
        className="searchBar"/>
      <div className="container">
        <h2>Search for a city to get started</h2>
        <p>Enter a city name above to see its air quality data</p>
      </div>
    </div>
  );
};

export default App;