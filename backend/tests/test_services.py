import pytest
from backend.services.air_quality import (
    get_naqi_category,
    get_demo_durgapur_data,
    calculate_diurnal_hourly_forecast
)
from backend.services.swap_engine import (
    get_all_swaps,
    calculate_swap_impact
)
from backend.services.simulator_engine import run_community_scenario
from backend.services.planner_engine import generate_daily_plan
from backend.services.gemini_service import fallback_nirvanair_briefing

def test_naqi_category_classification():
    assert get_naqi_category(35)["category"] == "Good"
    assert get_naqi_category(85)["category"] == "Satisfactory"
    assert get_naqi_category(150)["category"] == "Moderate"
    assert get_naqi_category(285)["category"] == "Poor"
    assert get_naqi_category(350)["category"] == "Very Poor"
    assert get_naqi_category(450)["category"] == "Severe"

def test_diurnal_hourly_forecast():
    forecast = calculate_diurnal_hourly_forecast(base_aqi=285)
    assert len(forecast) == 24
    # Morning peak (07:00 or 08:00) should be higher than midday solar trough (14:00)
    morning_aqi = forecast[7]["aqi"]
    midday_aqi = forecast[14]["aqi"]
    assert morning_aqi > midday_aqi, "Morning thermal inversion should have higher AQI than solar midday"

def test_demo_durgapur_data_integrity():
    data = get_demo_durgapur_data()
    assert data["status"] == "success"
    assert data["location"]["name"] == "Durgapur"
    assert data["air_quality"]["aqi"] == 285
    assert data["air_quality"]["dominant_pollutant"] in ["PM2.5", "pm2_5"]
    assert len(data["air_quality"]["hourly_trend_24h"]) >= 12
    assert data["weather"]["inversion_layer"]["present"] is True

def test_swap_engine_catalog_and_impact():
    swaps = get_all_swaps()
    assert len(swaps) >= 4
    
    ids = [s["id"] for s in swaps]
    assert "swap_commute_car_to_metro" in ids
    assert "swap_diesel_generator_to_inverter" in ids
    
    impact = calculate_swap_impact(["swap_commute_car_to_metro"], days=30)
    assert impact["co2_saved_kg"] > 0
    assert impact["cost_savings_inr"] > 0
    assert impact["pm25_soot_prevented_grams"] > 0
    assert impact["tree_year_equivalent"] > 0

def test_simulator_engine_scaling():
    sim100 = run_community_scenario(100, 20.0, 30.0, 25.0, 15.0)
    sim500 = run_community_scenario(500, 20.0, 30.0, 25.0, 15.0)
    
    # 500 households should yield approximately 5x savings of 100 households
    assert abs(sim500["co2_avoided_kg_monthly"] - (sim100["co2_avoided_kg_monthly"] * 5)) < 1.0
    assert abs(sim500["fuel_saved_liters_monthly"] - (sim100["fuel_saved_liters_monthly"] * 5)) < 1.0

def test_planner_engine_adaptive_scheduling():
    env_data = get_demo_durgapur_data()
    user_profile = {
        "location_name": "Durgapur",
        "has_children": True,
        "has_elderly": True,
        "vulnerabilities": ["Asthma / Bronchial Sensitivity"]
    }
    timeline = generate_daily_plan(env_data, user_profile)
    assert len(timeline) == 7
    
    # Workout segment should warn against outdoor morning exertion during 285 NAQI
    workout_seg = next((s for s in timeline if "Workout" in s["segment"] or "Fitness" in s["segment"]), None)
    assert workout_seg is not None
    assert "indoor" in workout_seg["suggested_action"].lower() or "indoor" in workout_seg["reasoning"].lower()
    assert workout_seg["alternative_if_impractical"] != ""

def test_fallback_nirvanair_briefing():
    env_data = get_demo_durgapur_data()
    user_profile = {"has_children": True, "has_elderly": True}
    briefing = fallback_nirvanair_briefing(env_data, user_profile)
    assert briefing["headline"] != ""
    assert briefing["summary"] != ""
    assert len(briefing["priority_actions_today"]) >= 3
    assert "Durgapur" in briefing["summary"]
