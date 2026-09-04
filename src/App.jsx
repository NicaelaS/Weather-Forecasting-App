import { NavLink, Route, Routes, useParams } from 'react-router-dom'
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

function Home() {
  return (
    <section className="page-card">
      <h1>Weather App</h1>
      <p className="lede">Search for a city to view current weather and forecast details.</p>

      <div className="quick-links">
        <NavLink to="/city/Seattle">Seattle</NavLink>
        <NavLink to="/city/Denver">Denver</NavLink>
        <NavLink to="/city/New%20York">New York</NavLink>
      </div>
    </section>
  )
}

function WeatherForecastingDetail() {
  const { name } = useParams()
  const decodedName = decodeURIComponent(name || '')

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
          <Route path="/" element={<Home />} />
          <Route path="/city/:name" element={<WeatherForecastingDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
