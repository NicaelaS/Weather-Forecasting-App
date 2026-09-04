import { useState } from 'react'
import { getWeatherByCity } from '../../services/weatherapi'
import formatTempBoth from '../../utils/formatTemperature'

function WeatherSearch() {
  const [cityInput, setCityInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedCity = cityInput.trim()

    if (!trimmedCity) {
      setError('Please enter a city name.')
      setWeather(null)
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await getWeatherByCity(trimmedCity)
      setWeather(result)
    } catch (err) {
      setWeather(null)
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
        </div>
      )}
    </section>
  )
}

export default WeatherSearch
