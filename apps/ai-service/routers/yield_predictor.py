from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import GeminiService

router = APIRouter()
gemini = GeminiService()

class YieldPredictionRequest(BaseModel):
    crop: str
    variety: str = ""
    farm_size_acres: float
    soil_quality: str  # Excellent/Good/Fair/Poor
    rainfall_mm: float = 500
    irrigation: str = "Drip"  # Drip/Flood/Rainfed
    fertilizer_used: str = "Organic"
    location: str
    sowing_date: str = ""

@router.post("/yield-prediction")
async def predict_yield(data: YieldPredictionRequest):
    prompt = f"""You are an agricultural data scientist specializing in crop yield prediction for Indian farms.
    
Predict yield for:
- Crop: {data.crop} {f'({data.variety})' if data.variety else ''}
- Farm Size: {data.farm_size_acres} acres
- Soil Quality: {data.soil_quality}
- Rainfall: {data.rainfall_mm} mm
- Irrigation: {data.irrigation}
- Fertilizer: {data.fertilizer_used}
- Location: {data.location}

Return prediction in JSON:
{{
  "prediction": {{
    "minimum_yield": "8 tonnes",
    "expected_yield": "12 tonnes", 
    "maximum_yield": "16 tonnes",
    "yield_per_acre": "4 tonnes/acre",
    "confidence": "Medium",
    "confidence_score": 72
  }},
  "harvest_timeline": {{
    "estimated_harvest_date": "2025-10-15",
    "days_to_harvest": 95,
    "harvest_window": "10-14 days"
  }},
  "limiting_factors": ["Soil quality could be improved", "Irrigation consistency"],
  "optimization_tips": [
    "Apply potassium fertilizer at flowering stage to improve fruit size",
    "Maintain consistent soil moisture for uniform growth"
  ],
  "disclaimer": "This is an AI estimate based on typical conditions. Actual yield may vary by ±20% based on microclimate, pest pressure, and farm management practices.",
  "comparable_farms": {{
    "region_average": "10 tonnes",
    "top_10_percent": "18 tonnes",
    "your_estimate_percentile": "65th percentile"
  }}
}}"""
    
    return await gemini.generate_text(prompt)
