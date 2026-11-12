from pydantic import BaseModel
from typing import List, Optional, Dict, Any


# Crop Disease
class CropDiseaseResponse(BaseModel):
    disease_name: str
    confidence: float
    severity: str
    symptoms: List[str]
    recommendations: List[str]
    preventive_measures: List[str]
    suitable_pesticides: List[str]


# Weather
class WeatherCurrent(BaseModel):
    temperature: float
    feels_like: float
    humidity: int
    wind_speed: float
    description: str
    icon: str


class WeatherDay(BaseModel):
    date: str
    day: str
    temp_min: float
    temp_max: float
    description: str
    humidity: int
    rain_probability: float
    icon: str


class WeatherResponse(BaseModel):
    location: str
    current: WeatherCurrent
    forecast: List[WeatherDay]
    crop_recommendations: List[str]
    farming_advice: str


# Soil Analysis
class SoilAnalysisResponse(BaseModel):
    soil_health_score: float
    ph_status: str
    nutrient_status: Dict[str, str]
    recommended_crops: List[str]
    soil_improvements: List[str]
    fertilizer_recommendations: List[str]
    summary: str


# Crop Recommendation
class CropDetail(BaseModel):
    name: str
    variety: str
    sowing_period: str
    harvest_period: str
    water_requirement: str
    expected_yield_per_acre: str
    estimated_cost_per_acre: float
    expected_return_per_acre: float
    roi_percent: float
    requirements: List[str]
    market_demand: str


class CropRecommendationResponse(BaseModel):
    top_crops: List[CropDetail]
    general_advice: str
    best_pick: str


# Market Prices
class MandiPrice(BaseModel):
    mandi_name: str
    location: str
    price_per_quintal: float
    price_trend: str


class MarketPricesResponse(BaseModel):
    crop: str
    location: str
    prices: List[MandiPrice]
    average_price: float
    min_price: float
    max_price: float
    trend: str
    trend_percent: float
    selling_advice: str
    best_time_to_sell: str


# Yield Prediction
class YieldPredictionResponse(BaseModel):
    crop: str
    farm_size_acres: float
    predicted_yield_min_quintals: float
    predicted_yield_max_quintals: float
    predicted_yield_per_acre: float
    confidence_percent: float
    estimated_harvest_date: str
    factors_affecting_yield: List[str]
    improvement_tips: List[str]
    estimated_revenue_range: Dict[str, float]


# Voice Assistant
class VoiceQueryResponse(BaseModel):
    query: str
    language: str
    response: str
    related_tips: List[str]
    follow_up_questions: List[str]
