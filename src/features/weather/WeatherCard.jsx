import { Link } from 'react-router-dom'
import useFavorites from '../../hooks/useFavorites'
import formatTempBoth from '../../utils/formatTemperature'

function WeatherCard({ city, temperature, icon }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const normalizedCity = city || 'City'
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null
  const favorited = isFavorite(normalizedCity)

  function toggleFavorite(e) {
    e.stopPropagation()
    e.preventDefault()
    if (favorited) removeFavorite(normalizedCity)
    else addFavorite(normalizedCity)
  }

  return (
    <div className="weather-card-wrapper">
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
          <p>{typeof temperature === 'number' ? formatTempBoth(temperature) : 'Loading...'}</p>
        </div>
      </Link>

      <button
        type="button"
        className={`fav-toggle ${favorited ? 'fav-on' : ''}`}
        onClick={toggleFavorite}
        aria-pressed={favorited}
        aria-label={favorited ? `Remove ${normalizedCity} from favorites` : `Add ${normalizedCity} to favorites`}
      >
        {favorited ? '★' : '☆'}
      </button>
    </div>
  )
}

export default WeatherCard
