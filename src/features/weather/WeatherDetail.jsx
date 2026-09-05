import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFavorites from '../../hooks/useFavorites'
import { getForecastByCity, getWeatherByCity } from '../../services/weatherapi'
import formatTempBoth from '../../utils/formatTemperature'

function WeatherDetail() {
  const { city } = useParams()
  const decodedCity = decodeURIComponent(city || '')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    let isMounted = true

    async function loadWeather() {
      if (!decodedCity) {
        if (isMounted) {
          setWeather(null)
          setForecast([])
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setNotFound(false)

      try {
        const [result, forecastResult] = await Promise.all([
          getWeatherByCity(decodedCity),
          getForecastByCity(decodedCity),
        ])

        if (isMounted) {
          setWeather(result)
          setForecast(forecastResult.list || [])
        }
      } catch (error) {
        if (isMounted) {
          setWeather(null)
          setForecast([])
          setNotFound(true)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadWeather()

    return () => {
      isMounted = false
    }
  }, [decodedCity])

  if (loading) {
    return (
      <section className="page-card">
        <h1>Loading weather...</h1>
      </section>
    )
  }

  if (notFound || !weather) {
    return (
      <section className="page-card">
        <h1>City not found</h1>
        <p className="lede">We couldn’t find weather data for this city.</p>
      </section>
    )
  }

  const icon = weather.weather?.[0]?.icon
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null

  const favorited = isFavorite(weather.name)

  return (
    <section className="page-card weather-detail">
      <div className="weather-summary-wrapper weather-summary-wrapper--detail">
        <div className="weather-detail__header">
          {iconUrl ? (
            <img src={iconUrl} alt={`${weather.name} weather icon`} className="weather-detail__icon" />
          ) : (
            <div className="weather-detail__icon weather-detail__icon--fallback" aria-hidden="true">
              ☀️
            </div>
          )}
          <div>
            <h1>{weather.name}</h1>
            <p className="lede">{weather.weather?.[0]?.description || 'Current conditions'}</p>
          </div>
        </div>

        <p className="weather-summary__temp">{formatTempBoth(weather.main?.temp)}</p>

        <div className="weather-summary__meta">
          <span>Humidity: {weather.main?.humidity ?? '--'}%</span>
          <span>Wind speed: {weather.wind?.speed ?? '--'} m/s</span>
          <span>Pressure: {weather.main?.pressure ?? '--'} hPa</span>
        </div>

      </div>

      <button
        type="button"
        className={`fav-toggle fav-toggle--summary ${favorited ? 'fav-on' : ''}`}
        onClick={() => {
          if (favorited) removeFavorite(weather.name)
          else addFavorite(weather.name)
        }}
        aria-label={favorited ? `Remove ${weather.name} from favorites` : `Add ${weather.name} to favorites`}
        aria-pressed={favorited}
      >
        {favorited ? '★' : '☆'}
      </button>

      {forecast.length > 0 && (
        <div className="forecast-panel forecast-panel--detail">
          <h3>Next {forecast.length} {forecast.length === 1 ? 'day' : 'days'}</h3>
          <div className="forecast-panel__list forecast-panel__list--detail">
            {forecast.map((day) => {
              const iconUrl = day.icon ? `https://openweathermap.org/img/wn/${day.icon}@2x.png` : null

              return (
                <div key={day.date} className="forecast-day forecast-day--detail">
                  <span className="forecast-day__label">{day.label}</span>
                  {iconUrl ? (
                    <img src={iconUrl} alt={day.description} className="forecast-day__icon" />
                  ) : (
                    <span className="forecast-day__icon forecast-day__icon--fallback" aria-hidden="true">☀️</span>
                  )}
                  <span className="forecast-day__description">{day.description}</span>
                  <span className="forecast-day__temps">Low: {formatTempBoth(day.tempMin)}</span>
                  <span className="forecast-day__temps">High: {formatTempBoth(day.tempMax)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default WeatherDetail
