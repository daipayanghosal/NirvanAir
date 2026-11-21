import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or backend dir
env_path = Path(__file__).parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY", "")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")

# Indian National Air Quality Index (NAQI) Breakpoints (PM2.5, PM10, etc.)
# Values in ug/m3 (24-hr average standard)
NAQI_BREAKPOINTS = {
    "pm25": [
        (0, 30, 0, 50, "Good", "#16a34a"),
        (30.1, 60, 51, 100, "Satisfactory", "#84cc16"),
        (60.1, 90, 101, 200, "Moderate", "#eab308"),
        (90.1, 120, 201, 300, "Poor", "#f97316"),
        (120.1, 250, 301, 400, "Very Poor", "#ef4444"),
        (250.1, 500, 401, 500, "Severe", "#7f1d1d"),
    ],
    "pm10": [
        (0, 50, 0, 50, "Good", "#16a34a"),
        (50.1, 100, 51, 100, "Satisfactory", "#84cc16"),
        (100.1, 250, 101, 200, "Moderate", "#eab308"),
        (250.1, 350, 201, 300, "Poor", "#f97316"),
        (350.1, 430, 301, 400, "Very Poor", "#ef4444"),
        (430.1, 600, 401, 500, "Severe", "#7f1d1d"),
    ]
}

# Default Demo / Fallback Station: Durgapur, West Bengal, India
DEFAULT_LOCATION = {
    "name": "Durgapur",
    "state": "West Bengal",
    "country": "India",
    "latitude": 23.5204,
    "longitude": 87.3119,
    "station_name": "Durgapur Municipal Corporation Monitoring Station (CPCB)",
    "station_distance_km": 2.4,
}
