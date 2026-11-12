from services.gemini_service import generate_text_json


LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "te": "Telugu",
    "ta": "Tamil",
    "kn": "Kannada",
    "pa": "Punjabi",
    "gu": "Gujarati",
    "bn": "Bengali",
    "or": "Odia",
    "ml": "Malayalam",
}


async def translate_and_respond(text: str, language_code: str) -> dict:
    """
    Detect input language, understand the query, and respond in the requested language.
    Returns a dict with keys: response, detected_language.
    """
    lang_name = LANGUAGE_NAMES.get(language_code, language_code)

    prompt = f"""You are a helpful agricultural assistant for Indian farmers.
A farmer has asked the following question (it may be in any language):
"{text}"

Respond ONLY with a valid JSON object (no markdown, no code fences) with these exact keys:
{{
  "detected_language": "<language the farmer used>",
  "response": "<your helpful farming advice in {lang_name}>",
  "related_tips": ["tip1", "tip2", "tip3"],
  "follow_up_questions": ["question1", "question2"]
}}

Rules:
- The "response" MUST be in {lang_name}
- Provide practical, actionable farming advice relevant to Indian agriculture
- Keep the response concise but complete
"""
    return await generate_text_json(prompt)


async def detect_language(text: str) -> str:
    """Detect the language of a given text."""
    prompt = f"""Detect the language of the following text and return ONLY the ISO 639-1 two-letter language code (e.g. en, hi, mr, te).
Text: "{text}"
Return only the code, nothing else."""
    from services.gemini_service import generate_text
    result = await generate_text(prompt)
    return result.strip().lower()[:2]
