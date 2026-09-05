import { useState } from 'react'
import { getForecastByCity, getWeatherByCity } from '../../services/weatherapi'
import formatTempBoth from '../../utils/formatTemperature'

function WeatherSearch() {
  const [cityInput, setCityInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedCity = cityInput.trim()

    if (!trimmedCity) {
      setError('Please enter a city name.')
      setWeather(null)
      setForecast([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const [result, forecastResult] = await Promise.all([
        getWeatherByCity(trimmedCity),
        getForecastByCity(trimmedCity),
      ])

      setWeather(result)
      setForecast(forecastResult.list || [])
    } catch (err) {
      setWeather(null)
      setForecast([])
      setError(
        err?.message?.includes('API key')
          ? err.message
          : 'Could not find weather data for that city.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-card">
      <h1>Search Weather</h1>

      <form onSubmit={handleSubmit} className="weather-search">
        <input
          type="text"
          value={cityInput}
          onChange={(event) => setCityInput(event.target.value)}
          placeholder="Enter city name"
          aria-label="City name"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {loading && <div className="status-panel">Loading weather data...</div>}

      {error && <div className="status-panel status-panel--error">{error}</div>}

      {weather && (
        <div className="weather-summary">
          <h2>{weather.name}</h2>
          <p className="weather-summary__temp">{formatTempBoth(weather.main?.temp)}</p>

          <div className="weather-summary__meta">
            <span>Humidity: {weather.main?.humidity ?? '--'}%</span>
            <span>Pressure: {weather.main?.pressure ?? '--'} hPa</span>
            <span>Wind: {weather.wind?.speed ?? '--'} m/s</span>
          </div>

          <p>{weather.weather?.[0]?.description || 'Current conditions'}</p>

          {forecast.length > 0 && (
            <div className="forecast-panel">
              <h3>Next 7 days</h3>
              <div className="forecast-panel__list">
                {forecast.map((day) => {
                  const iconUrl = day.icon ? `https://openweathermap.org/img/wn/${day.icon}@2x.png` : null

                  return (
                    <div key={day.date} className="forecast-day">
                      <span className="forecast-day__label">{day.label}</span>
                      {iconUrl ? (
                        <img src={iconUrl} alt={day.description} className="forecast-day__icon" />
                      ) : (
                        <span className="forecast-day__icon forecast-day__icon--fallback" aria-hidden="true">☀️</span>
                      )}
                      <span className="forecast-day__description">{day.description}</span>
                      <span className="forecast-day__temps">
                        Low: {formatTempBoth(day.tempMin)}
                      </span>
                      <span className="forecast-day__temps">
                        High: {formatTempBoth(day.tempMax)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default WeatherSearch
