import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

if (!apiKey) {
  console.warn('Missing VITE_OPENWEATHER_API_KEY. Add it to a .env file before running the app.')
}

const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: apiKey,
    units: 'metric',
  },
})

export async function getWeatherByCity(city) {
  if (!apiKey) {
    throw new Error('Missing OpenWeather API key. Add VITE_OPENWEATHER_API_KEY to your .env file.')
  }

  const response = await weatherApi.get('/weather', {
    params: {
      q: city,
    },
  })

  const { name, id, weather, main, wind, sys } = response.data

  return {
    name,
    id,
    weather,
    main: {
      temp: main?.temp,
      humidity: main?.humidity,
      pressure: main?.pressure,
    },
    wind,
    sys,
  }
}

export async function getForecastByCity(city) {
  const response = await weatherApi.get('/forecast', {
    params: {
      q: city,
    },
  })

  return {
    list: response.data.list,
    city: response.data.city,
  }
}
