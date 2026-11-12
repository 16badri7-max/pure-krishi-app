from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import GeminiService

router = APIRouter()
gemini = GeminiService()

class SoilData(BaseModel):
    ph: float
    nitrogen: float  # kg/ha
    phosphorus: float  # kg/ha
    potassium: float  # kg/ha
    location: str
    soil_type: str = "loamy"
    organic_matter: float = 2.0  # percentage

@router.post("/soil-analysis")
async def analyze_soil(data: SoilData):
    """Analyze soil parameters and provide recommendations."""
    prompt = f"""You are a soil scientist and agricultural expert. Analyze this soil report:
- pH: {data.ph}
- Nitrogen (N): {data.nitrogen} kg/ha
- Phosphorus (P): {data.phosphorus} kg/ha  
- Potassium (K): {data.potassium} kg/ha
- Location: {data.location}
- Soil Type: {data.soil_type}
- Organic Matter: {data.organic_matter}%

Provide analysis in JSON:
{{
  "overall_health": "Good/Fair/Poor",
  "health_score": 75,
  "ph_analysis": {{"status": "Optimal/Acidic/Alkaline", "recommendation": "..."}},
  "nutrient_analysis": {{
    "nitrogen": {{"status": "Adequate/Deficient/Excess", "level": "High/Medium/Low", "action": "..."}},
    "phosphorus": {{"status": "...", "level": "...", "action": "..."}},
    "potassium": {{"status": "...", "level": "...", "action": "..."}}
  }},
  "deficiencies": ["deficiency1"],
  "recommended_amendments": [
    {{"amendment": "Neem Cake", "quantity": "200 kg/acre", "timing": "Before sowing", "benefit": "..."}}
  ],
  "suitable_crops": [
    {{"crop": "Tomatoes", "suitability": "Excellent", "expected_yield": "15-20 tonnes/acre"}}
  ],
  "soil_improvement_plan": ["step1", "step2"]
}}"""
    
    return await gemini.generate_text(prompt)

@router.post("/soil-analysis/image")
async def analyze_soil_image():
    return {"message": "Upload soil test report image for analysis"}
