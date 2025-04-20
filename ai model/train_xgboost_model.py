import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import xgboost as xgb
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
import joblib

# Step 1: Load and Preprocess Data
df = pd.read_csv('crop_synapse_synthetic_data.csv')
df['Date'] = pd.to_datetime(df['Date'])
df = df.sort_values(['Product', 'Region', 'Date'])

# Handle missing or invalid data
df = df.dropna()
df = df[df['Sales'] > 0]

# Step 2: Feature Engineering
features = ['Temperature', 'Rainfall', 'Holiday', 'Inventory', 'TransportTime', 'Urban']
target = 'Sales'

# Add lagged sales and rolling averages
for lag in [1, 4, 12]:  # 1, 4, 12 weeks lag
    df[f'Sales_lag_{lag}'] = df.groupby(['Product', 'Region'])['Sales'].shift(lag)
    features.append(f'Sales_lag_{lag}')

df['Sales_roll_mean_4'] = df.groupby(['Product', 'Region'])['Sales'].shift(1).rolling(window=4).mean()
features.append('Sales_roll_mean_4')

# Add time-based features
df['Week_of_Year'] = df['Date'].dt.isocalendar().week
df['Month'] = df['Date'].dt.month
features.extend(['Week_of_Year', 'Month'])

# Drop rows with NaN due to lagging/rolling
df = df.dropna()

# Step 3: Split Data
train_size = int(0.7 * len(df))
val_size = int(0.2 * len(df))
train_df = df[:train_size]
val_df = df[train_size:train_size + val_size]
test_df = df[train_size + val_size:]

# Scale features and target
scaler = MinMaxScaler()
train_scaled = scaler.fit_transform(train_df[features])
val_scaled = scaler.transform(val_df[features])
test_scaled = scaler.transform(test_df[features])

target_scaler = MinMaxScaler()
train_y = target_scaler.fit_transform(train_df[[target]]).flatten()
val_y = target_scaler.transform(val_df[[target]]).flatten()
test_y = target_scaler.transform(test_df[[target]]).flatten()

# Step 4: Prepare DMatrix for XGBoost
dtrain = xgb.DMatrix(train_scaled, label=train_y)
dval = xgb.DMatrix(val_scaled, label=val_y)
dtest = xgb.DMatrix(test_scaled, label=test_y)

# Step 5: Set Parameters
params = {
    'objective': 'reg:squarederror',
    'max_depth': 6,
    'eta': 0.1,
    'seed': 42
}

# Step 6: Train XGBoost Model with Early Stopping
evals = [(dtrain, 'train'), (dval, 'val')]
model = xgb.train(
    params,
    dtrain,
    num_boost_round=100,
    evals=evals,
    early_stopping_rounds=10,
    verbose_eval=True
)

# Step 7: Evaluate Model
test_pred = model.predict(dtest)
test_pred = target_scaler.inverse_transform(test_pred.reshape(-1, 1)).flatten()
test_actual = target_scaler.inverse_transform(test_y.reshape(-1, 1)).flatten()

rmse = np.sqrt(mean_squared_error(test_actual, test_pred))
mape = np.mean(np.abs((test_actual - test_pred) / test_actual)) * 100
print(f"Test RMSE: {rmse:.2f}")
print(f"Test MAPE: {mape:.2f}%")

# Step 8: Plot Predictions vs Actuals
plt.figure(figsize=(10, 5))
plt.plot(test_actual[:100], label='Actual Sales')
plt.plot(test_pred[:100], label='Predicted Sales')
plt.title('XGBoost Predictions vs Actuals (First 100 Test Samples)')
plt.xlabel('Sample')
plt.ylabel('Sales')
plt.legend()
plt.savefig('xgboost_predictions.png')
plt.close()

# Step 9: Save Model and Scalers
model.save_model('xgboost_demand_forecasting_model.json')
joblib.dump(scaler, 'feature_scaler.joblib')
joblib.dump(target_scaler, 'target_scaler.joblib')

print("Model and scalers saved successfully.")