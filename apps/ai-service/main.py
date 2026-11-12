import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import crop_disease, weather, soil_analysis, crop_recommendation, market_prices, yield_predictor, voice_assistant

app = FastAPI(
    title="Pure Krishi AI Service",
    description="AI-powered agricultural intelligence API for Pure Krishi",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crop_disease.router, prefix="/api/ai", tags=["Crop Disease"])
app.include_router(weather.router, prefix="/api/ai", tags=["Weather"])
app.include_router(soil_analysis.router, prefix="/api/ai", tags=["Soil Analysis"])
app.include_router(crop_recommendation.router, prefix="/api/ai", tags=["Crop Recommendation"])
app.include_router(market_prices.router, prefix="/api/ai", tags=["Market Prices"])
app.include_router(yield_predictor.router, prefix="/api/ai", tags=["Yield Predictor"])
app.include_router(voice_assistant.router, prefix="/api/ai", tags=["Voice Assistant"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Pure Krishi AI Service", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
