from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import GeminiService

router = APIRouter()
gemini = GeminiService()

SUPPORTED_LANGUAGES = {
    "te": "Telugu", "hi": "Hindi", "en": "English", "kn": "Kannada",
    "ta": "Tamil", "ml": "Malayalam", "mr": "Marathi", "bn": "Bengali",
    "gu": "Gujarati", "pa": "Punjabi", "or": "Odia", "as": "Assamese", "ur": "Urdu"
}

class VoiceQueryRequest(BaseModel):
    text: str
    language: str = "en"  # language code
    context: str = "general farming"

@router.post("/voice-query")
async def process_voice_query(data: VoiceQueryRequest):
    lang_name = SUPPORTED_LANGUAGES.get(data.language, "English")
    
    prompt = f"""You are an expert agricultural advisor for Indian farmers. 
A farmer has asked the following question in {lang_name}:

"{data.text}"

IMPORTANT: 
1. Respond ONLY in {lang_name} language
2. Use simple, easy-to-understand language suitable for farmers
3. Be practical and specific to Indian farming conditions
4. If the question is in a different language, still respond in {lang_name}

Provide your response in JSON:
{{
  "answer": "Your detailed answer in {lang_name}",
  "key_points": ["point 1 in {lang_name}", "point 2"],
  "follow_up_questions": ["suggested follow-up 1", "suggested follow-up 2"],
  "language": "{lang_name}",
  "language_code": "{data.language}"
}}"""
    
    return await gemini.generate_text(prompt)

@router.get("/voice-query/languages")
async def get_supported_languages():
    return {"supported_languages": SUPPORTED_LANGUAGES}
