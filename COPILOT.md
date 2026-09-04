# Copilot Project Guide

## Stack
- React 18+
- Vite
- React Router
- OpenWeather API
- localStorage for favorites persistence

## Project Structure

```text
src/
  app/
    App.jsx
    router.jsx
    providers/
      FavoritesProvider.jsx
  features/
    search/
      SearchBar.jsx
      SearchResults.jsx
    weather/
      WeatherOverview.jsx
      ForecastList.jsx
      CityDetailPage.jsx
      WeatherCard.jsx
    favorites/
      FavoriteList.jsx
      FavoriteItem.jsx
      favoritesStorage.js
    layout/
      Header.jsx
      Shell.jsx
      EmptyState.jsx
      ErrorState.jsx
  services/
    openWeatherApi.js
    weatherNormalizer.js
  hooks/
    useFavorites.js
    useWeatherQuery.js
  store/
    appState.js
    selectors.js
  utils/
    date.js
    formatTemperature.js
    location.js
  styles/
    globals.css
    tokens.css
    components.css
```

## Run the App Locally

From the repo root:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## LocalStorage Convention
Nothing outside `src/hooks/useFavorites.js` may read from or write to `localStorage` directly.

This rule is required so all browser persistence is centralized and consistent. Any favorites-related read/write logic must go through the favorites hook or the storage helper exposed by that hook's module boundaries.

## Coding Expectations
- Keep feature logic grouped by user-facing concern.
- Keep API request code in the service layer.
- Keep UI components focused on rendering and user interaction.
- Keep browser persistence isolated to the favorites flow.
- Avoid introducing backend logic or user auth flows.
