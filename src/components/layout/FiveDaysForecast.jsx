import OneDayCard from "./OneDayCard";

import styles from "./FiveDaysForecast.module.css";

function FiveDaysForecast({ cards }) {
  return (
    <div className={styles.card_wrapper}>
      <h1>Previsão para 5 dias</h1>
      {cards.map(({ dateName, date, icon, temp, maxTemp, minTemp, windSpeed }, index) => (
        <OneDayCard
          key={index}
          date_name={dateName}
          date={date}
          icon={icon}
          temp={Math.round(temp)}
          max_temp={Math.ceil(maxTemp)}
          min_temp={Math.floor(minTemp)}
          wind_speed={windSpeed}
        />
      ))}
    </div>
  );
}

export default FiveDaysForecast;
