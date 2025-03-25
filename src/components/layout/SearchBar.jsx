import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import styles from "./SearchBar.module.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      async function getSuggestions() {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();

          setResults(data.features);
          console.log("Suggestions:", data.features);
        } catch (err) {
          console.log("Error fetching suggestions:", err);
        }
      }

      getSuggestions();
    } else {
      setResults([]); // Limpa as sugestôes se não houver texto no input
    }
  }, [query]); // Roda sempre que query muda

  return (
    <div className={styles.search_wrapper}>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar por local" />
      <button>
        <FaSearch className={styles.icon} />
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.place_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
