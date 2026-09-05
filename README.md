
# Weather App (React + Vite)

This is a small, client-only weather application built with React and Vite. It lets users search for cities, view current conditions and short-term forecasts, and save favorite locations locally.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

Key features
- Search for a city and view current weather and forecast
- City detail page with extended weather information
- Save and manage favorite cities (persisted in the browser)
- Temperatures display both Celsius and Fahrenheit

Quick start
1. Create a `.env` file at the project root and add your OpenWeather API key:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

2. Install dependencies and run the development server:

```bash
npm install
npm run dev
```

3. Build for production:

```bash
npm run build
```

Routes
- `/` — Home (search + grid of sample cities)
- `/weather/:city` — City detail page
- `/favorites` — Saved favorite cities list

Important files & conventions
- `src/main.jsx` — mounts a single `BrowserRouter` at the app root
- `src/App.jsx` — route definitions and shared layout
- `src/services/weatherapi.js` — centralized OpenWeather API service (axios instance)
- `src/hooks/useFavorites.js` — the only module allowed to read/write `localStorage` (favorites API)
- `src/utils/formatTemperature.js` — converts and formats Celsius and Fahrenheit (used across the UI)
- `src/features/` — feature folders containing UI components (`weather`, `search`, `favorites`)
- `COPILOT.md` — contributor guidance and conventions

Behavior notes
- The app requests weather metrics in metric units from OpenWeather and converts client-side to show Fahrenheit as well.
- Favorites are stored under the `favorites` key in `localStorage` and synchronized across tabs.

Troubleshooting
- If searches fail with a not-found or API error, confirm `.env` exists at the repo root and contains `VITE_OPENWEATHER_API_KEY`, then restart the dev server.
- Environment variables must start with the `VITE_` prefix to be exposed to client code.

Development notes
- Keep browser persistence isolated to `src/hooks/useFavorites.js` to follow the project convention.
- UI components should call services in `src/services/` rather than performing raw `fetch`/`axios` calls.
- Nav links use `NavLink to='/' end` to avoid incorrect active link highlighting.

Further reading
- Product description: `docs/PRODUCT.md`
- Architecture and component plan: `docs/ARCHITECTURE.md`

Enjoy working with the app — let me know if you want the README expanded with screenshots, API details, or developer recipes.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
