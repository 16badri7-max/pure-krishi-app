from fastapi import APIRouter, UploadFile, File, HTTPException
from services.gemini_service import GeminiService
import base64

router = APIRouter()
gemini = GeminiService()

@router.post("/crop-disease")
async def detect_crop_disease(file: UploadFile = File(...)):
    """Analyze crop image for diseases and pests using Gemini Vision."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_data = await file.read()
    image_b64 = base64.b64encode(image_data).decode()
    
    prompt = """You are an expert agricultural pathologist. Analyze this crop image and provide:
1. Disease/pest name (if detected)
2. Confidence level (High/Medium/Low)
3. Visible symptoms
4. Possible causes
5. Treatment recommendations (organic and chemical options)
6. Preventive measures

Respond in JSON format:
{
  "disease_detected": true/false,
  "disease_name": "...",
  "confidence": "High/Medium/Low",
  "symptoms": ["symptom1", "symptom2"],
  "causes": ["cause1", "cause2"],
  "recommendations": {
    "organic": ["treatment1", "treatment2"],
    "chemical": ["treatment1", "treatment2"]
  },
  "preventive_measures": ["measure1", "measure2"],
  "urgency": "Immediate/Monitor/Low"
}"""
    
    result = await gemini.analyze_image(image_b64, file.content_type, prompt)
    return result

@router.get("/crop-disease/info/{disease_name}")
async def get_disease_info(disease_name: str):
    """Get detailed information about a specific crop disease."""
    prompt = f"""Provide comprehensive information about "{disease_name}" crop disease in JSON format:
{{
  "disease_name": "...",
  "affected_crops": ["crop1", "crop2"],
  "causal_organism": "...",
  "spread_mechanism": "...",
  "symptoms": ["symptom1", "symptom2"],
  "management": {{
    "cultural": ["practice1"],
    "biological": ["agent1"],
    "chemical": ["pesticide1"]
  }}
}}"""
    result = await gemini.generate_text(prompt)
    return result
