import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
df = pd.read_csv("global_air_quality_data_10000.csv")

# Drop rows with missing values (simple preprocessing)
df = df.dropna()

# Select features (inputs x)
X = df[["PM2.5", "PM10", "NO2", "Temperature", "Humidity"]]

# Target (output y)
y = df["AQI"]

# Train-test split (lecture concept: evaluate generalization)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model: Linear Regression (f(x) = w1x1 + w2x2 + ... + b)
model = LinearRegression()

# Train model
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "aqi_model.pkl")

print("Model trained!")