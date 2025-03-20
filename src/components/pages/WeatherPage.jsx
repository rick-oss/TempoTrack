import { useEffect, useState } from "react";

import TodayCard from "../layout/TodayCard";

function WeatherPage() {
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getForecast() {
      const apiKey = "a5a81bc492455609ac2418ee3c7ef0e7";
      const city = "Rio de Janeiro";

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados da API");
        }

        const data = await response.json();
        setForecastData(data);
        console.log("Weather forecast:", data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching weather forecast:", err);
      }
    }

    getForecast();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!forecastData) {
    return <div>Carregando...</div>;
  }

  const timeStamp = forecastData.dt * 1000;
  const sunsetTimeStamp = forecastData.sys.sunset;

  const dateObj = new Date(timeStamp);
  const sunsetTime = new Date(sunsetTimeStamp * 1000).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const time = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

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

  const calculateDewPoint = (temperature, humidity) => {
    return `${Math.ceil(temperature - (100 - humidity) / 5)}°`;
  };

  return (
    <div>
      <h1>Weather Page</h1>
      {forecastData && (
        <TodayCard
          date={date}
          time={time}
          city={forecastData.name}
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
    </div>
  );
}

export default WeatherPage;
