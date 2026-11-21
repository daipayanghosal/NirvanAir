import os
import logging
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.config import PORT, DEBUG, DEFAULT_LOCATION, GEMINI_API_KEY
from backend.services.air_quality import (
    get_consolidated_environmental_data,
    search_locations,
    get_demo_durgapur_data,
    get_naqi_category
)
from backend.services.gemini_service import (
    generate_airwise_briefing,
    generate_ai_assistant_chat
)
from backend.services.planner_engine import generate_daily_plan
from backend.services.swap_engine import get_all_swaps, calculate_swap_impact
from backend.services.simulator_engine import run_community_scenario

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("airwise_backend")

app = FastAPI(
    title="AIRWISE Environmental Intelligence API",
    description="Hyperlocal Air Quality & Sustainable Living Assistant Engine powered by Google Gemini",
    version="1.0.0"
)

# CORS configuration for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class UserProfile(BaseModel):
    location_name: str = "Durgapur"
    latitude: float = 23.5204
    longitude: float = 87.3119
    household_size: int = 4
    has_children: bool = True
    has_elderly: bool = True
    vulnerabilities: List[str] = Field(default_factory=lambda: ["Asthma / Bronchial Sensitivity"])
    commute_mode: str = "two-wheeler"
    commute_distance_km: float = 12.0
    exercise_pref: str = "morning_outdoor"
    budget: str = "moderate"
    has_air_purifier: bool = False

class ChatRequest(BaseModel):
    message: str
    user_profile: Optional[Dict[str, Any]] = None
    chat_history: Optional[List[Dict[str, str]]] = None
    environmental_data: Optional[Dict[str, Any]] = None

class SwapRecordRequest(BaseModel):
    swap_ids: List[str]
    days: int = 30

class SimulatorRequest(BaseModel):
    num_households: int = 100
    vehicle_reduction_percent: float = 20.0
    diesel_genset_reduction_percent: float = 30.0
    waste_composting_percent: float = 25.0
    energy_conservation_percent: float = 15.0

# API Endpoints

@app.get("/")
async def root():
    return {
        "app": "AIRWISE",
        "tagline": "Breathe smarter. Live sustainably.",
        "status": "online",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY") or GEMINI_API_KEY),
        "default_location": DEFAULT_LOCATION["name"]
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "airwise-engine"}

@app.get("/api/locations/search")
async def search_cities(q: str = Query(..., min_length=2)):
    """Search global and Indian cities for coordinates."""
    results = await search_locations(q)
    return {"query": q, "results": results}

@app.get("/api/air-quality")
async def get_air_quality(
    lat: float = Query(23.5204),
    lon: float = Query(87.3119),
    location_name: str = Query("Durgapur"),
    force_demo: bool = Query(False)
):
    """Retrieve environmental telemetry and Indian NAQI analytics."""
    if force_demo:
        return get_demo_durgapur_data()
    return await get_consolidated_environmental_data(lat, lon, location_name)

@app.post("/api/briefing")
async def get_daily_briefing(
    env_data: Dict[str, Any] = Body(...),
    user_profile: Optional[Dict[str, Any]] = Body(None)
):
    """Generate 'Your Airwise Briefing' daily summary."""
    profile = user_profile or UserProfile().model_dump()
    briefing = await generate_airwise_briefing(env_data, profile)
    return briefing

@app.post("/api/planner")
async def get_planner_timeline(
    env_data: Dict[str, Any] = Body(...),
    user_profile: Optional[Dict[str, Any]] = Body(None)
):
    """Generate intelligent 7-segment daily planner routine."""
    profile = user_profile or UserProfile().model_dump()
    timeline = generate_daily_plan(env_data, profile)
    return {"timeline": timeline}

@app.get("/api/swaps")
async def list_swaps():
    """List all available sustainable swaps with emissions and cost math."""
    return {"swaps": get_all_swaps()}

@app.post("/api/swaps/impact")
async def compute_swap_impact(payload: SwapRecordRequest):
    """Calculate cumulative environmental and economic impact for selected swaps."""
    return calculate_swap_impact(payload.swap_ids, payload.days)

@app.post("/api/simulator")
async def simulate_community_action(payload: SimulatorRequest):
    """Run What-if neighborhood scenario simulation."""
    return run_community_scenario(
        num_households=payload.num_households,
        vehicle_reduction_percent=payload.vehicle_reduction_percent,
        diesel_genset_reduction_percent=payload.diesel_genset_reduction_percent,
        waste_composting_percent=payload.waste_composting_percent,
        energy_conservation_percent=payload.energy_conservation_percent
    )

@app.post("/api/chat")
async def chat_with_assistant(payload: ChatRequest):
    """Conversational AI interface powered by Google Gemini with offline heuristic fallback."""
    profile = payload.user_profile or UserProfile().model_dump()
    lat = profile.get("latitude", 23.5204)
    lon = profile.get("longitude", 87.3119)
    loc_name = profile.get("location_name", "Durgapur")

    # If environmental data not passed, fetch it
    env_data = payload.environmental_data
    if not env_data:
        env_data = await get_consolidated_environmental_data(lat, lon, loc_name)

    response = await generate_ai_assistant_chat(
        message=payload.message,
        env_data=env_data,
        user_profile=profile,
        chat_history=payload.chat_history
    )
    return response

@app.get("/api/indoor-doctor")
async def get_indoor_doctor_guidance(aqi: int = Query(250), mode: str = Query("budget")):
    """Get Indoor Air Doctor protocols, DIY specs, and checklist."""
    category_info = get_naqi_category(aqi)
    
    checklist = [
        {
            "id": "chk_ventilation",
            "title": "Strict Ventilation Timing Window",
            "description": "Keep windows sealed during early morning (06:00 - 10:00) and night. Air out living areas only between 13:00 - 15:30.",
            "mode": "both",
            "difficulty": "Easy",
            "points": 15
        },
        {
            "id": "chk_wet_mop",
            "title": "Twice-Daily Damp Mopping",
            "description": "Never use dry straw brooms (which re-suspend settled toxic coarse PM10 into breathing zone). Use damp microfiber mop.",
            "mode": "both",
            "difficulty": "Easy",
            "points": 20
        },
        {
            "id": "chk_no_combustion",
            "title": "Zero Indoor Smoldering Combustion",
            "description": "Strictly eliminate incense sticks (agarbatti), dhoop, scented candles, and mosquito coils. Use liquid electric diffusers.",
            "mode": "both",
            "difficulty": "Easy",
            "points": 25
        },
        {
            "id": "chk_exhaust_fan",
            "title": "Kitchen & Bath Exhaust Management",
            "description": "Run range hood or exhaust fan during and for 15 minutes after all cooking involving oil or spices.",
            "mode": "both",
            "difficulty": "Easy",
            "points": 15
        },
        {
            "id": "chk_budget_filter",
            "title": "DIY Corsi-Rosenthal Fan or Wet-Curtain Barrier",
            "description": "Mount MERV-13/HEPA filter sheet on 12-inch box fan, or mist damp thick curtains over window screens during peak smog.",
            "mode": "budget",
            "difficulty": "Moderate",
            "points": 25
        },
        {
            "id": "chk_advanced_hepa",
            "title": "True HEPA (H13) Continuous Filtration",
            "description": "Maintain True HEPA air purifier on continuous Auto/Medium mode in bedrooms. Replace pre-filter every 30 days.",
            "mode": "advanced",
            "difficulty": "Moderate",
            "points": 25
        },
        {
            "id": "chk_smart_sensor",
            "title": "Laser PM2.5 & CO2 Indoor Sensor Tracking",
            "description": "Monitor indoor PM2.5 (<15 µg/m³) and CO2 (<800 ppm) in real-time to alert when micro-ventilation is required.",
            "mode": "advanced",
            "difficulty": "Easy",
            "points": 20
        }
    ]

    filtered_checklist = [c for c in checklist if c["mode"] in ("both", mode)]

    return {
        "mode": mode,
        "current_aqi": aqi,
        "category": category_info["category"],
        "protocols": {
            "budget_mode_highlights": [
                "Corsi-Rosenthal DIY Box Fan (~₹1,800 total cost, achieves 200 CFM CADR equivalent to ₹14,000 branded purifiers).",
                "Wet microfiber mopping prevents particulate resuspension by 85%.",
                "Window seal strips (foam weatherstripping) costing ₹150 stops drafting through frame gaps."
            ],
            "advanced_mode_highlights": [
                "True H13/H14 HEPA filtration with active carbon pellet layer for VOC adsorption.",
                "Laser optical scattering sensor integration for automated speed modulation.",
                "Positive-pressure balanced mechanical ventilation with inline MERV-16 filtration."
            ],
            "scientific_plant_fact": "IMPORTANT CLARIFICATION: Houseplants (snake plant, areca palm, spider plant) remove negligible trace VOCs under airtight laboratory conditions, but do NOT provide meaningful mechanical particulate filtration (PM2.5/PM10) in living homes. Never rely on plants as substitutes for HEPA media."
        },
        "checklist": filtered_checklist
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=PORT, reload=True)
