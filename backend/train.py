import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# ── Load dataset ──────────────────────────────────────────────────────────────
df = pd.read_csv("global_air_pollution_dataset.csv")

# Drop rows missing Country/City (427 rows); all numeric cols are complete
df = df.dropna()

# Drop string columns — not usable as numeric features
# Category columns (e.g. "Good", "Moderate") are redundant with their AQI values
df = df.drop(columns=[
    "Country", "City",
    "AQI Category", "CO AQI Category",
    "Ozone AQI Category", "NO2 AQI Category", "PM2.5 AQI Category"
])

# ── Features & target ─────────────────────────────────────────────────────────
# Predicting overall AQI Value from individual pollutant AQI components
# xj = jth feature, n = number of features (bootcamp: multivariate linear regression)
# f(x) = w1*x1 + w2*x2 + ... + wn*xn + b
X = df.drop(columns=["AQI Value"])
y = df["AQI Value"]

print(f"Features (n={X.shape[1]}): {X.columns.tolist()}")
print(f"Training examples (m={len(df)})")

# ── Train-test split ──────────────────────────────────────────────────────────
# Hold out 20% to evaluate generalization on unseen data (bootcamp concept)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"\nTrain size: {len(X_train)}, Test size: {len(X_test)}")

# ── Feature normalization ─────────────────────────────────────────────────────
# Bootcamp: normalize so gradient descent converges faster & features are comparable
# StandardScaler transforms each feature to mean=0, std=1
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # fit ONLY on train set
X_test_scaled  = scaler.transform(X_test)        # apply same scale to test (no leakage)

# ── Model: Multivariate Linear Regression ────────────────────────────────────
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# ── Learned weights ───────────────────────────────────────────────────────────
print("\nLearned weights (w) per feature:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"  {feature:>20}: {coef:.4f}")
print(f"  {'bias (b)':>20}: {model.intercept_:.4f}")

# ── Evaluation ────────────────────────────────────────────────────────────────
# Bootcamp: squared error cost function → MSE = (1/m) Σ (f(x) - y)²
# R² measures fraction of variance explained (1.0 = perfect fit)
y_pred_train = model.predict(X_train_scaled)
y_pred_test  = model.predict(X_test_scaled)

train_mse = mean_squared_error(y_train, y_pred_train)
test_mse  = mean_squared_error(y_test,  y_pred_test)
train_r2  = r2_score(y_train, y_pred_train)
test_r2   = r2_score(y_test,  y_pred_test)

print(f"\n── Evaluation ─────────────────────────────────")
print(f"Train MSE: {train_mse:.4f}  |  Test MSE: {test_mse:.4f}")
print(f"Train R²:  {train_r2:.4f}  |  Test R²:  {test_r2:.4f}")

# ── Save model + scaler ───────────────────────────────────────────────────────
# Always save the scaler alongside the model — you need it to preprocess
# new inputs at inference time using the same fitted transformation
joblib.dump(model,  "aqi_model.pkl")
joblib.dump(scaler, "aqi_scaler.pkl")
print("\nModel and scaler saved → aqi_model.pkl, aqi_scaler.pkl")