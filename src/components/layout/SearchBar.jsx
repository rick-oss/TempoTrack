import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import styles from "./SearchBar.module.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const SearchBar = ({ onLocationSelect }) => {
  const [searchPlace, setSearchPlace] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchPlace) {
      async function getSuggestions() {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchPlace}.json?types=place&access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();

          setResults(data.features);
          console.log(data.features);
        } catch (err) {
          console.log("Error fetching suggestions:", err);
        }
      }

      getSuggestions();
    } else {
      setResults([]); // Limpa as sugestôes se não houver texto no input
    }
  }, [searchPlace]); // Roda sempre que searchPlace muda

  const getSelectedPlace = (placeName) => {
    setSearchPlace(placeName);
  };

  const getPlaceCoordinates = (city_name, latitude, longitude) => {
    {
      onLocationSelect(city_name, latitude, longitude);
    }
  };

  return (
    <div className={styles.search_wrapper}>
      <input
        type="text"
        value={searchPlace}
        placeholder="Pesquisar por local"
        onChange={(e) => setSearchPlace(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results.length > 0) {
            const firstResult = results[0];
            getSelectedPlace(firstResult.place_name);
            getPlaceCoordinates(firstResult.geometry.coordinates[1], firstResult.geometry.coordinates[0]);
            setSearchPlace("");
          }
        }}
      />
      <i>
        <FaSearch className={styles.icon} />
      </i>
      <ul>
        {results.map((result) => (
          <li
            key={result.id}
            onClick={() => {
              getSelectedPlace(result.place_name);
              getPlaceCoordinates(result.place_name, result.geometry.coordinates[1], result.geometry.coordinates[0]);
              setSearchPlace("");
            }}
          >
            {result.place_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
