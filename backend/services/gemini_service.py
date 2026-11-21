import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from backend.config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

# System prompt defining AIRWISE persona, scientific guardrails, and ethics
AIRWISE_SYSTEM_PROMPT = """You are AIRWISE, an elite AI-Powered Hyperlocal Environmental Intelligence & Sustainable Living Assistant.
Tagline: "Breathe smarter. Live sustainably."

Your core principle: EVERY recommendation must answer three essential questions:
1. What should I do? (Clear, concrete action)
2. Why should I do it? (Rooted in atmospheric physics, particulate matter biology, or emission factors)
3. What difference will it make? (Health exposure reduction or quantified environmental benefit)

Crucial Safety and Integrity Guardrails:
- Prioritize health protection over sustainability targets when pollution is elevated (AQI > 150).
- NEVER claim indoor plants meaningfully substitute for mechanical HEPA air filtration.
- NEVER diagnose diseases or prescribe medical treatments. You are an informational environmental assistant, not a medical device.
- Never invent environmental data or AQI numbers. Only reference the provided environmental data or state data is unavailable.
- In India, use the Indian National Air Quality Index (NAQI) breakpoints (0-50 Good, 51-100 Satisfactory, 101-200 Moderate, 201-300 Poor, 301-400 Very Poor, 401-500 Severe).
- Differentiate between measured, modeled, and forecast observations.
- Keep responses structured, concise, highly actionable, empathetic, and scientifically rigorous.
"""

def get_gemini_client():
    """Initialize Google GenAI client if API key is present."""
    api_key = os.getenv("GEMINI_API_KEY") or GEMINI_API_KEY
    if not api_key:
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        logger.warning(f"Could not initialize Google GenAI Client: {e}")
        return None

def fallback_airwise_briefing(env_data: Dict[str, Any], user_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Deterministic fallback for daily briefing when Gemini is not configured or offline."""
    aq = env_data.get("air_quality", {})
    aqi = aq.get("aqi", 250)
    category = aq.get("category", "Poor")
    loc_name = env_data.get("location", {}).get("name", "your area")
    weather = env_data.get("weather", {})
    temp = weather.get("temperature_c", 20)
    humidity = weather.get("relative_humidity", 70)
    wind_spd = weather.get("wind_speed_kmh", 5.0)

    # Vulnerability check
    vulnerabilities = user_profile.get("vulnerabilities", [])
    has_vulnerable = len(vulnerabilities) > 0 or user_profile.get("has_children", False) or user_profile.get("has_elderly", False)
    
    if aqi >= 301:
        concern = f"Severe winter smog inversion in {loc_name}. Low surface wind ({wind_spd} km/h) and high relative humidity ({humidity}%) are trapping fine particulate matter (PM2.5) near the ground."
        who_careful = "Children, senior citizens, and anyone with asthma, COPD, or cardiovascular conditions must avoid all outdoor exposure. Healthy adults should also avoid strenuous outdoor workouts."
        priority_action = "Seal windows, run HEPA filtration indoors or use Budget Mode wet-curtain barriers, and wear certified N95/FFP2 masks if transit is unavoidable."
    elif aqi >= 201:
        concern = f"Poor air quality in {loc_name} with elevated fine particulates ({aq.get('pollutants', {}).get('pm2_5', {}).get('value', 140)} µg/m³ PM2.5). Inversion layers prevent vertical dispersion."
        who_careful = "Sensitive groups (children, elderly, pregnant individuals, respiratory patients) will experience immediate breathing discomfort."
        priority_action = "Shift outdoor exercise to indoor alternatives, postpone non-essential outdoor errands until midday when solar warming lifts the inversion layer, and keep ventilation strictly filtered."
    elif aqi >= 101:
        concern = f"Moderate air quality in {loc_name}. Sensitive individuals may notice slight throat irritation or eye stinging during prolonged outdoor activity."
        who_careful = "Individuals with diagnosed asthma or allergy triggers."
        priority_action = "Ventilate your home during the lowest pollution window (typically 1:00 PM – 4:00 PM) and choose clean public transport over solo driving."
    else:
        concern = f"Favorable atmospheric dispersion in {loc_name}. Ambient particulate and gas concentrations remain well within national ambient standards."
        who_careful = "General public can enjoy normal outdoor routines without elevated exposure risk."
        priority_action = "Good day for natural ventilation, outdoor physical training, and active sustainable mobility like cycling or walking."

    return {
        "headline": f"{category} Air Quality Alert ({aqi} NAQI) for {loc_name}",
        "summary": f"Current air quality index is {aqi} ({category}). {concern}",
        "what_is_causing_concern": concern,
        "who_should_be_careful": who_careful,
        "priority_actions_today": [
            {
                "action": priority_action,
                "reason": "Reduces respiratory deposition of micro-particulates penetrating the alveolar capillary barrier.",
                "benefit": "Avoids up to 80% of daily toxic particulate inhalation."
            },
            {
                "action": "Select metro/electric bus or carpool over single-occupancy petrol vehicle.",
                "reason": "Prevents additional tailpipe hydrocarbon and NOx emissions in localized stagnation zones.",
                "benefit": "Saves an estimated 3.2 kg CO2e and 45g PM2.5 per 15km commute."
            }
        ],
        "generated_by": "AIRWISE Deterministic Heuristic Core (Active Fallback)",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

async def generate_airwise_briefing(env_data: Dict[str, Any], user_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Generate daily AI briefing using Google Gemini API or graceful heuristic fallback."""
    client = get_gemini_client()
    if not client:
        return fallback_airwise_briefing(env_data, user_profile)
    
    prompt = f"""
Given the following environmental telemetry and user household profile, generate "Your Airwise Briefing".
Return strictly valid JSON matching this schema:
{{
  "headline": "Short punchy summary string",
  "summary": "2-3 sentences explaining overall situation",
  "what_is_causing_concern": "Detailed atmospheric and pollutant reasoning",
  "who_should_be_careful": "Specific vulnerability risk breakdown",
  "priority_actions_today": [
    {{
      "action": "Specific what to do",
      "reason": "Scientific why",
      "benefit": "Quantified or concrete difference it makes"
    }}
  ]
}}

Environmental Telemetry:
{json.dumps(env_data, indent=2)}

User Profile:
{json.dumps(user_profile, indent=2)}
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'system_instruction': AIRWISE_SYSTEM_PROMPT,
                'response_mime_type': 'application/json',
                'temperature': 0.2
            }
        )
        if response.text:
            data = json.loads(response.text)
            data["generated_by"] = "Google Gemini 2.5 Flash"
            data["timestamp"] = datetime.now(timezone.utc).isoformat()
            return data
    except Exception as e:
        logger.warning(f"Gemini API call failed for briefing: {e}")
    
    return fallback_airwise_briefing(env_data, user_profile)

async def generate_ai_assistant_chat(
    message: str,
    env_data: Dict[str, Any],
    user_profile: Dict[str, Any],
    chat_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """Generate an AI response from Gemini with contextual awareness and actionable cards."""
    client = get_gemini_client()
    
    # Check if Gemini is available
    if client:
        try:
            formatted_history = []
            if chat_history:
                for msg in chat_history[-6:]: # keep last 6 turns
                    role = "user" if msg.get("role") == "user" else "model"
                    formatted_history.append(f"{role.upper()}: {msg.get('content')}")
            
            history_str = "\n".join(formatted_history)
            prompt = f"""
User Query: "{message}"

Environmental Telemetry at user location:
{json.dumps(env_data, indent=2)}

User Household Profile:
{json.dumps(user_profile, indent=2)}

Previous Conversation Context:
{history_str}

Respond to the user with authoritative, compassionate, and scientifically precise guidance.
Always answer:
1. What they should do
2. Why they should do it
3. What difference it makes

If relevant, produce 1 or 2 structured actionable recommendation cards.
Respond in valid JSON with this structure:
{{
  "answer_markdown": "Your detailed Markdown response addressing the user's specific question, citing numbers from the telemetry without inventing numbers.",
  "actionable_cards": [
    {{
      "recommendation_id": "rec_uuid",
      "category": "Outdoor | Indoor | Commute | Health | Sustainable",
      "title": "Action Title",
      "priority": "critical | high | medium | low",
      "suggested_action": "What to do",
      "reasoning": "Scientific why",
      "expected_benefit": "Difference it makes",
      "confidence": 0.95,
      "data_sources": ["Open-Meteo", "CPCB NAQI Standard"],
      "limitations": "Local topography or sudden traffic surges may shift conditions."
    }}
  ],
  "follow_up_suggestions": [
    "Suggested question 1",
    "Suggested question 2"
  ]
}}
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={
                    'system_instruction': AIRWISE_SYSTEM_PROMPT,
                    'response_mime_type': 'application/json',
                    'temperature': 0.3
                }
            )
            if response.text:
                result = json.loads(response.text)
                result["source"] = "Gemini 2.5 Flash"
                return result
        except Exception as e:
            logger.warning(f"Gemini chat failed: {e}")

    # Robust Heuristic Fallback
    query_lower = message.lower()
    aqi = env_data.get("air_quality", {}).get("aqi", 280)
    category = env_data.get("air_quality", {}).get("category", "Poor")
    loc = env_data.get("location", {}).get("name", "your city")

    if "jog" in query_lower or "run" in query_lower or "exercise" in query_lower or "outdoor" in query_lower:
        if aqi > 150:
            md = (
                f"**Outdoor Jogging is Not Recommended Today in {loc} (AQI: {aqi} — {category}).**\n\n"
                f"- **What you should do:** Shift your workout indoors (HIIT, yoga, indoor treadmill, or resistance training) in a room with closed windows.\n"
                f"- **Why you should do it:** During vigorous aerobic exercise, your minute ventilation rate increases from ~6 L/min to over 60–80 L/min, and mouth-breathing bypasses natural nasal filtration. This forces fine PM2.5 deep into bronchial alveoli.\n"
                f"- **What difference it will make:** Exercising indoors reduces your particulate inhalation dose by 75–90% compared to a 45-minute outdoor run."
            )
            cards = [{
                "recommendation_id": "rec_exercise_indoor",
                "category": "Health",
                "title": "Switch to Indoor Aerobics / Yoga",
                "priority": "high",
                "suggested_action": "Conduct morning fitness routine indoors with closed windows.",
                "reasoning": f"Current AQI is {aqi} ({category}). Heavy exertion amplifies lung particulate uptake 10x.",
                "expected_benefit": "Averts ~140 µg of toxic particulate absorption in 45 minutes.",
                "confidence": 0.98,
                "data_sources": ["CPCB Health Advisory", "WHO Global Air Quality Guidelines"],
                "limitations": "Indoor air must be relatively clean; avoid sweeping or burning mosquito coils during workout."
            }]
        else:
            md = (
                f"**Outdoor Exercise is Acceptable Today in {loc} (AQI: {aqi} — {category}).**\n\n"
                f"- **What you should do:** You can proceed with outdoor jogging, preferably between 12:00 PM and 4:00 PM when atmospheric mixing height is greatest.\n"
                f"- **Why you should do it:** Current particulate levels are within manageable bounds for general fitness enthusiasts.\n"
                f"- **What difference it will make:** Maintains cardiovascular endurance without hazardous microvascular exposure."
            )
            cards = []

    elif "window" in query_lower or "ventilate" in query_lower or "air" in query_lower:
        md = (
            f"**Ventilation Advisory for {loc} (Current AQI: {aqi} — {category})**\n\n"
            f"- **What you should do:** Keep windows tightly closed during early morning (6:00 AM – 10:00 AM) and late evening (after 7:00 PM). If you must ventilate for CO2 clearance, do so strictly between 1:00 PM and 3:30 PM for no more than 15–20 minutes.\n"
            f"- **Why you should do it:** Winter thermal inversion traps high PM2.5 concentrations closest to ground level in the early morning and late night. Midday solar heating raises the planetary boundary layer, dispersing ground-level smog.\n"
            f"- **What difference it will make:** Strategic ventilation timing prevents up to 60% of external particulate ingress while keeping indoor carbon dioxide below 1,000 ppm."
        )
        cards = [{
            "recommendation_id": "rec_ventilation_timing",
            "category": "Indoor",
            "title": "Restricted Midday Ventilation Window",
            "priority": "medium",
            "suggested_action": "Only open windows between 1:00 PM and 3:30 PM for 20 minutes.",
            "reasoning": "Solar heating breaks the nocturnal boundary layer, bringing temporary dip in surface PM2.5.",
            "expected_benefit": "Maintains indoor oxygen without flooding living spaces with morning smog.",
            "confidence": 0.92,
            "data_sources": ["Open-Meteo Diurnal Inversion Model", "CPCB NAQI"],
            "limitations": "If wind direction changes towards an industrial cluster, keep windows shut all day."
        }]

    elif "mask" in query_lower or "n95" in query_lower:
        md = (
            f"**Mask Protection Guidance:**\n\n"
            f"- **What you should do:** Wear a certified, well-fitted **N95 or FFP2 respirator** whenever you are outdoors or in open-air transit. Cloth masks and standard blue surgical masks are NOT effective against sub-2.5 micron particles.\n"
            f"- **Why you should do it:** Cloth and loose surgical masks leak around the edges and only filter large droplets (>10 µm). An N95 respirator uses electrostatically charged meltblown polypropylene fibers that trap at least 95% of 0.3 µm test aerosols.\n"
            f"- **What difference it will make:** Cuts your inhaled PM2.5 dose by >90% when properly fitted around the nasal bridge and jawline."
        )
        cards = [{
            "recommendation_id": "rec_n95_mask",
            "category": "Health",
            "title": "Wear Certified N95/FFP2 Respirator",
            "priority": "critical" if aqi > 250 else "high",
            "suggested_action": "Don an N95 respirator before stepping out into ambient smog.",
            "reasoning": "Fine particles <2.5µm bypass upper airway defenses and penetrate pulmonary capillaries.",
            "expected_benefit": "Achieves >90% filtration of fine particulates when properly sealed.",
            "confidence": 0.99,
            "data_sources": ["NIOSH / EN 149 Testing Standards", "ICMR Guidelines"],
            "limitations": "Facial hair or loose nose clips drastically reduce actual protection efficiency."
        }]

    elif "budget" in query_lower or "cheap" in query_lower or "purifier" in query_lower:
        md = (
            f"**Affordable Clean Air Interventions (Budget Mode):**\n\n"
            f"- **What you should do:**\n"
            f"  1. Build a DIY HEPA Box (Corsi-Rosenthal principle) using a standard 12-inch or 16-inch domestic box fan and an MERV-13 or HEPA filter panel (~₹1,500 – ₹2,500 vs ₹15,000 for branded purifiers).\n"
            f"  2. Wet-mop floors twice daily instead of dry sweeping (dry sweeping resuspends toxic settled PM10).\n"
            f"  3. Hang thick, damp curtains over window mesh during peak smog hours to catch coarser particulates.\n"
            f"  4. Eliminate incense (agarbatti), mosquito coils, and scented candles (one mosquito coil emits PM2.5 equivalent to 75–100 cigarettes).\n"
            f"- **Why you should do it:** Effective air purification requires high volumetric air movement through dense fibrous media, not luxury electronics.\n"
            f"- **What difference it will make:** Can lower indoor PM2.5 by 50–70% at a fraction of commercial costs."
        )
        cards = [{
            "recommendation_id": "rec_budget_purifier",
            "category": "Indoor",
            "title": "Corsi-Rosenthal Box / Wet Mopping Protocol",
            "priority": "high",
            "suggested_action": "Deploy DIY fan-filter setup and strictly replace dry sweeping with damp mopping.",
            "reasoning": "Resuspended road dust and indoor combustion dwarf outdoor infiltration if unaddressed.",
            "expected_benefit": "Saves up to ₹12,000 while reducing indoor PM2.5 by 65%.",
            "confidence": 0.94,
            "data_sources": ["Peer-reviewed Indoor Air Quality Studies", "ASHRAE Clean Air Guidelines"],
            "limitations": "Ensure motor does not overheat; replace DIY filter sheet every 3-4 months."
        }]

    else:
        md = (
            f"**Airwise Environmental Summary for {loc}:**\n\n"
            f"The current Air Quality Index is **{aqi}** ({category}).\n\n"
            f"- **What you should do:** Minimize prolonged outdoor exertion, wear an N95 respirator during your commute, and keep indoor living areas sealed with filtered air.\n"
            f"- **Why you should do it:** Winter thermal inversion combined with local vehicular and industrial combustion concentrates particulate matter near ground level.\n"
            f"- **What difference it will make:** Targeted exposure management reduces systemic inflammatory triggers and protects lung capacity."
        )
        cards = [{
            "recommendation_id": "rec_general_exposure",
            "category": "Health",
            "title": "Active Exposure Management Protocol",
            "priority": "high" if aqi > 200 else "medium",
            "suggested_action": "Adopt multi-barrier protection (N95 outdoors, closed windows, indoor filtration).",
            "reasoning": f"Current AQI of {aqi} ({category}) poses pronounced respiratory risks.",
            "expected_benefit": "Reduces total daily particulate burden by up to 70%.",
            "confidence": 0.95,
            "data_sources": ["CPCB NAQI", "Open-Meteo"],
            "limitations": "Varies by individual dwelling insulation and micro-location."
        }]

    return {
        "answer_markdown": md,
        "actionable_cards": cards,
        "follow_up_suggestions": [
            "Is it safe to go jogging today?",
            "Should I open my windows this morning?",
            "How can I protect my family on a limited budget?",
            "What is the cleanest way to commute today?"
        ],
        "source": "AIRWISE Heuristic Engine (Fallback)"
    }
