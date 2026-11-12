import os
import json
import google.generativeai as genai
from typing import Optional

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY", "")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
            self.vision_model = genai.GenerativeModel("gemini-1.5-flash")
        else:
            self.model = None
            self.vision_model = None

    async def generate_text(self, prompt: str) -> dict:
        if not self.model:
            return {"error": "GEMINI_API_KEY not configured. Please set it in .env file.", "configured": False}
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            # Try to parse as JSON
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            try:
                return json.loads(text.strip())
            except json.JSONDecodeError:
                return {"result": text, "raw": True}
        except Exception as e:
            return {"error": str(e)}

    async def analyze_image(self, image_b64: str, mime_type: str, prompt: str) -> dict:
        if not self.vision_model:
            return {"error": "GEMINI_API_KEY not configured.", "configured": False}
        try:
            import PIL.Image
            import io
            import base64
            image_bytes = base64.b64decode(image_b64)
            image = PIL.Image.open(io.BytesIO(image_bytes))
            response = self.vision_model.generate_content([prompt, image])
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            try:
                return json.loads(text.strip())
            except json.JSONDecodeError:
                return {"result": text}
        except Exception as e:
            return {"error": str(e)}
