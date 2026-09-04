export function cToF(celsius) {
  if (typeof celsius !== 'number' || Number.isNaN(celsius)) return null
  return (celsius * 9) / 5 + 32
}

export function formatTempBoth(celsius) {
  if (celsius == null || Number.isNaN(celsius)) return '--'
  const c = Math.round(celsius)
  const f = Math.round(cToF(celsius))
  return `${c}°C / ${f}°F`
}

export default formatTempBoth
