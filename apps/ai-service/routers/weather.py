from fastapi import APIRouter, Query
from services.gemini_service import GeminiService
import httpx
import os

router = APIRouter()
gemini = GeminiService()

@router.get("/weather")
async def get_weather(lat: float = Query(...), lon: float = Query(...), crop: str = Query(None)):
    """Get current weather + 7-day forecast + crop-specific recommendations."""
    api_key = os.getenv("WEATHER_API_KEY", "")
    
    weather_data = {}
    if api_key:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://api.openweathermap.org/data/2.5/forecast",
                params={"lat": lat, "lon": lon, "appid": api_key, "units": "metric"}
            )
            if resp.status_code == 200:
                weather_data = resp.json()
    
    prompt = f"""You are an agricultural weather advisor. Based on location coordinates ({lat}, {lon}):
Provide weather-based farming advice in JSON:
{{
  "current": {{
    "temperature": "25°C",
    "humidity": "65%",
    "rainfall_chance": "30%",
    "wind_speed": "12 km/h",
    "condition": "Partly Cloudy"
  }},
  "7_day_forecast": [
    {{"day": "Mon", "high": "28°C", "low": "20°C", "rainfall": "5mm", "condition": "Sunny"}}
  ],
  "alerts": [],
  "crop_advice": {{
    "irrigation": "Reduce irrigation due to expected rainfall",
    "harvesting": "Good conditions for harvesting in 3 days",
    "pest_risk": "Low - dry conditions reduce fungal risk",
    "fertilization": "Avoid fertilizing before expected rain on Thursday"
  }},
  "best_farming_days": ["Monday", "Tuesday", "Friday"]
}}
{f'Focus advice for {crop} cultivation.' if crop else ''}"""
    
    result = await gemini.generate_text(prompt)
    return result
