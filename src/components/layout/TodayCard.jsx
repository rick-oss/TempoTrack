function TodayCard({ city, country, date, time, icon, description, temp, temp_max, temp_min, feels_like, humidity }) {
  //console.log(children);
  return (
    <div>
      <div>
      <h3>{city} - {country}</h3>
      <h3>{date} - {time}</h3>
      </div>
      <div>
      <img src={`http://openweathermap.org/img/wn/${icon}@4x.png`} alt="Weather icon" />
      <p>{Math.round(temp)}°C</p>
      <p>{Math.round(temp_max)}°C</p>
      <p>{Math.round(temp_min)}°C</p>
      <p>{description}</p>
      <p>Sensação térmica: {Math.round(feels_like)}°C</p>
      </div>
      <p>Humidade: {humidity}%</p>
    </div>
  );
}

export default TodayCard;
