from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import GeminiService

router = APIRouter()
gemini = GeminiService()

class CropRecommendationRequest(BaseModel):
    soil_type: str
    location: str
    season: str  # Kharif/Rabi/Zaid
    water_availability: str  # High/Medium/Low
    farm_size_acres: float
    budget_per_acre: float = 20000

@router.post("/crop-recommendation")
async def recommend_crops(data: CropRecommendationRequest):
    prompt = f"""You are an expert agronomist in India. Recommend the best crops for:
- Soil Type: {data.soil_type}
- Location: {data.location}
- Season: {data.season}
- Water Availability: {data.water_availability}
- Farm Size: {data.farm_size_acres} acres
- Budget: ₹{data.budget_per_acre}/acre

Provide top 5 crop recommendations in JSON:
{{
  "recommendations": [
    {{
      "rank": 1,
      "crop": "Tomatoes",
      "variety": "Heirloom / Cherry",
      "suitability_score": 95,
      "sowing_period": "June-July",
      "harvest_period": "September-October",
      "duration_days": 90,
      "water_requirement": "Medium - 500mm",
      "cost_per_acre": {{
        "seeds": 2000,
        "fertilizers": 5000,
        "labor": 8000,
        "pesticides": 2000,
        "total": 17000
      }},
      "expected_yield": "15-20 tonnes/acre",
      "market_price_range": "₹20-60/kg",
      "expected_income": "₹3-6 lakhs/acre",
      "profit_potential": "High",
      "key_benefits": ["High demand", "Good price"],
      "risks": ["Price volatility", "Disease susceptibility"],
      "tips": ["Use drip irrigation", "Stake plants properly"]
    }}
  ],
  "general_advice": "...",
  "market_outlook": "..."
}}"""
    
    return await gemini.generate_text(prompt)
