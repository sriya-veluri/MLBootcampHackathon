import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(__file__)

try:
    model  = joblib.load(os.path.join(BASE_DIR, "aqi_model.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "aqi_scaler.pkl"))
    dataset = pd.read_csv(os.path.join(BASE_DIR, "global_air_pollution_dataset.csv"))
except FileNotFoundError as e:
    raise RuntimeError(f"Model files not found — run train.py first.\n{e}")

def get_category(aqi: float) -> str:
    if aqi <= 50:  return "Good"
    if aqi <= 100: return "Moderate"
    if aqi <= 150: return "Unhealthy for Sensitive Groups"
    if aqi <= 200: return "Unhealthy"
    if aqi <= 300: return "Very Unhealthy"
    return "Hazardous"

def normalize_country_name(country: str) -> str:
    """Normalize country name variations to match dataset values."""
    country_lower = country.lower()
    
    # Common country name mappings
    mappings = {
        "usa": "United States of America",
        "united states": "United States of America",
        "us": "United States of America",
        "uk": "United Kingdom",
        "uae": "United Arab Emirates",
    }
    
    if country_lower in mappings:
        return mappings[country_lower]
    
    return country

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

class DatasetComparisonResponse(BaseModel):
    city: str
    country: str
    dataset_aqi: float
    dataset_aqi_category: str
    predicted_aqi: float
    predicted_aqi_category: str
    difference: float
    co_aqi: float
    ozone_aqi: float
    no2_aqi: float
    pm25_aqi: float

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

@app.get("/city/{city_name}", response_model=DatasetComparisonResponse)
def get_city_comparison(city_name: str, country: str = None):
    """
    Fetch a city from the dataset, predict AQI using the model, and compare.
    Returns both dataset AQI and model-predicted AQI for comparison.
    """
    try:
        # Find the city in the dataset
        # First, try exact match with both city name and country
        matching_rows = dataset[dataset["City"].str.lower() == city_name.lower()]
        
        if country and not matching_rows.empty:
            # If country is provided, try to match it
            normalized_country = normalize_country_name(country)
            country_match = matching_rows[
                matching_rows["Country"].str.lower() == normalized_country.lower()
            ]
            if not country_match.empty:
                matching_rows = country_match
        
        if matching_rows.empty:
            raise HTTPException(status_code=404, detail=f"City '{city_name}' not found in dataset")
        
        # Get the first matching row (in case of duplicates)
        row = matching_rows.iloc[0]
        
        dataset_aqi = float(row["AQI Value"])
        co_aqi = float(row["CO AQI Value"])
        ozone_aqi = float(row["Ozone AQI Value"])
        no2_aqi = float(row["NO2 AQI Value"])
        pm25_aqi = float(row["PM2.5 AQI Value"])
        country_value = row["Country"] if pd.notna(row["Country"]) else "Unknown"
        
        # Use the model to predict AQI from these pollutant values
        features = np.array([[co_aqi, ozone_aqi, no2_aqi, pm25_aqi]])
        features_scaled = scaler.transform(features)
        predicted_aqi = float(model.predict(features_scaled)[0])
        predicted_aqi = max(0.0, round(predicted_aqi, 2))
        
        difference = round(predicted_aqi - dataset_aqi, 2)
        
        return DatasetComparisonResponse(
            city=row["City"],
            country=country_value,
            dataset_aqi=dataset_aqi,
            dataset_aqi_category=get_category(dataset_aqi),
            predicted_aqi=predicted_aqi,
            predicted_aqi_category=get_category(predicted_aqi),
            difference=difference,
            co_aqi=co_aqi,
            ozone_aqi=ozone_aqi,
            no2_aqi=no2_aqi,
            pm25_aqi=pm25_aqi,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching city data: {e}")