# Architecture Proposal

## Overview
This app is a small, client-only React + Vite weather experience built around clear feature boundaries, a lightweight router, and a dedicated API layer for OpenWeather data. The goal is to keep the app easy to reason about while supporting the core flows required by the product: city search, forecast browsing, city detail views, and persistent favorites.

The architecture intentionally avoids over-engineering. For a project of this size, a simple feature-oriented structure is more maintainable than a heavy state-management setup.

## Proposed Folder Structure

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

### Structure Notes
- Feature folders group code by user-facing behavior instead of implementation type.
- API and normalization logic live outside the UI layer so views stay focused on rendering.
- Browser-only persistence logic is isolated in a dedicated favorites module.
- The app stays intentionally shallow and easy to navigate for a small project.

## Component Tree

```text
App
  Shell
    Header
      Brand
      SearchBar
    Main
      HomePage
        SearchResults
        FavoriteList
        WeatherOverview
        ForecastList
      CityDetailPage
        WeatherOverview
        ForecastList
        FavoriteToggle
        BackLink
      NotFoundPage
```

### Component Responsibilities
- App: root composition, router mounting, app bootstrap
- Shell: consistent page frame and layout wrapper
- Header: persistent navigation and global search affordances
- SearchBar: user input for city lookup
- SearchResults: results surfaced from search interaction
- WeatherOverview: current conditions summary for a selected city
- ForecastList: time-based or day-based forecast display
- CityDetailPage: full weather context for one city
- FavoriteList: saved cities for repeat access
- FavoriteItem: single saved city entry
- EmptyState / ErrorState: user-friendly handling for no data or failed requests

## Route Proposal

```text
/                  -> default home/search page
/city/:cityId      -> detailed weather page for a single city
```

### Routing Notes
- The app should use a simple route map with a clear default entry point.
- The selected city is represented in the URL through a stable identifier so routes remain sharable and predictable.
- City detail pages should be lightweight and focused on weather context rather than broad app navigation.

## State Ownership

### Local UI State
This state belongs to a single component or view and should remain local when possible:
- search input text
- loading flag for a single request
- selected forecast day or time slot
- inline validation or form errors
- collapsed/expanded UI sections

### Shared App State
This state is needed across multiple parts of the app:
- favorites list
- current selected city
- latest weather state used in the main experience

Recommended pattern:
- Favorites live in a shared provider or custom hook so they can be accessed by multiple screens.
- Selected city state should be derived from route parameters whenever possible.
- The app should not create a large, centralized store unless the feature set expands.

### Derived State
Derived values should not be duplicated in permanent state:
- formatted temperature display
- detection of whether a city is already favorited
- sorted forecast list for display
- summary values derived from raw weather payloads

## Local vs Shared State Summary

Local state:
- form input
- request status for one component
- temporary UI state
- active selection within a screen

Shared state:
- favorites list
- selected city context across views
- commonly used weather data when multiple screens need the same city data

## OpenWeather API Organization

All weather requests should be routed through a dedicated service layer instead of being called directly inside components.

### Proposed Service Layer
- services/openWeatherApi.js
  - handles API base URLs and request configuration
  - issues city search, current weather, and forecast requests
  - centralizes API errors and response handling

- services/weatherNormalizer.js
  - transforms raw API payloads into app-friendly objects
  - normalizes dates, temperature values, weather labels, and city metadata
  - keeps UI code free from OpenWeather-specific response shapes

### Example responsibilities
- searchCities(query)
- getCurrentWeather(cityId)
- getForecast(cityId)
- normalizeCityResult(data)
- normalizeForecastData(data)
- normalizeCurrentWeather(data)

This separation makes the app easier to evolve if the API contract changes or if the same weather data is reused in multiple screens.

## Data Flow

1. The user searches for a city.
2. The search input triggers a city-search API call.
3. The selected city becomes the active city for the current UI.
4. The app requests detailed weather and forecast data for that city.
5. The raw response is normalized before rendering.
6. The city detail page or overview reads from the normalized data model.
7. Favorites are updated separately and persisted in localStorage.

This keeps the flow simple:
- UI renders the app state
- custom hooks or providers manage shared state
- services own network integration
- storage layer handles browser persistence

## Persistence Strategy
Favorites should be persisted in the browser via localStorage so the list survives page reloads without a backend.

Recommended model:
- Keep favorites in memory as the live app state
- Read initial favorites from localStorage on startup
- Write changes back to localStorage whenever favorites are added or removed
- Treat localStorage as a persistence layer, not as the primary app state source

## Error and Loading Handling
The app should include clear states for:
- fetching city data
- searching for a city that does not exist
- failed API requests
- empty results
- missing favorite data

These states should be handled centrally enough to keep the UI consistent without repeating logic across components.

## Architectural Principles
- Keep the app small and easy to understand
- Separate UI, state, services, and persistence concerns
- Put network code in one service layer
- Keep shared app state minimal and purposeful
- Prefer clear feature boundaries over deep abstraction

## Review Summary
This proposal keeps the architecture intentionally lightweight for a client-only weather app while still supporting the required product flows. It balances readability and maintainability with a simple structure that is easy to build and review as a small React application.
