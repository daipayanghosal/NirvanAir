from typing import Dict, Any

def run_community_scenario(
    num_households: int = 100,
    vehicle_reduction_percent: float = 20.0,
    diesel_genset_reduction_percent: float = 30.0,
    waste_composting_percent: float = 25.0,
    energy_conservation_percent: float = 15.0
) -> Dict[str, Any]:
    """
    Simulate theoretical neighborhood-scale emission reductions across a 30-day period.
    
    Scientifically transparent emission factors (CPCB / ARAI / IPCC):
    - Average urban household vehicle travel: 25 km/day per household
    - Fuel economy: ~12 km/L petrol/diesel equivalent
    - CO2 emission factor: 2.31 kg CO2 / L fuel
    - Tailpipe & road dust PM2.5: ~1.2 g PM2.5 / km
    - Tailpipe NOx: ~0.8 g NOx / km
    - Small diesel genset (5 kVA): 1.1 L diesel/hr, emits ~28 g PM2.5/hr, ~2.68 kg CO2/hr
    - Household solid waste: 1.8 kg/day/household; 40% organic leaf/kitchen waste
    - Open smoldering waste: emits ~12 g PM2.5/kg burned, ~1.1 kg CO2/kg
    - Household electricity: 12 kWh/day; Indian CEA grid emission factor: 0.71 kg CO2/kWh
    """
    days = 30
    
    # 1. Transport Reductions
    daily_km_baseline_per_hh = 25.0
    active_households_transport = num_households
    daily_km_avoided = (active_households_transport * daily_km_baseline_per_hh) * (vehicle_reduction_percent / 100.0)
    monthly_km_avoided = daily_km_avoided * days
    
    monthly_fuel_saved_litres = monthly_km_avoided / 12.0
    monthly_co2_transport_kg = monthly_fuel_saved_litres * 2.31
    monthly_pm25_transport_kg = (monthly_km_avoided * 1.2) / 1000.0 # grams to kg
    monthly_nox_transport_kg = (monthly_km_avoided * 0.8) / 1000.0
    
    # 2. Diesel Generator Reductions
    # Assume 25% of households experience power backup usage (1 hr/day avg)
    genset_hh = num_households * 0.25
    genset_hours_avoided = (genset_hh * 1.0 * (diesel_genset_reduction_percent / 100.0)) * days
    monthly_diesel_genset_litres = genset_hours_avoided * 1.1
    monthly_co2_genset_kg = monthly_diesel_genset_litres * 2.68
    monthly_pm25_genset_kg = (genset_hours_avoided * 28.0) / 1000.0
    
    # 3. Waste Burning Prevention
    # Assume 15% of households previously had dry leaves or sweepings burned in lane
    waste_burn_hh = num_households * 0.15
    waste_diverted_kg = (waste_burn_hh * 0.7 * (waste_composting_percent / 100.0)) * days
    monthly_pm25_waste_kg = (waste_diverted_kg * 12.0) / 1000.0
    monthly_co2_waste_kg = waste_diverted_kg * 1.1
    
    # 4. Energy Conservation
    monthly_kwh_saved = (num_households * 12.0 * (energy_conservation_percent / 100.0)) * days
    monthly_co2_energy_kg = monthly_kwh_saved * 0.71
    
    # Cumulative Totals
    total_co2_reduced_kg = round(monthly_co2_transport_kg + monthly_co2_genset_kg + monthly_co2_waste_kg + monthly_co2_energy_kg, 1)
    total_pm25_reduced_kg = round(monthly_pm25_transport_kg + monthly_pm25_genset_kg + monthly_pm25_waste_kg, 2)
    total_fuel_saved_litres = round(monthly_fuel_saved_litres + monthly_diesel_genset_litres, 1)
    
    # Financial aggregate estimate (petrol @ 104, diesel @ 92, electricity @ 7.50)
    fuel_savings_inr = (monthly_fuel_saved_litres * 104.0) + (monthly_diesel_genset_litres * 92.0)
    power_savings_inr = monthly_kwh_saved * 7.50
    total_community_savings_inr = int(round(fuel_savings_inr + power_savings_inr))
    
    return {
        "parameters": {
            "num_households": num_households,
            "vehicle_reduction_percent": vehicle_reduction_percent,
            "diesel_genset_reduction_percent": diesel_genset_reduction_percent,
            "waste_composting_percent": waste_composting_percent,
            "energy_conservation_percent": energy_conservation_percent,
            "timeframe_days": days
        },
        "results": {
            "vehicle_km_avoided": int(round(monthly_km_avoided)),
            "fuel_saved_litres": total_fuel_saved_litres,
            "co2_avoided_kg": total_co2_reduced_kg,
            "pm25_emissions_prevented_kg": total_pm25_reduced_kg,
            "nox_emissions_prevented_kg": round(monthly_nox_transport_kg, 2),
            "clean_air_equivalent_tree_years": round(total_co2_reduced_kg / 21.7, 1),
            "estimated_community_savings_inr": total_community_savings_inr
        },
        "scientific_integrity_disclaimer": (
            "THEORETICAL EMISSION PROJECTION ONLY: These metrics represent localized mass emission reductions "
            "(tailpipe, engine, and smoldering soot prevented from entering the airshed). Ambient AQI is heavily "
            "governed by regional meteorological factors, thermal inversions, boundary layer height, and transboundary "
            "drift. Consequently, individual or neighborhood actions reduce local ground-level toxic exposure without "
            "implying an immediate, linear drop in city-wide station AQI numbers."
        )
    }
