from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import os
from dotenv import load_dotenv
from auth import auth_bp
from utils.token_utils import verify_token
from utils.db import init_db
import pickle
import pandas as pd
from pathlib import Path

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
# Fix database config
db_url = os.getenv('DATABASE_URL', 'sqlite:///wildguard.db')
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Add sslmode=require for Render
if "postgresql://" in db_url and "?sslmode=" not in db_url:
    db_url += "?sslmode=require"

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
init_db(app)

app.register_blueprint(auth_bp)

predictions_cache = []

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.replace('Bearer ', '')
            data = verify_token(token)
            if not data:
                return jsonify({'message': 'Token is invalid'}), 401
        except Exception:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated

# ======= Robust model loading at startup =======
BASE_DIR = Path(__file__).resolve().parent      # backend/
MODEL_FILE = BASE_DIR / 'model' / 'poaching_model.pkl'
DATASET_FILE = BASE_DIR / 'datasets' / 'poaching_data.csv'

def train_if_missing():
    """Call train_model() if model file is missing (keeps existing behavior)."""
    if not MODEL_FILE.exists():
        try:
            # import and call train_model (this should create MODEL_FILE)
            from model.train_model import train_model
            train_model()
        except Exception as e:
            # don't crash the import time; surface useful message
            raise RuntimeError(f"Failed to train model automatically: {e}")

def load_model_and_scaler():
    """Load the pickle and return (model, scaler). Handles both dict and direct model pickles."""
    if not MODEL_FILE.exists():
        train_if_missing()

    if not MODEL_FILE.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_FILE}")

    with open(MODEL_FILE, 'rb') as f:
        data = pickle.load(f)

    # If user saved a dict {'model': ..., 'scaler': ...}, extract; otherwise assume it's the model
    if isinstance(data, dict):
        model = data.get('model')
        scaler = data.get('scaler')
    else:
        model = data
        scaler = None

    if model is None:
        raise ValueError("Loaded pickle did not contain a 'model' entry.")

    return model, scaler

try:
    model, scaler = load_model_and_scaler()
    app.logger.info(f"Loaded model: {type(model)}, scaler: {type(scaler)}")
except Exception as exc:
    # keep startup going but log the issue; prediction endpoint will return an error if called
    model = None
    scaler = None
    app.logger.error(f"Model failed to load at startup: {exc}")
# ======= end model loading =======


@app.route('/predict', methods=['GET'])
@token_required
def predict():
    global predictions_cache, model, scaler

    # Ensure model loaded (in case startup failed)
    if model is None:
        try:
            model, scaler = load_model_and_scaler()
        except Exception as e:
            return jsonify({'error': f'Model not available: {e}'}), 500

    # ensure dataset exists
    if not DATASET_FILE.exists():
        return jsonify({'error': f'Dataset file not found: {DATASET_FILE}'}), 500

    # read dataset (preserve columns)
    try:
        df = pd.read_csv(DATASET_FILE)
    except Exception as e:
        return jsonify({'error': f'Failed to read dataset: {e}'}), 500

    if df.empty or 'lat' not in df.columns or 'long' not in df.columns:
        return jsonify({'error': 'Dataset must contain "lat" and "long" columns and not be empty.'}), 500

    X = df[['lat', 'long']]  # DataFrame — keeps feature names

    # Use scaler if available
    if scaler is not None:
        try:
            Xs = scaler.transform(X)   # pass a DataFrame to preserve feature names (no warning)
        except Exception as e:
            return jsonify({'error': f'Failed to scale features: {e}'}), 500
    else:
        Xs = X.values

    # If model variable somehow is a dict, extract actual model
    actual_model = model
    if isinstance(actual_model, dict):
        actual_model = actual_model.get('model', actual_model)

    # predict probabilities
    try:
        probs = actual_model.predict_proba(Xs)[:, 1]  # probability of positive class
    except AttributeError:
        return jsonify({'error': 'Loaded object does not support predict_proba'}), 500
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {e}'}), 500

    predictions_cache = [
        {'lat': float(row.lat), 'long': float(row.long), 'risk': float(pred)}
        for row, pred in zip(df.itertuples(), probs)
    ]

    return jsonify({'locations': predictions_cache})


@app.route('/hotspots', methods=['GET'])
@token_required
def hotspots():
    if not predictions_cache:
        return jsonify({'hotspots': []})
    sorted_predictions = sorted(predictions_cache, key=lambda x: x['risk'], reverse=True)
    return jsonify({'hotspots': sorted_predictions[:10]})


if __name__ == '__main__':
    app.run(debug=True)
