# GeoMap - Project InnerSpace

An interactive geothermal and geospatial data visualization platform built with Next.js 14.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS + shadcn/ui
- **Maps:** Mapbox GL JS via react-map-gl
- **Authentication:** Firebase Auth (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- Mapbox Access Token (get one at [mapbox.com](https://www.mapbox.com/))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/claudiaolivaresc/geomap-claude.git
cd geomap-claude
```

2. Install dependencies:
```bash
npm install
```

3. Add your Mapbox token to `.env.local`:
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/
│   ├── layers/       # Layer tree, groups, items, legend
│   ├── layout/       # Header, Sidebar
│   ├── map/          # MapCanvas, MapControls
│   └── ui/           # shadcn/ui components
├── config/           # Layer definitions, map config, permissions
├── hooks/            # Custom React hooks
├── lib/              # Utilities and services
├── stores/           # Zustand state stores
└── types/            # TypeScript type definitions
```

## Architecture

### State Management

The app uses Zustand stores for state management:

- **mapStore** - Map instance, viewport, basemap, navigation
- **layerStore** - Active layers, expanded groups, visibility
- **uiStore** - Sidebar, legend, modals, responsive state
- **authStore** - User authentication and permissions

### Tileservers

The app connects to existing Project InnerSpace tileservers:

- **Raster:** `https://tileserver-147328131785.us-central1.run.app`
- **Vector:** `https://vector-tileserver-147328131785.us-central1.run.app`

### Permission Levels

- `public` - Everyone
- `free` - Registered users
- `premium` - Paid subscribers
- `enterprise` - Enterprise accounts
- `admin` - Administrators

## Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## License

Copyright Project InnerSpace
