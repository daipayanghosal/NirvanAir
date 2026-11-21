# AIRWISE — AI-Powered Hyperlocal Air Quality & Sustainable Living Assistant
> **Tagline:** Breathe smarter. Live sustainably.  
> *Developed for the Google GenAI Innovation Challenge (PromptWars).*

---

## 1. Product Vision & Overview

**AIRWISE** is an environmental intelligence and personal decision-support platform designed to help individuals, families, and communities navigate severe winter smog and urban air pollution. 

Unlike generic AQI monitors or superficial chatbots, AIRWISE synthesizes live atmospheric sensing, boundary-layer meteorology, and generative AI (Google Gemini 2.5) into actionable daily living strategies.

### The Fundamental Guiding Principle
Every recommendation answers three essential questions:
1. **What should I do?** (Clear, concrete action)
2. **Why should I do it?** (Grounded in atmospheric physics, micro-particulate biology, or emission factors)
3. **What difference will it make?** (Quantified personal exposure reduction or collective carbon/soot mitigation)

---

## 2. Key Modules & Functional Architecture

### A. Home Dashboard (Hyperlocal Telemetry & Briefing)
- **Real-time Observations:** Displays Indian NAQI (CPCB 6-category standard) or US EPA AQI, dominant pollutant, PM2.5, PM10, NO₂, SO₂, CO, and Ground-level Ozone.
- **Atmospheric Physics:** Tracks boundary-layer thermal inversions, surface pressure, wind vectors, and relative humidity.
- **Your Airwise Briefing:** AI-generated daily synthesis explaining current conditions, root causes of concern, demographic vulnerability warnings, and prioritized daily interventions.
- **24-Hour Diurnal Pollution Trend:** Interactive Recharts area chart annotating morning and evening smog inversion peaks.
- **Hyperlocal Map:** Interactive Leaflet GIS mapping indicating the nearest ground monitoring station and airshed dispersion zone.
- **Transparent Provenance:** Distinctly labels *Live Satellite & Ground Bridge* vs. *Realistic Winter Smog Baseline* data.

### B. AI Daily Planner
- Intelligently customizes a 7-segment 24-hour daily timeline (Morning Routine, Fitness, Commute, Midday Errands, School Return, Evening Cooking, Sleep Sanctuary).
- Adapts dynamically to diurnal smog inversion cycles (e.g. shifts morning workouts indoors or reschedules outdoor errands to the 1:30 PM – 3:30 PM solar dispersal window).
- Provides practical alternatives for every schedule segment.

### C. Indoor Air Doctor
- **Ventilation Timing Engine:** Dynamically signals when it is safe to open windows vs. when to maintain airtight seals based on diurnal boundary-layer expansion.
- **Dual Mode Protocols:**
  - **Budget Mode:** Step-by-step DIY Corsi-Rosenthal Box Air Purifier design (~₹1,800 cost, delivering 200 CFM CADR equivalent to ₹14,000 branded purifiers), damp-curtain particulate barriers, and wet-mopping hygiene.
  - **Advanced Mode:** True H13 HEPA filtration protocols, sensor calibration, and an interactive HEPA Filter Life Estimator.
- **Scientific Plant Clarification:** Explicitly debunking the myth that houseplants substitute for mechanical HEPA filtration against particulate matter.
- **Household Clean Air Checklist:** Interactive tracker with celebratory confetti upon completing indoor protections.

### D. Sustainable Swap Engine (Signature Feature)
- Catalog of high-impact everyday activities with quantified alternatives:
  - Private Car / Two-Wheeler → Metro / Electric Bus / Cycling
  - Diesel Generator → Battery Inverter & Rooftop Solar
  - Open Leaf & Waste Burning → Decentralized Community Composting
  - Smoldering Mosquito Coils → Sealed Mechanical Mesh / Liquid Electric Repellers
  - Single-Use Plastic Bags → Organic Canvas / Jute Totes
- Transparent calculation methodology disclosing emission factors (kg CO₂e, grams PM2.5, liters fuel, and ₹ household savings).
- Interactive swap logger with a cumulative 30-day impact dashboard and tree-year equivalence.

### E. Family Protection
- Household configuration for infants/children, senior citizens, and members with diagnosed respiratory/cardiovascular sensitivities.
- **School & Recess Decision Matrix:** Clear threshold-based rules for PE sports and classroom windows across NAQI ranges.
- **Mask Efficacy Matrix:** Rigorous comparison between certified N95/FFP2 respirators (>95% filtration) vs surgical masks (30–50%) vs cloth masks (<15%).
- **Prominent Medical Disclaimer:** Clarifies that AIRWISE is an informational assistant, not a diagnostic medical device.

### F. Community Impact & What-If Scenario Simulator
- **What-If Neighborhood Simulator:** Interactive sliders allowing users to model changes across 10 to 1,000 households:
  - Vehicle travel reduction (%)
  - Diesel generator avoidance (%)
  - Organic waste composting (%)
  - Household energy conservation (%)
- Dynamic outputs: Vehicle-km avoided, fuel saved (L), CO₂ avoided (kg), PM2.5 soot prevented (kg), NOx avoided, and direct community ₹ savings.
- **Scientific Integrity Guardrail:** Explicitly states that mass emission reductions reduce ground-level toxic exposure without implying an immediate, linear drop in regional station AQI numbers.

### G. AIRWISE AI Assistant
- Conversational assistant powered by Google Gemini 2.5 Flash, grounded in current hyperlocal telemetry and household profiles.
- Produces structured **Actionable Recommendation Cards** (with Priority, Suggested Action, Reasoning, Expected Benefit, Confidence, and Data Sources).
- Features full fallback heuristics to ensure continuous availability even when offline or uncredentialed.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts, Leaflet, Canvas Confetti.
- **Backend:** Python 3.12, FastAPI, Uvicorn, Pydantic, HTTPX, Python-Dotenv.
- **AI / LLM:** Google Gemini API (`gemini-2.5-flash` via `google-genai` SDK and structured JSON mode).
- **Environmental Data:** Open-Meteo Air Quality API, Open-Meteo Weather API, CPCB NAQI standard break points, OpenAQ integration.

---

## 4. Local Execution & Setup Instructions

### Prerequisites
- Node.js v18+ and npm
- Python 3.10+ and pip

### Step 1: Clone and Configure Environment
```bash
git clone <repository_url>
cd Airwise

# Copy environment variables
cp .env.example .env
```
Open `.env` and optionally insert your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no Gemini API key is provided, AIRWISE automatically runs in its intelligent offline heuristic fallback mode without breaking).*

### Step 2: Install Dependencies

#### Python Backend:
```bash
pip install -r backend/requirements.txt
```

#### React Frontend:
```bash
cd frontend
npm install
cd ..
```

### Step 3: Run the Application

You can run both services concurrently:
```bash
npm run dev
```

Or run them in separate terminals:
- **Terminal 1 (Backend API):**
  ```bash
  python -m uvicorn backend.main:app --reload --port 8000
  ```
- **Terminal 2 (Frontend Client):**
  ```bash
  npm run dev:frontend
  ```

Access the web interface at: **`http://localhost:5173`**  
Access the backend API docs at: **`http://localhost:8000/docs`**

---

## 5. Demonstration Scenario

- **Initial Demonstration Hub:** Durgapur, West Bengal, India (Industrial corridor subject to winter thermal smog inversions).
- **Baseline Scenario:** Toggle between *Live Sensing* and the curated *Durgapur Winter Smog Baseline* (285 NAQI, Poor, 184.5 µg/m³ PM2.5) via the toggle in the top navigation bar.
- **Search Any Location:** Use the city search dropdown or the "Use My Current Device Location" button to inspect live air telemetry for any city globally.

---

## 6. License
MIT License. Developed for Google GenAI Innovation Challenge (PromptWars).
