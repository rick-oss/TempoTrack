import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";

import Title from "./Title";
import styles from "./TodayCard.module.css";

function TodayCard({ title, icon, description, temp, max_temp, min_temp, feels_like, dataCards, customClass }) {
  return (
    <div className={`${styles.card_wrapper} ${styles[customClass]}`}>
      {title}
      <div>
        <div className={styles.main_content}>
          <img src={`http://openweathermap.org/img/wn/${icon}@4x.png`} alt="Weather icon" />
          <p className={styles.current_temp}>
            {Math.floor(temp)}
            <span className={styles.degree}>°C</span>
          </p>
          <div className={styles.temp_icons}>
            <FaTemperatureHigh size={24} color="#ff0000" className={styles.hot_icon} />
            <FaTemperatureLow size={24} color="#00ffff" className={styles.cold_icon} />
          </div>
          <div className={styles.temp_content}>
            <p className={styles.temps}>
              {Math.ceil(max_temp)}
              <span className={styles.degree}>°</span>
            </p>
            <p className={styles.temps}>
              {Math.floor(min_temp)}
              <span className={styles.degree}>°</span>
            </p>
          </div>
          <div className={styles.weather_info}>
            <p className={styles.description}>{description}</p>
            <p className={styles.feels_like}>Sensação térmica {Math.floor(feels_like)}°</p>
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

export default TodayCard;
