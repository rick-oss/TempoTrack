import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";

import styles from "./ForecastCard.module.css";

function ForecastCard({
  title,
  icon,
  description,
  unit,
  temp,
  max_temp,
  min_temp,
  feels_like,
  dataCards,
  customClass,
}) {
  return (
    <div className={`${styles.card_wrapper} ${styles[customClass]}`}>
      {title}
      <div>
        <div className={styles.main_content}>
          <img src={`http://openweathermap.org/img/wn/${icon}@4x.png`} alt="Weather icon" />
          <p className={styles.current_temp}>{temp}</p>
          <span className={styles.degree}>{unit === "metric" ? "°C" : "°F"}</span>
          <div className={styles.temp_icons}>
            <FaTemperatureHigh size={24} color="#ff0000" className={styles.hot_icon} />
            <FaTemperatureLow size={24} color="#00ffff" className={styles.cold_icon} />
          </div>
          <div className={styles.temp_content}>
            <p className={styles.temps}>
              {max_temp}
              <span className={styles.degree}>°</span>
            </p>
            <p className={styles.temps}>
              {min_temp}
              <span className={styles.degree}>°</span>
            </p>
          </div>
          <div className={styles.weather_info}>
            <p className={styles.description}>{description}</p>
            <p className={styles.feels_like}>Sensação térmica {feels_like}°</p>
          </div>
        </div>
      </div>
      <ul className={styles.weather_details}>
        {dataCards.map((dataCard, index) => (
          <li key={index}>{dataCard}</li>
        ))}
      </ul>
    </div>
  );
}

export default ForecastCard;
