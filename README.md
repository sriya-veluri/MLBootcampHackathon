# ML Bootcamp Hackathon - Air Quality Predictor

A full-stack web application that predicts Air Quality Index (AQI) using a multivariate linear regression model trained on global air pollution data. Compare predicted AQI values with actual dataset values for any city in the world.

## Project Overview

This application combines:
- **Machine Learning Backend**: Scikit-learn multivariate linear regression model that predicts AQI from pollutant sub-indices
- **React Frontend**: Interactive city search and air quality data visualization
- **REST API**: FastAPI backend serving model predictions and dataset comparisons

### Key Features

✨ **City Search** - Search for any city globally with autocomplete  
🤖 **ML Predictions** - Real-time AQI predictions from CO, Ozone, NO₂, and PM2.5  
📊 **Model Comparison** - Compare model predictions against actual dataset values  
📈 **Pollutant Analysis** - View individual pollutant contributions to AQI  
🎨 **Green/Blue Theme** - Beautiful gradient UI with responsive design  

---

## Technology Stack

### Backend
- **Python 3.x** with FastAPI and Uvicorn
- **scikit-learn** - LinearRegression model, StandardScaler, train_test_split, metrics
- **pandas & numpy** - Data processing
- **joblib** - Model serialization
- **Pydantic** - Data validation

### Frontend
- **React 18.3.1** with TypeScript
- **React Router v6** - Client-side routing
- **Vite** - Build tool
- **CSS 3** - Flexbox and gradient styling
- **Node.js & npm** - Runtime and package management

### Data
- **global_air_pollution_dataset.csv** - 23,463 cities with AQI and pollutant data

---

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm 7+

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd MLBootcampHackathon
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies (optional - if running train.py):**
   ```bash
   cd backend
   pip install pandas numpy scikit-learn fastapi uvicorn pydantic joblib
   cd ..
   ```

### Running the Application

**Terminal 1 - Start Backend (FastAPI):**
```bash
cd backend
uvicorn app:app --reload --port 8000
```
Backend runs at `http://localhost:8000`

**Terminal 2 - Start Frontend (React):**
```bash
npm start
```
Frontend runs at `http://localhost:3000`

Visit `http://localhost:3000` and search for any city!

---

## Project Structure

```
MLBootcampHackathon/
├── backend/
│   ├── app.py                              # FastAPI server & ML endpoints
│   ├── train.py                            # Model training script
│   ├── aqi_model.pkl                       # Trained LinearRegression model
│   ├── aqi_scaler.pkl                      # Feature normalization scaler
│   └── global_air_pollution_dataset.csv    # Training data (23,463 rows)
├── src/
│   ├── App.tsx                             # Main router component
│   ├── HomePage.tsx                        # Home page with search
│   ├── CityPage.tsx                        # City detail page
│   ├── CityCard.tsx                        # Data display card
│   ├── api/
│   │   ├── geocoding.ts                    # City search API
│   │   └── dataset.ts                      # AQI comparison API
│   ├── types.tsx                           # TypeScript interfaces
│   ├── *.css                               # Styling
│   └── index.tsx                           # React entry point
├── public/
│   └── index.html
├── package.json                            # Frontend dependencies
├── tsconfig.json                           # TypeScript config
├── vite.config.ts                          # Vite build config
├── README.md                               # This file
└── model_analysis.ipynb                    # ML model analysis notebook

```

---

## Machine Learning Model

### Model Type
**Multivariate Linear Regression** - Predicts continuous AQI value from 4 pollutant features

### Model Equation
```
AQI = 0.2140 × CO_AQI + 0.2534 × Ozone_AQI + 0.2313 × NO₂_AQI + 0.2880 × PM2.5_AQI + 0.0074
```

### Training Metrics
| Metric | Train | Test |
|--------|-------|------|
| **MSE** | 17.89 | 18.25 |
| **R²** | 0.9804 | 0.9793 |
| **Data Points** | 18,228 | 4,558 |

**Interpretation**: Model explains ~98% of AQI variance with excellent generalization (train ≈ test)

### Feature Importance
1. **PM2.5 (0.2880)** - Strongest contributor (fine particles)
2. **Ozone (0.2534)** - Second most important
3. **NO₂ (0.2313)** - Moderate influence
4. **CO (0.2140)** - Baseline contributor

---

## API Endpoints

### GET `/city/{city_name}`
Fetch dataset AQI and model prediction for a city

**Query Parameters:**
- `country` (optional) - Country name for disambiguation

**Response:**
```json
{
  "city": "Tokyo",
  "country": "Japan",
  "dataset_aqi": 79,
  "dataset_aqi_category": "Moderate",
  "predicted_aqi": 80.6,
  "predicted_aqi_category": "Moderate",
  "difference": 1.6,
  "co_aqi": 1,
  "ozone_aqi": 28,
  "no2_aqi": 17,
  "pm25_aqi": 79
}
```

### POST `/predict`
Predict AQI from raw pollutant values

**Request Body:**
```json
{
  "co_aqi": 1,
  "ozone_aqi": 23,
  "no2_aqi": 4,
  "pm25_aqi": 55
}
```

**Response:**
```json
{
  "predicted_aqi": 33.99,
  "aqi_category": "Good"
}
```

---

## Training the Model

To retrain the model with the dataset:

```bash
cd backend
python3 train.py
```

This will:
1. Load `global_air_pollution_dataset.csv`
2. Clean data and split into 80% train / 20% test
3. Normalize features using StandardScaler
4. Train LinearRegression model
5. Display training metrics (MSE, R²)
6. Save model to `aqi_model.pkl` and scaler to `aqi_scaler.pkl`

---

## Usage Examples

### Example 1: Search for a City
1. Open `http://localhost:3000`
2. Type "Paris" in the search box
3. Click "Paris, France" from dropdown
4. View predicted vs actual AQI

### Example 2: Compare Multiple Cities
Search for different cities to see:
- Which pollutants affect each city most
- Model prediction accuracy
- Difference between prediction and reality

### Example 3: Analyze Model Performance
Open `model_analysis.ipynb` in Jupyter to see:
- Feature importance visualizations
- Model equation breakdown
- Detailed metrics analysis

---

## Troubleshooting

### Backend not connecting
- Ensure backend is running on port 8000: `uvicorn app:app --reload --port 8000`
- Check CORS is enabled for `http://localhost:3000`

### Model files missing
- Run `python3 train.py` in the backend directory to regenerate model files

### City search not working
- Verify Geocoding API is accessible
- Check network tab in browser DevTools

### Port already in use
- Change port: `uvicorn app:app --port 8001` or `PORT=3001 npm start`

---

## Future Improvements

- Add more pollutants to model (SO₂, CO₂)
- Implement time-series predictions
- Deploy to cloud (AWS/Heroku)
- Add real-time data integration with OpenAQ API
- Build mobile app
- Implement model interpretability features (SHAP values)

---

## Resources

- [Scikit-learn Documentation](https://scikit-learn.org/)
- [React Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Model Analysis Notebook](./model_analysis.ipynb)

---

**Built with ❤️ for the ML Bootcamp Hackathon**
