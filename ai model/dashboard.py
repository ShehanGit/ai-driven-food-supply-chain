import streamlit as st
import requests
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Flask API URL
FLASK_API_URL = "http://localhost:5000/predict/xgboost"

# Features for XGBoost
xgboost_features = [
    'Temperature', 'Rainfall', 'Holiday', 'Inventory', 'TransportTime', 'Urban',
    'Sales_lag_1', 'Sales_lag_4', 'Sales_lag_12', 'Sales_roll_mean_4',
    'Week_of_Year', 'Month'
]

# Streamlit app
st.title("CropSynapse Demand Forecasting Dashboard")
st.write("Input data to predict demand and understand key drivers using XGBoost.")

# Input form
st.header("Input Parameters")
input_data = {}
col1, col2, col3 = st.columns(3)

with col1:
    input_data['Temperature'] = st.number_input("Temperature (°C)", min_value=0.0, max_value=40.0, value=25.0)
    input_data['Rainfall'] = st.number_input("Rainfall (mm)", min_value=0.0, max_value=100.0, value=10.0)
    input_data['Holiday'] = st.selectbox("Holiday", [0, 1], index=0)
    input_data['Inventory'] = st.number_input("Inventory (units)", min_value=0.0, max_value=1000.0, value=500.0)

with col2:
    input_data['TransportTime'] = st.number_input("Transport Time (days)", min_value=0.0, max_value=10.0, value=2.0)
    input_data['Urban'] = st.selectbox("Urban (1=Yes, 0=No)", [0, 1], index=1)
    input_data['Sales_lag_1'] = st.number_input("Sales (1 week ago)", min_value=0.0, max_value=1000.0, value=450.0)
    input_data['Sales_lag_4'] = st.number_input("Sales (4 weeks ago)", min_value=0.0, max_value=1000.0, value=430.0)

with col3:
    input_data['Sales_lag_12'] = st.number_input("Sales (12 weeks ago)", min_value=0.0, max_value=1000.0, value=420.0)
    input_data['Sales_roll_mean_4'] = st.number_input("Avg Sales (last 4 weeks)", min_value=0.0, max_value=1000.0, value=440.0)
    input_data['Week_of_Year'] = st.number_input("Week of Year", min_value=1, max_value=52, value=42)
    input_data['Month'] = st.number_input("Month", min_value=1, max_value=12, value=10)

# Predict button
if st.button("Predict Demand"):
    try:
        # Send request to Flask API
        response = requests.post(FLASK_API_URL, json=input_data)
        result = response.json()
        
        if result['status'] == 'success':
            st.success(f"Predicted Demand: **{result['prediction']:.2f} units**")
            
            # Display SHAP explanations
            st.header("Key Drivers of Prediction (SHAP)")
            shap_data = result['shap_explanations']
            shap_df = pd.DataFrame({
                'Feature': list(shap_data.keys()),
                'SHAP Value': list(shap_data.values())
            }).sort_values('SHAP Value', key=abs, ascending=False)
            
            # Bar plot
            fig, ax = plt.subplots()
            sns.barplot(x='SHAP Value', y='Feature', data=shap_df, ax=ax)
            ax.set_title("Feature Contributions to Prediction")
            st.pyplot(fig)
            
        else:
            st.error(f"Error: {result['error']}")
    except Exception as e:
        st.error(f"Failed to connect to API: {str(e)}")

# Instructions
st.header("Instructions")
st.write("""
1. Enter values for each parameter (based on your data).
2. Click 'Predict Demand' to get the forecasted demand.
3. Review the SHAP plot to understand which factors (e.g., Holiday, Sales_lag_1) drive the prediction.
4. Use these insights to optimize inventory, plan deliveries, or adjust pricing.
""")