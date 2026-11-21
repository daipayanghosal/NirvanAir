# NirvanAir Problem Statement Alignment & Requirements Traceability Matrix

## Challenge 6: GenAI for Environmental & Climate Action

NirvanAir directly solves the acute public health and urban sustainability crisis in industrial cities (exemplified by Durgapur and the Indo-Gangetic Plain) where winter thermal inversions trap toxic particulates, leaving families vulnerable and citizens feeling helpless.

---

## Requirements Traceability Matrix (RTM)

| Challenge 6 Evaluation Criterion | NirvanAir Feature / Module | Verification & Implementation Evidence |
| :--- | :--- | :--- |
| **1. Hyperlocal Environmental Sensing** | Real-time Open-Meteo & CPCB Ground Station Bridge | Live meteorological & 6-pollutant telemetry (PM2.5, PM10, NO2, SO2, CO, O3) mapped to Indian NAQI scale with Durgapur winter baseline. Verified in `aqi.test.ts` & `test_api.py`. |
| **2. Generative AI Actionable Intelligence** | Google Gemini 2.5 Flash Grounded Health Briefings | Dynamically answers the 3 core questions: What should I do? Why? What difference will it make? Generates personalized routines based on vulnerable household profiles. |
| **3. Diurnal Smog Inversion Defense** | AI 24-Hour Diurnal Daily Planner | Models atmospheric boundary layer compression; automatically reschedules outdoor activities to midday solar heating windows and seals nighttime quarters. |
| **4. Low-Cost Sustainable Living** | Sustainable Swaps Catalog & ROI Engine | 5 tailored Indian urban swaps (EV/metro transit, solar inverter, composting, mosquito mesh). Calculates daily INR savings, CO2e averted, and PM2.5 prevented. |
| **5. Collective Action & What-If Simulation** | Community Impact Simulator | Proves community scaling (100–500 households) produces multi-ton carbon and particulate reductions; displays scientific integrity disclaimer distinguishing emissions from regional AQI. |
| **6. Indoor Air Doctor** | DIY Purifiers & In-Home Source Neutralization | Guides users on DIY Corsi-Rosenthal boxes, damp-mop dust suppression, kitchen exhaust ventilation, and non-combusting mosquito repellers. |
| **7. Resilient Zero-Failure Execution** | Dual-Tier Fallback Architecture | Embedded client-side deterministic heuristic engine operates seamlessly even if offline or Gemini API quotas are exhausted. Verified with 100% test pass rate. |
