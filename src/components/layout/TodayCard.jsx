import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";
import { FaTint, FaWind, FaTachometerAlt, FaEye, FaSun } from "react-icons/fa";
import { MdCloudQueue } from "react-icons/md";

import DataCard from "./DataCard";
import styles from "./TodayCard.module.css";

function TodayCard({
  city,
  country,
  date,
  time,
  icon,
  description,
  temp,
  max_temp,
  min_temp,
  feels_like,
  humidity,
  wind_speed,
  pressure,
  visibility,
  sunset,
  dew_point,
}) {
  console.log(wind_speed);
  return (
    <div className={styles.card_wrapper}>
      <div className={styles.card_title}>
        <h3>
          {city} - {country}
        </h3>
        <h3>
          {date} - {time}
        </h3>
      </div>
      <div>
        <div className={styles.main_content}>
          <img src={`http://openweathermap.org/img/wn/${icon}@4x.png`} alt="Weather icon" />
          <p className={styles.current_temp}>
            {Math.ceil(temp)}
            <span className={styles.degree}>°C</span>
          </p>
          <div className={styles.temp_icons}>
            <FaTemperatureHigh size={24} color="#ff0000" className={styles.hot_icon} />
            <FaTemperatureLow size={24} color="#00ffff" className={styles.cold_icon} />
          </div>
          <div className={styles.temp_content}>
            <p className={styles.temps}>
              {Math.floor(max_temp)}
              <span className={styles.degree}>°</span>
            </p>
            <p className={styles.temps}>
              {Math.floor(min_temp)}
              <span className={styles.degree}>°</span>
            </p>
          </div>
          <div className={styles.weatherInfo}>
            <p className={styles.description}>{description}</p>
            <p className={styles.feels_like}>Sensação térmica {Math.floor(feels_like)}°</p>
          </div>
        </div>
      </div>
      <div className={styles.weatherDetails}>
        <DataCard dataName="Umidade" dataIcon={<FaTint />} dataValue={`${humidity}%`} iconColor="#00ffff" />
        <DataCard dataName="Vento" dataIcon={<FaWind />} dataValue={wind_speed} iconColor="#5f9ea0" />
        <DataCard dataName="Pressão" dataIcon={<FaTachometerAlt />} dataValue={`${pressure} mb`} iconColor="#9370db" />
        <DataCard dataName="Visibilidade" dataIcon={<FaEye />} dataValue={visibility} iconColor="#87ceeb" />
        <DataCard dataName="Pôr do Sol" dataIcon={<FaSun />} dataValue={sunset} iconColor="#ffa500" />
        <DataCard dataName="P. de Orvalho" dataIcon={<MdCloudQueue />} dataValue={dew_point} iconColor="#b0c4de" />
      </div>
    </div>
  );
}

export default TodayCard;
