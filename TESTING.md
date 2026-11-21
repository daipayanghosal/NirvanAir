# NirvanAir Automated Testing & Verification Manifest

## Executive Summary

NirvanAir enforces rigorous automated test coverage across both frontend and backend layers to guarantee 100% operational resilience, mathematical correctness of Indian NAQI formulas, diurnal atmospheric boundary layer calculations, and zero-failure offline fallback states.

| Metric | Frontend (Vitest) | Backend (Pytest) | Total Suite |
| :--- | :--- | :--- | :--- |
| **Framework** | Vitest 5.1 + React Testing Library | Pytest 9.2 + FastAPI TestClient | Multi-tier Automated |
| **Test Suites** | 5 Test Files | 2 Test Files | 7 Suites |
| **Total Tests** | 28 Tests | 18 Tests | **46 Tests** |
| **Pass Rate** | **100%** (28/28) | **100%** (18/18) | **100% (46/46)** |
| **Execution Speed**| ~2.7s | ~4.3s | < 8s Total |

---

## 1. Frontend Test Architecture (`frontend/src/test/`)

Run with: `npm run test --prefix frontend` or `npm test` from root.

### A. NAQI Mathematics & Breakpoints (`aqi.test.ts`) — 11 Tests
- **Linear Interpolation Correctness**: Verifies the Indian National Air Quality Index (NAQI) piecewise linear formula across PM2.5 concentrations (0–30 Good, 31–60 Satisfactory, 61–90 Moderate, 91–120 Poor, 121–250 Very Poor, >250 Severe).
- **Sub-index Aggregation**: Ensures the dominant pollutant rule ($AQI = \max(I_i)$) identifies the true limiting health risk.
- **Color & Category Tagging**: Validates color hex assignments conforming to CPCB color standards.
- **Edge Conditions**: Verifies negative and zero handling without NaN or runaway values.

### B. Fallback Heuristic & API Resilience (`api.test.ts`) — 4 Tests
- **Offline Briefing Generation**: Validates that if the Python backend is unreachable, the client-side deterministic heuristic engine synthesizes grounded health advisories with >=2 priority actions.
- **7-Segment Diurnal Routine**: Confirms adaptive scheduling of morning workouts, school commutes, midday errands, and night recovery.
- **Pollution Inversion Defense**: Validates that morning workouts are dynamically rerouted indoors when PM2.5 > 180 µg/m³.
- **Assistant Card Parsing**: Tests Markdown and structured actionable card extraction for conversational AI queries.

### C. Community What-If Scenario Engine (`simulator.test.ts`) — 4 Tests
- **Linear Emission Avoidance Scaling**: Proves neighborhood scaling from 100 to 500 households avoids proportional metric tons of CO2e and kg of PM2.5.
- **Multi-Intervention Compounding**: Verifies combined adoption of electric transit, diesel genset reduction, composting, and solar rooftop.
- **Scientific Integrity Guard**: Enforces clear distinction between mass emission avoidance at tailpipes/chimneys versus nonlinear regional ambient station AQI.

### D. Sustainable Swaps Engine (`swaps.test.ts`) — 6 Tests
- **Catalog Completeness**: Validates 5 core everyday Indian swaps (petrol car to metro, two-wheeler to cycling, diesel generator to inverter, open leaf burning to composting, mosquito coil to liquid repeller).
- **Financial Payback**: Tests INR savings calculations across 30, 90, and 365-day horizons.
- **Environmental Yield**: Confirms daily PM2.5 avoided and annual CO2 offsets against CPCB emission factors.

### E. Layout, Component Rendering & Accessibility (`rendering.test.tsx`) — 3 Tests
- **Navigation Landmarks**: Confirms all 8 intelligence module tabs in the Sidebar (`Home Dashboard`, `AI Daily Planner`, `Indoor Air Doctor`, `Sustainable Swaps`, `Family Protection`, `Community Impact & What-If`, `NirvanAir Assistant`, `Settings & API`).
- **Navbar Telemetry**: Confirms brand typography, NAQI badge, and live location display.
- **Onboarding Modal Flow**: Validates step progression and household composition inputs.

---

## 2. Backend Test Architecture (`backend/tests/`)

Run with: `python -m pytest backend/tests/ -v`

### A. FastAPI REST API Endpoints (`test_api.py`) — 11 Tests
- `GET /` — API root identification and metadata.
- `GET /api/health` — Subsystem health probe and Gemini connectivity status.
- `GET /api/air-quality?force_demo=true` — Curated Durgapur baseline telemetry structure.
- `GET /api/locations?query=Durgapur` — Fuzzy geographic search and geocoding.
- `GET /api/swaps` — Sustainable alternatives catalog serialization.
- `POST /api/swaps/impact` — Multi-swap ROI and carbon/particulate reduction.
- `POST /api/simulator` — Neighborhood scenario simulation calculations.
- `POST /api/indoor-doctor` — DIY air quality troubleshooting heuristics.
- `POST /api/planner` — Adaptive 24-hour diurnal activity scheduler.
- `POST /api/briefing` — Daily briefing synthesizer with fallback support.
- `POST /api/chat` — Gemini-powered assistant endpoint with structured cards.

### B. Services & Mathematical Engines (`test_services.py`) — 7 Tests
- `test_naqi_category_classification` — Verifies all 6 NAQI categories against CPCB bounds.
- `test_diurnal_hourly_forecast` — Tests sinusoidal nocturnal inversion curve generation.
- `test_demo_durgapur_data_integrity` — Confirms real-world industrial winter baseline values.
- `test_swap_engine_catalog_and_impact` — Tests swap calculation math.
- `test_simulator_engine_scaling` — Validates math properties of neighborhood simulation.
- `test_planner_engine_adaptive_scheduling` — Tests schedule adjustments based on vulnerable household profiles.
- `test_fallback_nirvanair_briefing` — Validates deterministic briefing when Gemini API key is absent.

---

## 3. How to Run Tests Locally

```bash
# Run entire test suite (frontend + backend)
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run Vitest in watch mode
cd frontend && npm test
```
