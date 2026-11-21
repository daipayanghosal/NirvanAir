from typing import Dict, Any, List
from datetime import datetime, timezone

def generate_daily_plan(env_data: Dict[str, Any], user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate a 7-segment intelligent daily routine based on environmental telemetry and user lifestyle."""
    aq = env_data.get("air_quality", {})
    aqi = aq.get("aqi", 250)
    category = aq.get("category", "Poor")
    weather = env_data.get("weather", {})
    temp = weather.get("temperature_c", 20.0)
    humidity = weather.get("relative_humidity", 70)
    
    commute_mode = user_profile.get("commute_mode", "two-wheeler")
    exercise_pref = user_profile.get("exercise_pref", "morning_outdoor")
    has_children = user_profile.get("has_children", True)
    has_elderly = user_profile.get("has_elderly", True)
    budget = user_profile.get("budget", "moderate")
    
    plan = []

    # 1. Morning Routine (06:00 - 08:30)
    if aqi >= 201:
        plan.append({
            "segment": "Morning Routine",
            "time_window": "06:30 AM – 08:00 AM",
            "suggested_activity": "Keep all windows sealed. Run bedroom air purifier or DIY Corsi-Rosenthal unit on medium speed. Perform warm saline gargle and nasal rinse.",
            "reasoning": f"Surface temperature inversion and cold air drainage peak between 6 AM and 8 AM, trapping high concentrations of PM2.5 (NAQI: {aqi}). Opening windows now would flood living areas with toxic smog.",
            "expected_benefit": "Maintains indoor PM2.5 below 35 µg/m³ vs 180+ µg/m³ outdoors, protecting morning airway permeability.",
            "alternative": "If indoor space is stuffy, turn on a ceiling fan on low with wet cotton curtains hung over window grills to act as coarse particulate traps.",
            "status": "recommended",
            "icon": "Sun"
        })
    else:
        plan.append({
            "segment": "Morning Routine",
            "time_window": "06:30 AM – 08:00 AM",
            "suggested_activity": "Brief 15-minute cross-ventilation to refresh indoor oxygen levels. Light indoor stretching.",
            "reasoning": f"Current air quality is {category} (AQI: {aqi}). Moderate ambient levels allow safe short-duration air exchange.",
            "expected_benefit": "Reduces indoor CO2 accumulation from overnight respiration without introducing dangerous pollutant spikes.",
            "alternative": "Open windows only on the leeward side away from the street.",
            "status": "recommended",
            "icon": "Sun"
        })

    # 2. Exercise (07:00 - 08:30 or Rescheduled)
    if aqi >= 180:
        plan.append({
            "segment": "Exercise & Fitness",
            "time_window": "07:15 AM – 08:00 AM (Indoors)",
            "suggested_activity": "Indoor functional strength training, yoga, or indoor cycling. Cancel outdoor jogging or open-ground sports.",
            "reasoning": "Vigorous aerobic exertion outdoors increases respiratory intake 8-fold and forces ultrafine particles directly into deep alveolar sacs.",
            "expected_benefit": "Prevents inhalation of approximately 160 µg of toxic particulate matter per hour of intense workout.",
            "alternative": "If you strongly prefer outdoor walking, reschedule to 01:30 PM – 03:00 PM when midday solar heating lifts the smog layer, and wear an N95 mask.",
            "status": "adjusted",
            "icon": "Activity"
        })
    else:
        plan.append({
            "segment": "Exercise & Fitness",
            "time_window": "06:45 AM – 07:45 AM",
            "suggested_activity": "Brisk walking or moderate outdoor jogging in green park areas.",
            "reasoning": f"Favorable dispersion ({category} air quality). Park canopies assist in local particulate deposition.",
            "expected_benefit": "Cardiovascular conditioning with minimal respiratory irritation.",
            "alternative": "Indoor treadmill or bodyweight circuit if feeling sensitive.",
            "status": "recommended",
            "icon": "Activity"
        })

    # 3. Commute to Work / School (08:30 - 10:00)
    if "two-wheeler" in commute_mode or "bike" in commute_mode:
        plan.append({
            "segment": "Morning Commute",
            "time_window": "08:30 AM – 09:30 AM",
            "suggested_activity": "Wear a snug-fitting N95/FFP2 respirator with sealed nose bridge. Consider shifting to Metro or AC Electric Bus if transit route is available.",
            "reasoning": "Riding an open two-wheeler in morning stop-and-go traffic directly exposes you to diesel exhaust, tire wear, and resuspended road dust at street level.",
            "expected_benefit": "N95 reduces inhaled particulate dose by >90%. Shifting to public transit cuts 2.8 kg CO2 and 35g tailpipe PM per trip.",
            "alternative": "If two-wheeler is unavoidable, choose secondary green corridors rather than congested major arterial choke points.",
            "status": "critical" if aqi > 250 else "recommended",
            "icon": "Navigation"
        })
    elif "car" in commute_mode:
        plan.append({
            "segment": "Morning Commute",
            "time_window": "08:30 AM – 09:30 AM",
            "suggested_activity": "Set car climate control to 'Cabin Air Recirculation' mode. Verify cabin HEPA / pollen filter condition. Consider carpooling with a colleague.",
            "reasoning": "Fresh-air intake draws concentrated exhaust fumes directly from the tailpipes of vehicles ahead in dense traffic.",
            "expected_benefit": "Recirculation mode reduces in-cabin PM2.5 levels by 60–80% compared to outside traffic air. Carpooling halves per-capita trip emissions.",
            "alternative": "Park and ride via rapid transit (Metro) if available along your corridor.",
            "status": "recommended",
            "icon": "Car"
        })
    else:
        plan.append({
            "segment": "Morning Commute",
            "time_window": "08:30 AM – 09:30 AM",
            "suggested_activity": "Wear an N95 mask while walking to station/bus stop. Keep bus windows closed if riding an air-conditioned bus.",
            "reasoning": "Transit hubs and bus stops experience high idling emissions.",
            "expected_benefit": "Protects mucous membranes against acute diesel soot exposure.",
            "alternative": "Depart 20 minutes earlier to avoid peak congestion density.",
            "status": "recommended",
            "icon": "Navigation"
        })

    # 4. Shopping & Outdoor Errands (12:00 - 15:30)
    plan.append({
        "segment": "Outdoor Errands & Shopping",
        "time_window": "01:30 PM – 03:30 PM (Optimum Window)",
        "suggested_activity": "Consolidate grocery runs, bank visits, and outdoor errands into this midday time window.",
        "reasoning": "Solar heating increases the boundary layer height to its diurnal peak, accelerating thermal dispersion and lowering ground-level PM2.5 concentrations by 25–40% relative to morning.",
        "expected_benefit": "Minimizes cumulative ambient smog exposure during necessary outdoor activities.",
        "alternative": "Group orders with neighbors for delivery to eliminate individual motorized vehicle trips.",
        "status": "recommended",
        "icon": "ShoppingBag"
    })

    # 5. Children & School Return (14:30 - 16:30)
    if has_children:
        plan.append({
            "segment": "Children / School Activities",
            "time_window": "02:30 PM – 04:30 PM",
            "suggested_activity": "Ensure children wear child-sized N95 masks during transit. Restrict after-school outdoor sports if AQI exceeds 200.",
            "reasoning": "Children breathe faster relative to their body weight and have narrower airways; early-life particulate exposure impairs alveolar development.",
            "expected_benefit": "Prevents acute asthma flares and school absenteeism.",
            "alternative": "Organize indoor board games, library sessions, or craft workshops instead of open-field playground football.",
            "status": "critical" if aqi > 250 else "recommended",
            "icon": "ShieldAlert"
        })

    # 6. Evening Return & Cooking (17:30 - 20:30)
    plan.append({
        "segment": "Evening Routine & Cooking",
        "time_window": "06:30 PM – 08:30 PM",
        "suggested_activity": "Run kitchen exhaust hood on high with kitchen doors closed. Avoid deep frying or dry roasting in open pans without continuous suction. Do not burn mosquito coils or agarbatti indoors.",
        "reasoning": "Indoor cooking fumes (oil aerosols, acrolein) combined with outdoor evening smog inversion compound volatile organic compound (VOC) exposure.",
        "expected_benefit": "Prevents indoor PM2.5 spikes which often reach 400+ µg/m³ during unventilated shallow frying.",
        "alternative": "Use covered steaming, pressure cooking, or an electric air fryer with ducted kitchen ventilation.",
        "status": "recommended",
        "icon": "Utensils"
    })

    # 7. Sleeping Environment (21:30 - 06:30)
    plan.append({
        "segment": "Sleep & Nighttime Sanctuary",
        "time_window": "10:00 PM – 06:30 AM",
        "suggested_activity": "Keep bedroom sealed. Run air purifier on quiet night mode or place a bowl of water near bed with damp towel barrier under doors. Use electric liquid vaporizers instead of burning coils.",
        "reasoning": "You spend 7–8 continuous hours breathing in the bedroom. Low night temperatures generate strong thermal inversions, preventing any outdoor relief until sunrise.",
        "expected_benefit": "Maintains deep restorative sleep, lower resting pulse, and eliminates nocturnal coughing bouts.",
        "alternative": "If electricity is constrained, keep bedroom door and windows latched and use double fabric curtain barriers.",
        "status": "recommended",
        "icon": "Moon"
    })

    for item in plan:
        item["suggested_action"] = item["suggested_activity"]
        item["alternative_if_impractical"] = item["alternative"]

    return plan
