import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(__file__)

try:
    model  = joblib.load(os.path.join(BASE_DIR, "aqi_model.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "aqi_scaler.pkl"))
except FileNotFoundError as e:
    raise RuntimeError(f"Model files not found — run train.py first.\n{e}")

def get_category(aqi: float) -> str:
    if aqi <= 50:  return "Good"
    if aqi <= 100: return "Moderate"
    if aqi <= 150: return "Unhealthy for Sensitive Groups"
    if aqi <= 200: return "Unhealthy"
    if aqi <= 300: return "Very Unhealthy"
    return "Hazardous"

app = FastAPI(
    title="AQI Prediction API",
    description="Predicts AQI from pollutant sub-indices using linear regression.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PollutantInput(BaseModel):
    co_aqi:    float = Field(..., ge=0, description="CO AQI Value")
    ozone_aqi: float = Field(..., ge=0, description="Ozone AQI Value")
    no2_aqi:   float = Field(..., ge=0, description="NO2 AQI Value")
    pm25_aqi:  float = Field(..., ge=0, description="PM2.5 AQI Value")

    model_config = {
        "json_schema_extra": {
            "examples": [{"co_aqi": 1, "ozone_aqi": 23, "no2_aqi": 4, "pm25_aqi": 55}]
        }
    }

class PredictionResponse(BaseModel):
    predicted_aqi: float
    aqi_category:  str
    inputs:        PollutantInput

@app.get("/")
def root():
    return {"message": "AQI Prediction API is running. Visit /docs to test it."}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionResponse)
def predict(data: PollutantInput):
    try:
        features = np.array([[data.co_aqi, data.ozone_aqi, data.no2_aqi, data.pm25_aqi]])
        features_scaled = scaler.transform(features)
        predicted_aqi = float(model.predict(features_scaled)[0])
        predicted_aqi = max(0.0, round(predicted_aqi, 2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    return PredictionResponse(
        predicted_aqi=predicted_aqi,
        aqi_category=get_category(predicted_aqi),
        inputs=data,
    )