import { useEffect, useState } from 'react'
import { getWeatherByCity } from '../../services/weatherapi'
import WeatherCard from './WeatherCard'

const defaultCities = ['Seattle', 'Tokyo', 'Paris', 'London', 'New York', 'Berlin']

function HomePage() {
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadWeather() {
      setLoading(true)

      try {
        const results = await Promise.all(
          defaultCities.map(async (city) => {
            const data = await getWeatherByCity(city)

            return {
              city: data.name || city,
              // keep raw metric temp so formatting util can show both units
              temperature: data.main?.temp,
              icon: data.weather?.[0]?.icon,
            }
          }),
        )

        if (isMounted) {
          setWeatherData(results)
        }
      } catch (error) {
        console.error('Unable to load weather data', error)

        if (isMounted) {
          setWeatherData([])
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
  }, [])

  return (
    <section className="page-card">
      <h1>Weather App</h1>
      <p className="lede">Browse current weather for your top cities.</p>

      {loading ? (
        <div className="status-panel" aria-live="polite">
          Loading weather data...
        </div>
      ) : (
        <div className="weather-grid">
          {weatherData.length > 0 ? (
            weatherData.map((entry) => (
              <WeatherCard
                key={entry.city}
                city={entry.city}
                temperature={entry.temperature}
                icon={entry.icon}
              />
            ))
          ) : (
            <div className="status-panel">No weather data available right now.</div>
          )}
        </div>
      )}
    </section>
  )
}

export default HomePage
