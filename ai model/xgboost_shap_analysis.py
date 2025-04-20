import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import xgboost as xgb
import shap
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
for lag in [1, 4, 12]:
    df[f'Sales_lag_{lag}'] = df.groupby(['Product', 'Region'])['Sales'].shift(lag)
    features.append(f'Sales_lag_{lag}')

df['Sales_roll_mean_4'] = df.groupby(['Product', 'Region'])['Sales'].shift(1).rolling(window=4).mean()
features.append('Sales_roll_mean_4')

# Add time-based features
df['Week_of_Year'] = df['Date'].dt.isocalendar().week
df['Month'] = df['Date'].dt.month
features.extend(['Week_of_Year', 'Month'])

# Drop rows with NaN
df = df.dropna()

# Step 3: Prepare Test Data
test_size = int(0.1 * len(df))
test_df = df[-test_size:]  # Last 10% for SHAP analysis

# Load scalers
feature_scaler = joblib.load('feature_scaler.joblib')
target_scaler = joblib.load('target_scaler.joblib')

# Scale test data
test_scaled = feature_scaler.transform(test_df[features])

# Step 4: Load Trained XGBoost Model
model = xgb.Booster()
model.load_model('xgboost_demand_forecasting_model.json')

# Step 5: SHAP Analysis
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(test_scaled)

# Step 6: SHAP Summary Plot
plt.figure()
shap.summary_plot(shap_values, test_df[features], feature_names=features, show=False)
plt.tight_layout()
plt.savefig('shap_summary_plot.png')
plt.close()

# Step 7: SHAP Bar Plot
plt.figure()
shap.summary_plot(shap_values, test_df[features], feature_names=features, plot_type="bar", show=False)
plt.tight_layout()
plt.savefig('shap_bar_plot.png')
plt.close()

# Step 8: SHAP Dependence Plot for Top Feature
top_feature = features[np.argmax(np.abs(shap_values).mean(axis=0))]
plt.figure()
shap.dependence_plot(top_feature, shap_values, test_scaled, feature_names=features, show=False)
plt.tight_layout()
plt.savefig(f'shap_dependence_{top_feature}.png')
plt.close()

# Step 9: Save SHAP Values
np.save('shap_values.npy', shap_values)
print("SHAP analysis completed. Visualizations saved as 'shap_summary_plot.png', 'shap_bar_plot.png', and 'shap_dependence_<feature>.png'.")