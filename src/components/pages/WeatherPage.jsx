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
import Loading from "../layout/Loading";
import Button from "../layout/Button";

import PermissionDeniedPage from "./PermissionDeniedPage";
import FullScreenLoading from "./FullScreenLoading";

import styles from "./WeatherPage.module.css";
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
  const [units, setUnits] = useState("metric");

  const [loading, setLoading] = useState(false);
  const [fiveDaysLoading, setFiveDaysLoading] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  const { geolocation, permissionDenied, permissionStatusChecked } = useGeolocation();

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      setLocation(geolocation);
    }
  }, [geolocation]);

  useEffect(() => {
    if (permissionStatusChecked && (todayForecast || permissionDenied)) {
      setAppInitialized(true);
    }
  }, [permissionStatusChecked, todayForecast, permissionDenied]);

  useEffect(() => {
    async function getForecast() {
      if (location.latitude && location.longitude) {
        setLoading(true);

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=${units}&lang=pt_br`
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar dados da API");
          }

          const data = await response.json();
          setTodayForecast(data);
        } catch (err) {
          console.log("Error fetching weather forecast:", err);
        } finally {
          setLoading(false);
        }
      }
    }

    getForecast();
  }, [location, units]);

  useEffect(() => {
    async function getFiveDaysForecast() {
      if (location.latitude && location.longitude) {
        setFiveDaysForecast(null);
        setFiveDaysLoading(true);

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=${units}&appid=${apiKey}&lang=pt_br`
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar dados da API");
          }

          const data = await response.json();
          setFiveDaysForecast(data);
        } catch (err) {
          console.log("Error fetching five-days forecast:", err);
        } finally {
          setFiveDaysLoading(false);
        }
      }
    }

    getFiveDaysForecast();
  }, [location, units]);

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
    async function processTomorrow() {
      if (!fiveDaysLoading && fiveDaysForecast) {
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
    }

    processTomorrow();
  }, [fiveDaysForecast, fiveDaysLoading, tomorrowStr]);

  const timeStamp = todayForecast?.dt ? todayForecast.dt * 1000 : null;
  const sunsetUTC = todayForecast?.sys.sunset;
  const timezone = todayForecast?.timezone;

  const dateObj = new Date(timeStamp); // Obtém data atual
  const sunsetObj = new Date((sunsetUTC + timezone) * 1000); // Obtém horário do pôr do sol

  // Formata horário do pôr do sol apartir do local
  const sunsetTime = sunsetObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

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
    }
  }, [fiveDaysForecast, todayStr]);

  // Obtém dados da cidade digitada na barra de pesquisa
  const getCoordinates = (city_name, latitude, longitude) => {
    setCity(city_name);
    setLocation({
      latitude,
      longitude,
    });
  };

  // Alterna entre as unidades de temperatura
  const toggleUnits = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"));
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
  const convertWindSpeed = (speed, unit) => {
    return unit === "metric" ? `${Math.round(speed * 3.6)} Km/h` : `${Math.round(speed)} mph`;
  };

  const cardsData = Object.entries(groupedForecast).map(([date, entries]) => {
    const objDate = new Date(`${date}T12:00:00`);
    const objMonth = objDate.getMonth() + 1;

    const dayName = objDate.toLocaleDateString("pt-BR", { weekday: "short" }).replace(",", "");
    const dayNumber = objDate.toLocaleDateString("pt-BR", { day: "2-digit" });
    const monthNumber = objMonth.toString().padStart(2, "0");

    return {
      dateName: capitalize(dayName),
      date: `${dayNumber}/${monthNumber}`,
      icon: entries[Math.floor(entries.length / 2)].weather[0].icon,
      temp: getAvg(entries.map((entry) => entry.main.temp)),
      maxTemp: Math.max(...entries.map((entry) => entry.main.temp_max)),
      minTemp: Math.min(...entries.map((entry) => entry.main.temp_min)),
      windSpeed: convertWindSpeed(getAvg(entries.map((entry) => entry.wind.speed)), units),
      unit: units,
    };
  });

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

  const renderWithLoading = (loadingState, executable, loadingSize) => {
    return !loadingState ? executable : <Loading size={loadingSize} />;
  };

  const getBackgroundByWeather = (weatherMain) => {
    switch (weatherMain) {
      case "Clear":
        return "/images/clear-sky.jpg";
      case "Clouds":
      case "Mist":
      case "Haze":
      case "Fog":
        return "/images/clouds.jpg";
      case "Rain":
      case "Drizzle":
        return "/images/rain.jpg";
      case "Thunderstorm":
        return "/images/thunderstorm.jpg";
      case "Snow":
        return "/images/snow.jpg";
      default:
        return "/images/clear-sky.jpg";
    }
  };
  const bgImage = getBackgroundByWeather(todayForecast?.weather[0].main);

  return (
    <>
      {!appInitialized ? (
        <FullScreenLoading />
      ) : permissionDenied && !todayForecast ? (
        <PermissionDeniedPage onLocationSelect={getCoordinates} />
      ) : (
        <>
          <div
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100%",
              paddingTop: "40px",
            }}
          >
            <div className={styles.tool_bar}>
              <SearchBar onLocationSelect={getCoordinates} />
              <Button onUnitToggle={toggleUnits} unit={units} />
            </div>
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
                  temp={renderWithLoading(loading, Math.round(todayForecast.main.temp), 64)}
                  max_temp={renderWithLoading(loading, Math.ceil(todayForecast.main.temp_max), 18)}
                  min_temp={renderWithLoading(loading, Math.floor(todayForecast.main.temp_min), 18)}
                  feels_like={renderWithLoading(loading, Math.round(todayForecast.main.feels_like), 18)}
                  unit={units}
                  dataCards={[
                    <DataCard
                      dataName="Umidade"
                      dataIcon={<FaTint />}
                      dataValue={renderWithLoading(loading, `${Math.floor(todayForecast.main.humidity)}%`, 18)}
                      iconColor="#00ffff"
                    />,
                    <DataCard
                      dataName="Vento"
                      dataIcon={<FaWind />}
                      dataValue={renderWithLoading(loading, convertWindSpeed(todayForecast.wind.speed, units), 18)}
                      iconColor="#4dd0e1"
                    />,
                    <DataCard
                      dataName="Pressão"
                      dataIcon={<FaTachometerAlt />}
                      dataValue={renderWithLoading(loading, `${todayForecast.main.pressure} mb`, 18)}
                      iconColor="#9370db"
                    />,
                    <DataCard
                      dataName="Visibilidade"
                      dataIcon={<FaEye />}
                      dataValue={renderWithLoading(loading, convertVisibility(todayForecast.visibility), 18)}
                      iconColor="#87ceeb"
                    />,
                    <DataCard
                      dataName="Pôr do Sol"
                      dataIcon={<FaSun />}
                      dataValue={renderWithLoading(loading, sunsetTime, 18)}
                      iconColor="#ffa500"
                    />,
                    <DataCard
                      dataName="P. de Orvalho"
                      dataIcon={<MdCloudQueue />}
                      dataValue={renderWithLoading(
                        loading,
                        calculateDewPoint(todayForecast.main.temp, todayForecast.main.humidity),
                        18
                      )}
                      iconColor="#f1f1f1"
                    />,
                  ]}
                />
              )}

              {tomorrowForecast && (
                <ForecastCard
                  customClass="custom_card"
                  title={<Title line1="Amanhã" line2={tomorrowDate} />}
                  icon={tomorrowForecast.icon}
                  temp={renderWithLoading(fiveDaysLoading, Math.round(tomorrowForecast.temperature), 64)}
                  max_temp={renderWithLoading(fiveDaysLoading, Math.ceil(tomorrowForecast.maxTemperature), 18)}
                  min_temp={renderWithLoading(fiveDaysLoading, Math.floor(tomorrowForecast.minTemperature), 18)}
                  description={capitalize(tomorrowForecast.description)}
                  feels_like={renderWithLoading(fiveDaysLoading, Math.round(tomorrowForecast.feels_like), 18)}
                  unit={units}
                  dataCards={[
                    <DataCard
                      dataName="Umidade"
                      dataIcon={<FaTint />}
                      dataValue={renderWithLoading(fiveDaysLoading, `${Math.floor(tomorrowForecast.humidity)}%`, 18)}
                      iconColor="#00ffff"
                    />,
                    <DataCard
                      dataName="Vento"
                      dataIcon={<FaWind />}
                      dataValue={renderWithLoading(
                        fiveDaysLoading,
                        convertWindSpeed(tomorrowForecast.wind_speed, units),
                        18
                      )}
                      iconColor="#4dd0e1"
                    />,
                    <DataCard
                      dataName="Visibilidade"
                      dataIcon={<FaEye />}
                      dataValue={renderWithLoading(fiveDaysLoading, convertVisibility(tomorrowForecast.visibility), 18)}
                      iconColor="#87ceeb"
                    />,
                  ]}
                />
              )}
            </Container>
            <Container customClass="custom_class">
              <FiveDaysForecast cards={cardsData} loading={fiveDaysLoading} safeRender={renderWithLoading} />
            </Container>
          </div>
        </>
      )}
    </>
  );
}

export default WeatherPage;
