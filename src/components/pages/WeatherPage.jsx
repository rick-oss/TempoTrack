import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import { FaTint, FaWind, FaTachometerAlt, FaEye, FaSun } from "react-icons/fa";
import { MdCloudQueue } from "react-icons/md";

import SearchBar from "../layout/SearchBar";
import Container from "../layout/Container";
import Title from "../layout/Title";
import ForecastCard from "../layout/ForecastCard";
import FiveDaysForecast from "../layout/FiveDaysForecast";
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
  const [groupedForecast, setGroupedForecast] = useState({});

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

  // Obtém a data do dia subsequente
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "")
    .split(" de ")
    .join(" ");

  // Splita e obtém a data do formato ISO(2025-04-03T15:55:00.123Z -> 2025-04-03)
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (fiveDaysForecast) {
      const tomorrowData = fiveDaysForecast.list.filter((entry) => entry.dt_txt.startsWith(tomorrowStr));

      setTomorrowForecast({
        temperature: getAvg(tomorrowData.map((entry) => entry.main.temp)),
        maxTemperature: Math.max(...tomorrowData.map((entry) => entry.main?.temp_max ?? 0)),
        minTemperature: Math.min(...tomorrowData.map((entry) => entry.main?.temp_min ?? 0)),
        feels_like: getAvg(tomorrowData.map((entry) => entry.main.feels_like)),
        humidity: getAvg(tomorrowData.map((entry) => entry.main.humidity)),
        wind_speed: getAvg(tomorrowData.map((entry) => entry.wind.speed)),
        visibility: getAvg(tomorrowData.map((entry) => entry.visibility)),
        description: tomorrowData[0].weather[0].description,
        icon: tomorrowData[0].weather[0].icon,
      });
    }
  }, [fiveDaysForecast, tomorrowStr]);

  const timeStamp = todayForecast?.dt ? todayForecast.dt * 1000 : null;
  const sunsetTimeStamp = todayForecast?.sys.sunset;

  const dateObj = new Date(timeStamp); // Obtém data atual
  const sunsetTime = new Date(sunsetTimeStamp * 1000).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }); // Obtém hora do pôr do sol

  // Formata data e hora
  const date = dateObj
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "")
    .split(" de ")
    .join(" ");
  const time = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const todayStr = dateObj.toISOString().split("T")[0];

  useEffect(() => {
    if (fiveDaysForecast) {
      const upcomingForecast = fiveDaysForecast.list.filter((entry) => !entry.dt_txt.startsWith(todayStr));

      const groupedByDay = {};

      upcomingForecast.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        groupedByDay[date].push(entry);
      });

      setGroupedForecast(groupedByDay);

      //.log(groupedByDay);

      //console.log(upcomingForecast);
    }
  }, [fiveDaysForecast, todayStr]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!todayForecast) {
    return <div>Carregando...</div>;
  }

  // Obtém dados da cidade digitada na barra de pesquisa
  const getCoordinates = (city_name, latitude, longitude) => {
    setCity(city_name);
    setLocation({
      latitude,
      longitude,
    });
  };

  const getAvg = (temperatures) => {
    const AvgTemperature = temperatures.reduce((acc, temp) => acc + temp, 0) / temperatures.length;
    return AvgTemperature;
  };

  // Capitaliza descrições recebidas
  const capitalize = (str) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  // Converte a velocidade do vento recebiba (m/s -> km/h)
  const convertWindSpeed = (speed) => {
    const speedInKmH = speed * 3.6;
    return `${Math.round(speedInKmH)} Km/h`;
  };

  // Converte a visibilidade recebida (m -> km)
  const convertVisibility = (visibility) => {
    return `${Math.round(visibility / 1000)} km`;
  };

  // Calcula o ponto de orvalho
  const calculateDewPoint = (temperature, humidity) => {
    return `${Math.round(temperature - (100 - humidity) / 5)}°`;
  };

  // Remove caracteres após a segunda vírgula (Ex.: Sp, Sp, BR -> Sp, Sp)
  const removeAfterSecondComma = (str) => {
    const parts = str.split(",");
    return parts.length > 2 ? parts.slice(0, 2).join(",") : str;
  };

  return (
    <div>
      <h1>Weather Page</h1>
      <SearchBar onLocationSelect={getCoordinates} />
      <Container>
        {todayForecast && (
          <ForecastCard
            title={
              <Title
                line1={`${removeAfterSecondComma(city)}, ${todayForecast.sys.country}`}
                line2={`${date}, ${time}`}
              />
            }
            icon={todayForecast.weather[0].icon}
            description={capitalize(todayForecast.weather[0].description)}
            temp={todayForecast.main.temp}
            max_temp={todayForecast.main.temp_max}
            min_temp={todayForecast.main.temp_min}
            feels_like={todayForecast.main.feels_like}
            dataCards={[
              <DataCard
                dataName="Umidade"
                dataIcon={<FaTint />}
                dataValue={`${todayForecast.main.humidity}%`}
                iconColor="#00ffff"
              />,
              <DataCard
                dataName="Vento"
                dataIcon={<FaWind />}
                dataValue={convertWindSpeed(todayForecast.wind.speed)}
                iconColor="#5f9ea0"
              />,
              <DataCard
                dataName="Pressão"
                dataIcon={<FaTachometerAlt />}
                dataValue={`${todayForecast.main.pressure} mb`}
                iconColor="#9370db"
              />,
              <DataCard
                dataName="Visibilidade"
                dataIcon={<FaEye />}
                dataValue={convertVisibility(todayForecast.visibility)}
                iconColor="#87ceeb"
              />,
              <DataCard dataName="Pôr do Sol" dataIcon={<FaSun />} dataValue={sunsetTime} iconColor="#ffa500" />,
              <DataCard
                dataName="P. de Orvalho"
                dataIcon={<MdCloudQueue />}
                dataValue={calculateDewPoint(todayForecast.main.temp, todayForecast.main.humidity)}
                iconColor="#b0c4de"
              />,
            ]}
          />
        )}
        {tomorrowForecast && (
          <ForecastCard
            customClass="custom_card"
            title={<Title line1="Amanhã" line2={tomorrowDate} />}
            icon={tomorrowForecast.icon}
            temp={tomorrowForecast.temperature}
            max_temp={tomorrowForecast.maxTemperature}
            min_temp={tomorrowForecast.minTemperature}
            description={capitalize(tomorrowForecast.description)}
            feels_like={tomorrowForecast.feels_like}
            dataCards={[
              <DataCard
                dataName="Umidade"
                dataIcon={<FaTint />}
                dataValue={`${Math.floor(tomorrowForecast.humidity)}%`}
                iconColor="#00ffff"
              />,
              <DataCard
                dataName="Vento"
                dataIcon={<FaWind />}
                dataValue={convertWindSpeed(tomorrowForecast.wind_speed)}
                iconColor="#5f9ea0"
              />,
              <DataCard
                dataName="Visibilidade"
                dataIcon={<FaEye />}
                dataValue={convertVisibility(tomorrowForecast.visibility)}
                iconColor="#87ceeb"
              />,
            ]}
          />
        )}
      </Container>
    </div>
  );
}

export default WeatherPage;
