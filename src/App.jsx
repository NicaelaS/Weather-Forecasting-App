import { NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './features/weather/HomePage'
import WeatherDetail from './features/weather/WeatherDetail'
import WeatherSearch from './features/search/WeatherSearch'
import FavoritesPage from './features/favorites/FavoritesPage'
import './App.css'

function NavBar() {
  return (
    <nav className="nav-bar" aria-label="Main navigation">
      <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        Home
      </NavLink>
      <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        Favorites
      </NavLink>
    </nav>
  )
}

function Favorites() {
  return (
    <section className="page-card">
      <h1>Favorites</h1>
      <p className="lede">Saved cities will appear here.</p>
    </section>
  )
}

function App() {
  return (
    <div className="app-shell">
      <NavBar />

      <main className="page-shell">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomePage />
                <WeatherSearch />
              </>
            }
          />
          <Route path="/weather/:city" element={<WeatherDetail />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
