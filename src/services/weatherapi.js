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

function buildDateKey(timestamp) {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function normalizeDailyForecast(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return []
  }

  const grouped = new Map()

  list.forEach((entry) => {
    const timestamp = entry.dt ?? entry.date
    if (!timestamp) {
      return
    }

    const dateKey = buildDateKey(timestamp)
    const existing = grouped.get(dateKey) ?? {
      date: dateKey,
      description: entry.weather?.[0]?.description || 'Forecast',
      icon: entry.weather?.[0]?.icon || null,
      tempMin: Number.POSITIVE_INFINITY,
      tempMax: Number.NEGATIVE_INFINITY,
    }

    const tempObject = entry.temp && typeof entry.temp === 'object' ? entry.temp : null
    const tempMin = tempObject?.min ?? entry.main?.temp_min ?? tempObject?.day ?? entry.main?.temp ?? null
    const tempMax = tempObject?.max ?? entry.main?.temp_max ?? tempObject?.day ?? entry.main?.temp ?? null

    existing.tempMin = Number.isFinite(tempMin) ? Math.min(existing.tempMin, tempMin) : existing.tempMin
    existing.tempMax = Number.isFinite(tempMax) ? Math.max(existing.tempMax, tempMax) : existing.tempMax

    if (!existing.description && entry.weather?.[0]?.description) {
      existing.description = entry.weather[0].description
    }

    if (!existing.icon && entry.weather?.[0]?.icon) {
      existing.icon = entry.weather[0].icon
    }

    grouped.set(dateKey, existing)
  })

  return Array.from(grouped.values())
    .filter((item) => Number.isFinite(item.tempMin) && Number.isFinite(item.tempMax))
    .slice(0, 7)
    .map((item) => ({
      ...item,
      label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(`${item.date}T12:00:00`)),
      tempMin: Number(item.tempMin),
      tempMax: Number(item.tempMax),
    }))
}

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
  if (!apiKey) {
    throw new Error('Missing OpenWeather API key. Add VITE_OPENWEATHER_API_KEY to your .env file.')
  }

  const response = await weatherApi.get('/forecast', {
    params: {
      q: city,
    },
  })

  const list = response?.data?.list ?? []
  const normalized = normalizeDailyForecast(list).slice(0, 7)

  return {
    list: normalized,
    city: response?.data?.city ?? null,
  }
}
