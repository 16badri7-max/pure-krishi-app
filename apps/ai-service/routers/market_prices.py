from fastapi import APIRouter, Query
from services.gemini_service import GeminiService
from datetime import datetime

router = APIRouter()
gemini = GeminiService()

@router.get("/market-prices")
async def get_market_prices(crop: str = Query(...), location: str = Query("India")):
    prompt = f"""You are an agricultural market analyst for India. Provide current market price intelligence for {crop} in {location}.

Return in JSON format:
{{
  "crop": "{crop}",
  "location": "{location}",
  "date": "{datetime.now().strftime('%Y-%m-%d')}",
  "current_prices": {{
    "mandi_price": "₹25-35/kg",
    "retail_price": "₹45-60/kg",
    "online_price": "₹50-70/kg",
    "export_price": "₹40-55/kg"
  }},
  "price_trend": "Rising/Falling/Stable",
  "trend_percentage": "+12% vs last month",
  "major_mandis": [
    {{"mandi": "Nashik APMC", "price": "₹28/kg", "arrivals": "1200 tonnes", "trend": "Up"}},
    {{"mandi": "Lasalgaon", "price": "₹26/kg", "arrivals": "800 tonnes", "trend": "Stable"}}
  ],
  "demand_supply": {{
    "demand": "High",
    "supply": "Moderate",
    "shortage": false,
    "outlook": "Prices expected to remain firm for next 2 weeks"
  }},
  "best_time_to_sell": "Next 7-10 days",
  "selling_tips": [
    "Grade your produce before selling",
    "Consider direct supermarket selling for 20% premium"
  ],
  "historical_prices": [
    {{"month": "Jan", "price": 22}},
    {{"month": "Feb", "price": 25}},
    {{"month": "Mar", "price": 30}}
  ],
  "pure_krishi_demand": {{
    "active_requirements": 3,
    "buyers": ["Nature's Basket", "Reliance Fresh"],
    "offered_price": "₹35/kg",
    "advantage": "10-20% premium over mandi"
  }}
}}"""
    
    return await gemini.generate_text(prompt)
