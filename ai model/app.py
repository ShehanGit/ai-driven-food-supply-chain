from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import xgboost as xgb
import joblib
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError
import shap

app = Flask(__name__)

# Load models and scalers
xgboost_model = xgb.Booster()
xgboost_model.load_model('xgboost_demand_forecasting_model.json')

# Load LSTM model with custom objects to handle 'mse' loss
lstm_model = load_model('lstm_demand_forecasting_model.h5', custom_objects={'mse': MeanSquaredError()})

feature_scaler = joblib.load('feature_scaler.joblib')
target_scaler = joblib.load('target_scaler.joblib')
lstm_target_scaler = np.load('scaler.npy', allow_pickle=True).item()

# Features expected by models
xgboost_features = [
    'Temperature', 'Rainfall', 'Holiday', 'Inventory', 'TransportTime', 'Urban',
    'Sales_lag_1', 'Sales_lag_4', 'Sales_lag_12', 'Sales_roll_mean_4',
    'Week_of_Year', 'Month'
]
lstm_features = ['Sales', 'Temperature', 'Rainfall', 'Holiday', 'Inventory', 'TransportTime', 'Urban']
seq_length = 12  # LSTM sequence length

@app.route('/predict/xgboost', methods=['POST'])
def predict_xgboost():
    try:
        data = request.get_json()
        input_data = pd.DataFrame([data], columns=xgboost_features)
        
        # Scale input
        input_scaled = feature_scaler.transform(input_data)
        dmatrix = xgb.DMatrix(input_scaled)
        
        # Predict
        pred_scaled = xgboost_model.predict(dmatrix)
        pred = target_scaler.inverse_transform(pred_scaled.reshape(-1, 1)).flatten()[0]
        
        # SHAP explanation
        explainer = shap.TreeExplainer(xgboost_model)
        shap_values = explainer.shap_values(input_scaled)
        shap_contributions = {feat: float(val) for feat, val in zip(xgboost_features, shap_values[0])}
        
        return jsonify({
            'prediction': float(pred),
            'shap_explanations': shap_contributions,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

@app.route('/predict/lstm', methods=['POST'])
def predict_lstm():
    try:
        data = request.get_json()
        # Expect a list of 12 timesteps, each with lstm_features
        if len(data) != seq_length:
            return jsonify({'error': f'Expected {seq_length} timesteps'}), 400
        
        input_data = pd.DataFrame(data, columns=lstm_features)
        
        # Scale input
        input_scaled = feature_scaler.transform(input_data)
        input_array = np.array([input_scaled])  # Shape: (1, seq_length, n_features)
        
        # Predict
        pred_scaled = lstm_model.predict(input_array, verbose=0)
        pred = lstm_target_scaler.inverse_transform(pred_scaled).flatten()[0]
        
        return jsonify({
            'prediction': float(pred),
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)