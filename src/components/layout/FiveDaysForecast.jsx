import OneDayCard from "./OneDayCard";

import styles from "./FiveDaysForecast.module.css";

function FiveDaysForecast({ cards, loading, safeRender }) {
  return (
    <div className={styles.card_wrapper}>
      <h1>Previsão para 5 dias</h1>
      {cards.map(({ dateName, date, icon, temp, maxTemp, minTemp, windSpeed, unit }, index) => (
        <OneDayCard
          key={index}
          date_name={dateName}
          date={date}
          icon={icon}
          temp={safeRender(loading, Math.round(temp), 18)}
          max_temp={safeRender(loading, Math.ceil(maxTemp), 18)}
          min_temp={safeRender(loading, Math.floor(minTemp), 18)}
          wind_speed={safeRender(loading, windSpeed, 18)}
          unit={unit}
        />
      ))}
    </div>
  );
}

export default FiveDaysForecast;
