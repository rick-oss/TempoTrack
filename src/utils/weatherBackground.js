import clearSky from "../assets/images/clear-sky.jpg";
import clouds from "../assets/images/clouds.jpg";
import rain from "../assets/images/rain.jpg";
import snow from "../assets/images/snow.jpg";
import thunderstorm from "../assets/images/thunderstorm.jpg";

const getBackgroundByWeather = (weatherMain) => {
  switch (weatherMain) {
    case "Clear":
      return clearSky;
    case "Clouds":
    case "Mist":
    case "Haze":
    case "Fog":
      return clouds;
    case "Rain":
    case "Drizzle":
      return rain;
    case "Thunderstorm":
      return thunderstorm;
    case "Snow":
      return snow;
    default:
      return clearSky;
  }
};

export default getBackgroundByWeather;
