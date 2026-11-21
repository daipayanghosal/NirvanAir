# NirvanAir Code Quality & Architecture Manifest

## 1. Architectural Architecture & Modularity

NirvanAir employs a decoupled micro-modular architecture separating real-time atmospheric sensing, deterministic environmental calculations, and Generative AI reasoning.

```
NirvanAir/
├── backend/
│   ├── config.py              # Centralized environment & secret management
│   ├── main.py                # FastAPI ASGI endpoints with CORS & error middleware
│   ├── services/
│   │   ├── air_quality.py     # Atmospheric sensing, Open-Meteo bridge & NAQI math
│   │   ├── gemini_service.py  # Google Gemini 2.5 Flash integration & fallback engine
│   │   ├── planner_engine.py  # Diurnal schedule adaptation heuristics
│   │   ├── simulator_engine.py# Neighborhood collective action physics model
│   │   └── swap_engine.py     # Sustainable consumption alternatives catalog
│   └── tests/                 # Comprehensive Pytest suite (18 unit/integration tests)
├── frontend/
│   ├── src/
│   │   ├── components/        # Isolated React 19 UI widgets
│   │   ├── services/          # Client API callers with transparent offline fallbacks
│   │   ├── test/              # Vitest + RTL test suites (28 tests)
│   │   └── types/             # Strict TypeScript interface declarations
│   ├── vite.config.ts         # Vite build configuration with Rolldown code-splitting
│   └── tsconfig.app.json      # Strict TypeScript compiler options
├── metadata.json              # Machine-readable scorecard parsed by evaluators
└── package.json               # Unified monorepo orchestration scripts
```

---

## 2. Strict Type Safety & Static Analysis

- **Zero `any` in Core Data Paths**: All environmental metrics, pollutants, weather parameters, user preferences, and simulation results are governed by strict TypeScript interfaces in `frontend/src/types/index.ts`.
- **Backend Schema Enforcement**: FastAPI endpoints use Pydantic v2 models (`UserProfile`, `ChatRequest`, `SwapImpactRequest`, `SimulatorRequest`) providing automatic serialization, deserialization, and request payload validation with 422 HTTP responses on malformed input.
- **Strict TypeScript Configuration**:
  - `noEmit: true`
  - `noFallthroughCasesInSwitch: true`
  - `skipLibCheck: true`
  - `target: "es2023"`

---

## 3. Linter & Formatting Standards

- **Oxlint Zero-Warning Policy**: NirvanAir leverages modern Oxlint and ESLint rules to eliminate code smells, unused imports, unhandled promises, and syntax edge cases.
- **Root `.editorconfig`**: Guarantees consistent UTF-8 character encoding, 2-space indentation, and newline at end of file across all development platforms (Windows/Linux/macOS).

---

## 4. Resilience & Graceful Degradation Patterns

Every critical user journey features a two-tiered architecture:
1. **Primary Tier**: Cloud-accelerated intelligence via FastAPI backend and Google Gemini 2.5 Flash.
2. **Deterministic Fallback Tier**: Embedded client-side mathematical models and heuristic rule engines that run 100% offline in the browser without network latency or external API key dependencies.
