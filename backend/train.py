import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# ── Load dataset ─────────────────────────────────────────────────────────────
df = pd.read_csv("global_air_quality_data_10000.csv")

# Drop non-numeric columns (City, Country, Date aren't features)
df = df.drop(columns=["City", "Country", "Date"])
df = df.dropna()

# ── Features & target ────────────────────────────────────────────────────────
# Predicting PM2.5 (fine particulate matter) from all other pollutants + weather
# xj = jth feature, n = number of features (bootcamp: multivariate linear regression)
X = df.drop(columns=["PM2.5"])
y = df["PM2.5"]

print(f"Features (n={X.shape[1]}): {X.columns.tolist()}")
print(f"Training examples (m={len(df)})")

# ── Train-test split ─────────────────────────────────────────────────────────
# Evaluate generalization on unseen data (bootcamp concept)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"\nTrain size: {len(X_train)}, Test size: {len(X_test)}")

# ── Feature normalization ─────────────────────────────────────────────────────
# Bootcamp: normalize features so gradient descent converges faster
# StandardScaler: transforms each feature to mean=0, std=1
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # fit only on train!
X_test_scaled  = scaler.transform(X_test)        # apply same scale to test

# ── Model: Multivariate Linear Regression ────────────────────────────────────
# f(x) = w1*x1 + w2*x2 + ... + wn*xn + b  (bootcamp notation)
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# ── Coefficients (weights) ────────────────────────────────────────────────────
print("\nLearned weights (w) per feature:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"  {feature:>12}: {coef:.4f}")
print(f"  {'bias (b)':>12}: {model.intercept_:.4f}")

# ── Evaluation ────────────────────────────────────────────────────────────────
# Bootcamp: squared error cost function → MSE = (1/m) Σ (f(x) - y)²
y_pred_train = model.predict(X_train_scaled)
y_pred_test  = model.predict(X_test_scaled)

train_mse = mean_squared_error(y_train, y_pred_train)
test_mse  = mean_squared_error(y_test, y_pred_test)
train_r2  = r2_score(y_train, y_pred_train)
test_r2   = r2_score(y_test, y_pred_test)

print(f"\n── Evaluation ──────────────────────────────")
print(f"Train MSE: {train_mse:.4f}  |  Test MSE: {test_mse:.4f}")
print(f"Train R²:  {train_r2:.4f}  |  Test R²:  {test_r2:.4f}")

# ── Save model + scaler ───────────────────────────────────────────────────────
# Save scaler too — you need it to preprocess new inputs at inference time
joblib.dump(model,  "pm25_model.pkl")
joblib.dump(scaler, "pm25_scaler.pkl")
print("\nModel and scaler saved!")