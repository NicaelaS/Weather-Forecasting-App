import { describe, expect, it } from 'vitest'
import { normalizeDailyForecast } from './weatherapi'

describe('normalizeDailyForecast', () => {
  it('creates a 7-day summary from raw forecast data', () => {
    const rawForecast = [
      {
        dt: 1725148800,
        main: { temp: 19, temp_min: 18, temp_max: 20 },
        weather: [{ description: 'clear sky', icon: '01d' }],
      },
      {
        dt: 1725235200,
        main: { temp: 21, temp_min: 19, temp_max: 22 },
        weather: [{ description: 'few clouds', icon: '02d' }],
      },
      {
        dt: 1725321600,
        main: { temp: 17, temp_min: 16, temp_max: 18 },
        weather: [{ description: 'rain', icon: '10d' }],
      },
      {
        dt: 1725408000,
        main: { temp: 15, temp_min: 14, temp_max: 16 },
        weather: [{ description: 'cloudy', icon: '03d' }],
      },
      {
        dt: 1725494400,
        main: { temp: 16, temp_min: 15, temp_max: 17 },
        weather: [{ description: 'overcast', icon: '04d' }],
      },
      {
        dt: 1725580800,
        main: { temp: 18, temp_min: 17, temp_max: 19 },
        weather: [{ description: 'sunny', icon: '01d' }],
      },
      {
        dt: 1725667200,
        main: { temp: 20, temp_min: 18, temp_max: 21 },
        weather: [{ description: 'clear sky', icon: '01d' }],
      },
    ]

    const result = normalizeDailyForecast(rawForecast)

    expect(result).toHaveLength(7)
    expect(result[0]).toMatchObject({
      date: expect.any(String),
      label: expect.any(String),
      description: expect.any(String),
      icon: expect.any(String),
      tempMin: expect.any(Number),
      tempMax: expect.any(Number),
    })
    expect(result[0].tempMax).toBeGreaterThan(result[0].tempMin)
  })
})
