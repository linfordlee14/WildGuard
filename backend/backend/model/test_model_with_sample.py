# test_model_with_sample.py
import pickle
from pathlib import Path
import pandas as pd
import numpy as np

base_dir = Path(__file__).resolve().parent      # backend/model
dataset_path = base_dir.parent / 'datasets' / 'poaching_data.csv'
model_path = base_dir / 'poaching_model.pkl'

# Load model
with open(model_path, 'rb') as f:
    data = pickle.load(f)

model = data['model']
scaler = data['scaler']

# Load dataset and pick a random sample
df = pd.read_csv(dataset_path)
sample = df.sample(1)
X_sample = sample[['lat', 'long']]

# Scale and predict (keep column names to avoid warning)
X_scaled = scaler.transform(X_sample)  # X_sample is a DataFrame -> feature names preserved
prediction = model.predict(X_scaled)
proba = model.predict_proba(X_scaled)

print("Random sample (lat,long):", X_sample.values)
print("Prediction (0=low risk, 1=high risk):", prediction)
print("Prediction probabilities:", proba)
