import './Home.css';
import { City } from "./types";

type Props = {
  city: string;
  input: (event: React.ChangeEvent<HTMLInputElement>) => void;
  results?: City[];
  onSelect: (city: City) => void;
};

function HomePage({ city, input, results, onSelect }: Props) {
  return (
    <div className="center">
      <h1>🌏 Air Quality Tracker</h1>
      <p style={{ color: "white" }}>Search for any city to see PM2.5 air quality data</p>
      <input
        type="text"
        placeholder='Search for a city (e.g., Tokyo, Paris, New York)...'
        value={city}
        onChange={input}
        className="searchBar"
      />
      {results && results.length > 0 &&
        <div className="menu-container" id="scrollable-menu">
          {results.map((c, i) => (
            <div
              key={i}
              className="menu-item"
              onClick={() => onSelect(c)}
            >
              {c.name}, {c.country}
            </div>
          ))}
        </div>
      }
      <div className="container">
        <h2>Search for a city to get started</h2>
        <p>Enter a city name above to see its air quality data</p>
      </div>
    </div>
  );
}

export default HomePage;