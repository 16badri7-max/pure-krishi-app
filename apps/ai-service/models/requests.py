from pydantic import BaseModel, Field
from typing import Optional


class SoilAnalysisRequest(BaseModel):
    ph: float = Field(..., ge=0, le=14, description="Soil pH level")
    nitrogen: float = Field(..., ge=0, description="Nitrogen content (kg/ha)")
    phosphorus: float = Field(..., ge=0, description="Phosphorus content (kg/ha)")
    potassium: float = Field(..., ge=0, description="Potassium content (kg/ha)")
    location: str = Field(..., description="Farm location / region")


class CropRecommendationRequest(BaseModel):
    soil_type: str = Field(..., description="Type of soil (e.g. loamy, clay, sandy)")
    location: str = Field(..., description="Geographic location / state")
    season: str = Field(..., description="Growing season (kharif, rabi, zaid)")
    water_availability: str = Field(..., description="Water source (rainfed, irrigated, semi-irrigated)")
    farm_size: float = Field(..., gt=0, description="Farm size in acres")


class YieldPredictionRequest(BaseModel):
    crop: str = Field(..., description="Crop name")
    farm_size_acres: float = Field(..., gt=0, description="Farm size in acres")
    soil_quality: str = Field(..., description="Soil quality (poor, average, good, excellent)")
    rainfall_mm: float = Field(..., ge=0, description="Expected / average rainfall in mm")
    fertilizer_used: str = Field(..., description="Fertilizer type or none")


class VoiceQueryRequest(BaseModel):
    text: str = Field(..., description="Farmer's query in any language")
    language: str = Field(default="en", description="Language code (en, hi, mr, te, ta, kn, etc.)")
