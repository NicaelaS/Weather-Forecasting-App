import { Link } from 'react-router-dom'

function WeatherCard({ city, temperature, icon }) {
  const normalizedCity = city || 'City'
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null

  return (
    <Link to={`/weather/${encodeURIComponent(normalizedCity)}`} className="weather-card">
      <div className="weather-card__header">
        {iconUrl ? (
          <img src={iconUrl} alt={`${normalizedCity} weather icon`} className="weather-card__icon" />
        ) : (
          <div className="weather-card__icon weather-card__icon--fallback" aria-hidden="true">
            ☀️
          </div>
        )}
      </div>

      <div className="weather-card__body">
        <h2>{normalizedCity}</h2>
        <p>{typeof temperature === 'number' ? `${temperature}°C` : 'Loading...'}</p>
      </div>
    </Link>
  )
}

export default WeatherCard
