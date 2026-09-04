import { NavLink, Route, Routes, useParams } from 'react-router-dom'
import HomePage from './features/weather/HomePage'
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

function WeatherForecastingDetail() {
  const { city } = useParams()
  const decodedName = decodeURIComponent(city || '')

  return (
    <section className="page-card">
      <h1>{decodedName || 'City Forecast'}</h1>
      <p className="lede">Detailed weather forecast for {decodedName || 'this city'}.</p>
      <p>Weather detail content will be connected to the OpenWeather API here.</p>
    </section>
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
          <Route path="/" element={<HomePage />} />
          <Route path="/weather/:city" element={<WeatherForecastingDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
