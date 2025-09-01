# train_model.py
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import pickle
from pathlib import Path

def train_model():
    base_dir = Path(__file__).resolve().parent        # backend/model
    dataset_path = base_dir.parent / 'datasets' / 'poaching_data.csv'  # backend/datasets/poaching_data.csv

    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found: {dataset_path}")

    df = pd.read_csv(dataset_path)

    X = df[['lat', 'long']]
    y = (df['risk_score'] > 0.5).astype(int)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_scaled, y)

    model_file = base_dir / 'poaching_model.pkl'
    with open(model_file, 'wb') as f:
        # Save only the necessary objects
        pickle.dump({'model': model, 'scaler': scaler}, f)

    print(f"Saved model to {model_file}")

if __name__ == '__main__':
    train_model()
