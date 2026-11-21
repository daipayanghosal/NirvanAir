import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.mark.asyncio
async def test_root_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["app"] == "NirvanAir"
        assert data["status"] == "online"
        assert "Breathe smarter" in data["tagline"]

@pytest.mark.asyncio
async def test_health_check_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_air_quality_demo_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/air-quality?force_demo=true")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["location"]["name"] == "Durgapur"
        assert data["air_quality"]["aqi"] == 285
        assert data["air_quality"]["category"] == "Poor"
        assert "pm2_5" in data["air_quality"]["pollutants"]
        assert "inversion_layer" in data["weather"]

@pytest.mark.asyncio
async def test_locations_search_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/locations/search?q=Delhi")
        assert response.status_code == 200
        data = response.json()
        assert data["query"] == "Delhi"
        assert isinstance(data["results"], list)

@pytest.mark.asyncio
async def test_swaps_list_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/swaps")
        assert response.status_code == 200
        data = response.json()
        assert "swaps" in data
        assert len(data["swaps"]) >= 4
        # Verify first swap structure
        swap = data["swaps"][0]
        assert "id" in swap
        assert "title" in swap
        assert "co2_avoided_kg_month" in swap
        assert "pm25_avoided_g_month" in swap

@pytest.mark.asyncio
async def test_swaps_impact_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "swap_ids": ["swap_commute_car_to_metro", "swap_generator_to_solar_battery"],
            "days": 30
        }
        response = await client.post("/api/swaps/impact", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["co2_saved_kg"] > 0
        assert data["pm25_soot_prevented_grams"] > 0
        assert data["cost_savings_inr"] > 0
        assert data["tree_year_equivalent"] > 0

@pytest.mark.asyncio
async def test_simulator_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "num_households": 250,
            "vehicle_reduction_percent": 25.0,
            "diesel_genset_reduction_percent": 30.0,
            "waste_composting_percent": 40.0,
            "energy_conservation_percent": 15.0
        }
        response = await client.post("/api/simulator", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["num_households"] == 250
        assert data["avoided_vehicle_km_monthly"] > 0
        assert data["fuel_saved_liters_monthly"] > 0
        assert data["co2_avoided_kg_monthly"] > 0
        assert data["pm25_soot_avoided_kg_monthly"] > 0
        assert "methodology_notes" in data

@pytest.mark.asyncio
async def test_indoor_doctor_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/indoor-doctor?aqi=285&mode=budget")
        assert response.status_code == 200
        data = response.json()
        assert data["mode"] == "budget"
        assert data["current_aqi"] == 285
        assert "checklist" in data
        assert len(data["checklist"]) > 0
        assert "scientific_plant_fact" in data["protocols"]
        assert "Corsi-Rosenthal" in data["protocols"]["budget_mode_highlights"][0]

@pytest.mark.asyncio
async def test_planner_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Fetch demo env data first
        demo_res = await client.get("/api/air-quality?force_demo=true")
        env_data = demo_res.json()

        payload = {
            "env_data": env_data,
            "user_profile": {
                "location_name": "Durgapur",
                "household_size": 4,
                "has_children": True,
                "has_elderly": True,
                "vulnerabilities": ["Asthma / Bronchial Sensitivity"]
            }
        }
        response = await client.post("/api/planner", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "timeline" in data
        assert len(data["timeline"]) == 7
        assert any("Workout" in s["segment"] or "Fitness" in s["segment"] for s in data["timeline"])

@pytest.mark.asyncio
async def test_briefing_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        demo_res = await client.get("/api/air-quality?force_demo=true")
        env_data = demo_res.json()

        payload = {
            "env_data": env_data,
            "user_profile": {
                "location_name": "Durgapur",
                "has_children": True,
                "has_elderly": True
            }
        }
        response = await client.post("/api/briefing", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "headline" in data
        assert "summary" in data
        assert "what_is_causing_concern" in data
        assert "who_should_be_careful" in data
        assert "priority_actions_today" in data

@pytest.mark.asyncio
async def test_chat_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "message": "Is it safe to go jogging today?",
            "user_profile": {
                "location_name": "Durgapur",
                "vulnerabilities": ["Asthma"]
            }
        }
        response = await client.post("/api/chat", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "answer_markdown" in data or "content" in data
        assert "actionable_cards" in data
        assert len(data["actionable_cards"]) > 0
        card = data["actionable_cards"][0]
        assert "suggested_action" in card
        assert "reasoning" in card
        assert "expected_benefit" in card
