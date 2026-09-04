import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'favorites'

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (err) {
    console.warn('Unable to read favorites from localStorage', err)
    return []
  }
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return []
    return readFavorites()
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (err) {
      console.warn('Unable to write favorites to localStorage', err)
    }
  }, [favorites])

  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) {
        setFavorites(readFavorites())
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addFavorite = useCallback((name) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.name === name)) return prev
      return [...prev, { name }]
    })
  }, [])

  const removeFavorite = useCallback((name) => {
    setFavorites((prev) => prev.filter((f) => f.name !== name))
  }, [])

  const isFavorite = useCallback((name) => {
    return favorites.some((f) => f.name === name)
  }, [favorites])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  }
}
