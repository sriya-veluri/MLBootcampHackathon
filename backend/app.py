import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# ── Load model & scaler ───────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)

try:
    model  = joblib.load(os.path.join(BASE_DIR, "aqi_model.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "aqi_scaler.pkl"))
except FileNotFoundError as e:
    raise RuntimeError(f"Model files not found — run train.py first.\n{e}")

# AQI category thresholds (EPA standard)
def get_category(aqi: float) -> str:
    if aqi <= 50:   return "Good"
    if aqi <= 100:  return "Moderate"
    if aqi <= 150:  return "Unhealthy for Sensitive Groups"
    if aqi <= 200:  return "Unhealthy"
    if aqi <= 300:  return "Very Unhealthy"
    return "Hazardous"

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AQI Prediction API",
    description="Predicts overall AQI from individual pollutant AQI sub-indices using a trained linear regression model.",
    version="1.0.0",
)

# ── Request / Response schemas ────────────────────────────────────────────────
class PollutantInput(BaseModel):
    co_aqi:    float = Field(..., ge=0, description="CO AQI Value")
    ozone_aqi: float = Field(..., ge=0, description="Ozone AQI Value")
    no2_aqi:   float = Field(..., ge=0, description="NO2 AQI Value")
    pm25_aqi:  float = Field(..., ge=0, description="PM2.5 AQI Value")

    model_config = {
        "json_schema_extra": {
            "examples": [{
                "co_aqi": 1,
                "ozone_aqi": 23,
                "no2_aqi": 4,
                "pm25_aqi": 55
            }]
        }
    }

class PredictionResponse(BaseModel):
    predicted_aqi:      float
    aqi_category:       str
    inputs:             PollutantInput

# ── Routes ────────────────────────────────────────────────────────────────────
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
        predicted_aqi = max(0.0, round(predicted_aqi, 2))  # AQI can't be negative
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    return PredictionResponse(
        predicted_aqi=predicted_aqi,
        aqi_category=get_category(predicted_aqi),
        inputs=data,
    )