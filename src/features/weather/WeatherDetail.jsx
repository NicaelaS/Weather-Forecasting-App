import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getWeatherByCity } from '../../services/weatherapi'
import formatTempBoth from '../../utils/formatTemperature'

function WeatherDetail() {
  const { city } = useParams()
  const decodedCity = decodeURIComponent(city || '')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadWeather() {
      if (!decodedCity) {
        if (isMounted) {
          setWeather(null)
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setNotFound(false)

      try {
        const result = await getWeatherByCity(decodedCity)

        if (isMounted) {
          setWeather(result)
        }
      } catch (error) {
        if (isMounted) {
          setWeather(null)
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

  return (
    <section className="page-card weather-detail">
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
    </section>
  )
}

export default WeatherDetail
