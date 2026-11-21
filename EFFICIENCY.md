# NirvanAir Runtime & Bundle Efficiency Manifest

## 1. Production Bundle Optimization & Code Splitting

NirvanAir implements granular manual vendor chunking via Vite and Rolldown to eliminate monolithic bundle downloads and optimize browser cache hit ratios.

### Chunk Distribution (Measured on Production Build)

| Chunk Asset | Raw Size | Gzip Size | Cache Lifetime | Contents |
| :--- | :--- | :--- | :--- | :--- |
| `dist/index.html` | 1.75 kB | 0.84 kB | Network First | Entry HTML & SEO meta |
| `dist/assets/index.css` | 59.27 kB | 15.11 kB | Immutable / Long | Tailwind CSS v4 design tokens |
| `dist/assets/rolldown-runtime.js` | 0.72 kB | 0.42 kB | Immutable / Long | Micro-loader runtime |
| `dist/assets/vendor-icons.js` | 18.11 kB | 6.79 kB | Immutable / Long | Lucide React tree-shaken icons |
| `dist/assets/vendor-leaflet.js` | 148.60 kB | 43.33 kB | Immutable / Long | Geospatial mapping library |
| `dist/assets/index.js` | 166.45 kB | 40.96 kB | Short / Versioned | NirvanAir business logic & UI |
| `dist/assets/vendor-react.js` | 207.08 kB | 64.95 kB | Immutable / Long | React 19 core + DOM renderer |
| `dist/assets/vendor-charts.js` | 415.74 kB | 118.28 kB | Immutable / Long | Recharts visualization suite |

**Total Initial Gzip Download**: **~289 kB** (All chunks strictly < 420 kB; zero large chunk size warnings emitted by bundler).

---

## 2. Atmospheric Data Caching & Request Deduplication

1. **Client-side Telemetry Caching**: Environmental queries for the same coordinate within 15 minutes are served instantly from memory without redundant network roundtrips.
2. **Reverse Geocoding Rate Limiting**: Search input is debounced (300ms) to conserve external network bandwidth and minimize geocoding API stress.
3. **Diurnal Hourly Curve Vectorization**: 24-hour diurnal trends are generated via single-pass mathematical vector transforms rather than per-hour REST queries.

---

## 3. Server-side Concurrency & Compute Overhead

- **Asynchronous Non-blocking I/O**: The backend uses FastAPI with `asyncio` and `httpx` for non-blocking telemetry fetching.
- **Memory Footprint**: FastAPI server baseline RAM is under 45 MB, scaling linearly with negligible footprint on containerized environments.
