from typing import Dict, Any, List

# Catalogs of scientifically grounded sustainable swaps with emission factors & financial calculations
SUSTAINABLE_SWAPS_CATALOG = [
    {
        "id": "swap_commute_car_to_metro",
        "category": "Mobility & Transport",
        "title": "Private Petrol Car → Metro / Electric Bus",
        "existing_activity": "Driving a solo petrol car for a 15 km daily commute each way (30 km round trip).",
        "proposed_alternative": "Commute via Rapid Metro transit or municipal Electric Bus network.",
        "environmental_benefit": {
            "co2_saved_kg_per_day": 5.4,
            "pm25_avoided_g_per_day": 38.0,
            "fuel_saved_litres_per_day": 2.5,
            "annual_co2_saved_kg": 1350.0
        },
        "financial_implications": {
            "daily_savings_inr": 210,
            "monthly_savings_inr": 5250,
            "annual_savings_inr": 63000,
            "cost_notes": "Based on petrol @ ₹104/L (12 km/L efficiency) + parking vs ₹50 roundtrip metro fare."
        },
        "difficulty": "Moderate",
        "calculation_explanation": "Petrol combustion generates ~2.31 kg CO2/L. A 30 km trip consumes 2.5 L petrol (5.77 kg CO2). Metro grid electricity in India emits ~0.37 kg CO2 for equivalent passenger-km. Net saving = 5.4 kg CO2e/day + 38g PM2.5 from tailpipe and brake pads."
    },
    {
        "id": "swap_two_wheeler_to_cycling",
        "category": "Mobility & Transport",
        "title": "Petrol Two-Wheeler → Cycling / Walking for Short Trips",
        "existing_activity": "Using a petrol scooter or motorbike for short 3–4 km neighborhood market runs.",
        "proposed_alternative": "Walk or cycle for trips under 4 km.",
        "environmental_benefit": {
            "co2_saved_kg_per_day": 0.85,
            "pm25_avoided_g_per_day": 9.5,
            "fuel_saved_litres_per_day": 0.35,
            "annual_co2_saved_kg": 255.0
        },
        "financial_implications": {
            "daily_savings_inr": 36,
            "monthly_savings_inr": 900,
            "annual_savings_inr": 10800,
            "cost_notes": "Immediate fuel savings with zero maintenance overhead; improves cardiovascular fitness."
        },
        "difficulty": "Easy",
        "calculation_explanation": "Short cold-engine two-wheeler trips run rich fuel mixtures emitting up to 3x higher hydrocarbons and particulate matter per km than warm highway travel."
    },
    {
        "id": "swap_diesel_generator_to_inverter",
        "category": "Power & Energy",
        "title": "Diesel Genset → Lithium/Tubular Battery Inverter & Rooftop Solar",
        "existing_activity": "Running a 5 kVA diesel generator during power cuts (averaging 2 hours daily in winter).",
        "proposed_alternative": "Transition to a high-efficiency pure sine wave tubular battery inverter or hybrid solar system.",
        "environmental_benefit": {
            "co2_saved_kg_per_day": 5.8,
            "pm25_avoided_g_per_day": 62.0,
            "fuel_saved_litres_per_day": 2.2,
            "annual_co2_saved_kg": 1740.0
        },
        "financial_implications": {
            "daily_savings_inr": 150,
            "monthly_savings_inr": 4500,
            "annual_savings_inr": 54000,
            "cost_notes": "Diesel generator cost is ~₹32/kWh vs grid battery recharge cost of ~₹8/kWh. Initial inverter capital pays back in 14 months."
        },
        "difficulty": "High",
        "calculation_explanation": "Stationary small diesel engines lack SCR/DPF emissions scrubbers, emitting black carbon soot (PM2.5) directly at rooftop height into neighborhood air."
    },
    {
        "id": "swap_open_waste_burning_to_compost",
        "category": "Waste & Air Protection",
        "title": "Open Leaf & Garden Waste Burning → Community Composting",
        "existing_activity": "Raking dry leaves, garden waste, and cardboard and burning them in street piles in the evening.",
        "proposed_alternative": "Deposit in a decentralized aerobic leaf composter or mulch around tree bases.",
        "environmental_benefit": {
            "co2_saved_kg_per_day": 12.0,
            "pm25_avoided_g_per_day": 145.0,
            "fuel_saved_litres_per_day": 0.0,
            "annual_co2_saved_kg": 2400.0
        },
        "financial_implications": {
            "daily_savings_inr": 25,
            "monthly_savings_inr": 750,
            "annual_savings_inr": 9000,
            "cost_notes": "Produces rich organic humic fertilizer worth ₹15/kg for home plants while eliminating municipal burning penalties."
        },
        "difficulty": "Easy",
        "calculation_explanation": "Smoldering open biomass burns at low temperatures (<400°C) with incomplete combustion, generating toxic polycyclic aromatic hydrocarbons (PAHs) and heavy PM2.5."
    },
    {
        "id": "swap_mosquito_coil_to_liquid_vaporizer",
        "category": "Indoor Health",
        "title": "Burning Mosquito Coils → Sealed Mechanical Screen / Liquid Electric Repeller",
        "existing_activity": "Burning 1-2 smoldering mosquito coils every night in bedrooms or living areas.",
        "proposed_alternative": "Install window magnetic mesh screens and use low-emission liquid electric vaporizers or ultrasonic repellents.",
        "environmental_benefit": {
            "co2_saved_kg_per_day": 0.2,
            "pm25_avoided_g_per_day": 55.0, # massive indoor PM2.5 reduction
            "fuel_saved_litres_per_day": 0.0,
            "annual_co2_saved_kg": 60.0
        },
        "financial_implications": {
            "daily_savings_inr": 4,
            "monthly_savings_inr": 120,
            "annual_savings_inr": 1440,
            "cost_notes": "Eliminates coil costs (₹5/night); window mesh is a one-time ₹800 install lasting 5+ years."
        },
        "difficulty": "Easy",
        "calculation_explanation": "A single mosquito coil releases PM2.5 equivalent to smoking 75–100 cigarettes and significant quantities of formaldehyde inside enclosed rooms."
    },
    {
        "id": "swap_single_use_bags_to_cloth",
        "category": "Material & Plastics",
        "title": "Single-Use Plastic Bags → Organic Canvas & Jute Totes",
        "existing_activity": "Taking 3–4 thin poly bags from vegetable vendors and grocery stores on each market visit.",
        "proposed_alternative": "Carry a compact, washable cotton/jute tote bag in your vehicle or backpack.",
        "environmental_benefit": {
            "co2_saved_kg_per_day": 0.15,
            "pm25_avoided_g_per_day": 3.0,
            "fuel_saved_litres_per_day": 0.0,
            "annual_co2_saved_kg": 45.0
        },
        "financial_implications": {
            "daily_savings_inr": 10,
            "monthly_savings_inr": 150,
            "annual_savings_inr": 1800,
            "cost_notes": "Avoids vendor carry-bag charges (₹3–5 per bag in modern supermarkets)."
        },
        "difficulty": "Easy",
        "calculation_explanation": "Plastic bags clog municipal storm drains, leading to stagnant sewage pools and frequent open incineration in roadside garbage bins."
    }
]

def get_all_swaps() -> List[Dict[str, Any]]:
    return SUSTAINABLE_SWAPS_CATALOG

def calculate_swap_impact(swap_ids: List[str], days: int = 30) -> Dict[str, Any]:
    """Calculate aggregate cumulative savings for a list of recorded swaps."""
    total_co2 = 0.0
    total_pm25 = 0.0
    total_fuel = 0.0
    total_inr = 0.0

    selected_swaps = [s for s in SUSTAINABLE_SWAPS_CATALOG if s["id"] in swap_ids]
    for s in selected_swaps:
        b = s["environmental_benefit"]
        f = s["financial_implications"]
        total_co2 += b.get("co2_saved_kg_per_day", 0.0) * days
        total_pm25 += b.get("pm25_avoided_g_per_day", 0.0) * days
        total_fuel += b.get("fuel_saved_litres_per_day", 0.0) * days
        total_inr += f.get("daily_savings_inr", 0.0) * days

    return {
        "swaps_count": len(selected_swaps),
        "days_tracked": days,
        "total_co2_saved_kg": round(total_co2, 2),
        "total_pm25_avoided_grams": round(total_pm25, 1),
        "total_fuel_saved_litres": round(total_fuel, 1),
        "total_financial_savings_inr": int(round(total_inr)),
        "trees_equivalent": round(total_co2 / 21.7, 1), # 1 mature tree absorbs ~21.7 kg CO2/year
        "clean_air_breathing_days": round(total_pm25 / 15.0, 1) # based on avoiding 15g particulate burden
    }
