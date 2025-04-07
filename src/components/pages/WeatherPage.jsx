import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import { FaTint, FaWind, FaTachometerAlt, FaEye, FaSun } from "react-icons/fa";
import { MdCloudQueue } from "react-icons/md";

import SearchBar from "../layout/SearchBar";
import Container from "../layout/Container";
import Title from "../layout/Title";
import TodayCard from "../layout/TodayCard";
import TomorrowCard from "../layout/TomorrowCard";
import DataCard from "../layout/DataCard";
import useGeolocation from "../useGeolocation";

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

function WeatherPage() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [todayForecast, setTodayForecast] = useState(null);
  const [tomorrowForecast, setTomorrowForecast] = useState({
    temperature: null,
    maxTemperature: null,
    minTemperature: null,
    feels_like: null,
    humidity: null,
    wind_speed: null,
    visibility: null,
    description: null,
    icon: null,
  });
  const [fiveDaysForecast, setFiveDaysForecast] = useState(null);

  const { geolocation, error } = useGeolocation();

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      setLocation(geolocation);
    }
  }, [geolocation]);

  useEffect(() => {
    async function getForecast() {
      if (location.latitude && location.longitude) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric&lang=pt_br`
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar dados da API");
          }

          const data = await response.json();
          setTodayForecast(data);
          console.log("Weather forecast:", data);
        } catch (err) {
          console.log("Error fetching weather forecast:", err);
        }
      }
    }

    getForecast();
  }, [location]);

  useEffect(() => {
    async function getFiveDaysForecast() {
      if (location.latitude && location.longitude) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${apiKey}&lang=pt_br`
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar dados da API");
          }

          const data = await response.json();
          setFiveDaysForecast(data);
          console.log("Five-days forecast:", data);
        } catch (err) {
          console.log("Error fetching five-days forecast:", err);
        }
      }
    }

    getFiveDaysForecast();
  }, [location]);

  useEffect(() => {
    async function getCityName(lat, lon) {
      if (lat !== null && lon !== null && !city) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?types=place&access_token=${mapboxgl.accessToken}&limit=1`
          );
          const data = await response.json();
          if (data.features.length > 0) {
            console.log("Primeira requisição", data);
            const cityName = data.features[0].place_name;
            setCity(cityName);
          }
        } catch (err) {
          console.log("Erro ao buscar cidade:", err);
        }
      }
    }

    getCityName(geolocation.latitude, geolocation.longitude);
  }, [geolocation, city]); // Adiciona city como dependência apenas pro eslint calar a boca

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!forecastData) {
    return <div>Carregando...</div>;
  }

  const getCoordinates = (city_name, latitude, longitude) => {
    setCity(city_name);
    setLocation({
      latitude,
      longitude,
    });
  };

  const timeStamp = forecastData.dt * 1000;
  const sunsetTimeStamp = forecastData.sys.sunset;

  const dateObj = new Date(timeStamp);
  const sunsetTime = new Date(sunsetTimeStamp * 1000).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = dateObj.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  const time = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  // Inverte o dia e mês de posição
  const [month, day] = date.split(" ");
  const formattedString = `${day} ${month}`;

  // Capitaliza descrições recebidas
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Converte a velocidade do vento recebiba (m/s -> km/h)
  const convertWindSpeed = (speed) => {
    const speedInKmH = speed * 3.6;
    return `${Math.floor(speedInKmH)} Km/h`;
  };

  // Converte a visibilidade recebida (m -> km)
  const convertVisibility = (visibility) => {
    return `${visibility / 1000} km`;
  };

  // Calcula o ponto de orvalho
  const calculateDewPoint = (temperature, humidity) => {
    return `${Math.ceil(temperature - (100 - humidity) / 5)}°`;
  };

  const removeAfterSecondComma = (str) => {
    const parts = str.split(",");
    return parts.length > 2 ? parts.slice(0, 2).join(",") : str;
  };

  return (
    <div>
      <h1>Weather Page</h1>
      <SearchBar onLocationSelect={getCoordinates} />
      <Container>
        {forecastData && (
          <TodayCard
            date={capitalize(formattedString)}
            time={time}
            city={removeAfterSecondComma(city)}
            country={forecastData.sys.country}
            icon={forecastData.weather[0].icon}
            description={capitalize(forecastData.weather[0].description)}
            temp={forecastData.main.temp}
            max_temp={forecastData.main.temp_max}
            min_temp={forecastData.main.temp_min}
            feels_like={forecastData.main.feels_like}
            humidity={forecastData.main.humidity}
            wind_speed={convertWindSpeed(forecastData.wind.speed)}
            pressure={forecastData.main.pressure}
            visibility={convertVisibility(forecastData.visibility)}
            sunset={sunsetTime}
            dew_point={calculateDewPoint(forecastData.main.temp, forecastData.main.humidity)}
          />
        )}
        <TomorrowCard />
      </Container>
    </div>
  );
}

export default WeatherPage;
