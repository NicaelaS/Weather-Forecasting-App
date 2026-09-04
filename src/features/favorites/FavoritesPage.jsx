import { Link } from 'react-router-dom'
import useFavorites from '../../hooks/useFavorites'

function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()

  return (
    <section className="page-card">
      <h1>Favorites</h1>
      <p className="lede">Saved cities you can quickly revisit.</p>

      {favorites.length === 0 ? (
        <div className="status-panel">You have no saved favorites yet.</div>
      ) : (
        <div>
          <ul className="favorite-list">
            {favorites.map((f) => (
              <li key={f.name} className="favorite-item">
                <Link to={`/weather/${encodeURIComponent(f.name)}`}>{f.name}</Link>
                <button
                  type="button"
                  aria-label={`Remove ${f.name} from favorites`}
                  className="fav-button"
                  onClick={() => removeFavorite(f.name)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 12 }}>
            <button className="fav-button" onClick={clearFavorites}>
              Clear all
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default FavoritesPage
