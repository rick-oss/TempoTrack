import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";

import styles from "./OneDayCard.module.css";

function OneDayCard({ date_name, date, icon, temp, max_temp, min_temp, wind_speed, unit }) {
  return (
    <div className={styles.card_wrapper}>
      <h3>{date_name}</h3>
      <p>{date}</p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="ícone do clima" />
      <p>
        {temp}
        {unit === "metric" ? "°C" : "°F"}
      </p>
      <p className={styles.temps}>
        <FaTemperatureHigh size={20} color="#ff0000" className={styles.icons} />
        {max_temp}°
      </p>
      <p className={styles.temps}>
        <FaTemperatureLow size={20} color="#00ffff" className={styles.icons} />
        {min_temp}°
      </p>
      <p className={styles.wind}>{wind_speed}</p>
    </div>
  );
}

export default OneDayCard;
