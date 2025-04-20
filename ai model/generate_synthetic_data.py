import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Parameters
start_date = datetime(2021, 1, 3)  # First Sunday of 2021
num_weeks = 156  # 3 years of weekly data (2021-2023)
products = ['Tomatoes', 'Avocados', 'Bananas', 'Eggs', 'Corn', 'Coconuts']
regions = ['California', 'Florida']
dates = [start_date + timedelta(weeks=i) for i in range(num_weeks)]

# Define holidays (key US holidays for 2021-2023, plus Easter for eggs)
holidays = {
    '2021-01-01': 'New Year',
    '2021-04-04': 'Easter',  # Easter 2021
    '2021-07-04': 'Independence Day',
    '2021-11-25': 'Thanksgiving',
    '2021-12-25': 'Christmas',
    '2022-01-01': 'New Year',
    '2022-04-17': 'Easter',  # Easter 2022
    '2022-07-04': 'Independence Day',
    '2022-11-24': 'Thanksgiving',
    '2022-12-25': 'Christmas',
    '2023-01-01': 'New Year',
    '2023-04-09': 'Easter',  # Easter 2023
    '2023-07-04': 'Independence Day',
    '2023-11-23': 'Thanksgiving',
    '2023-12-25': 'Christmas'
}
holiday_dates = [datetime.strptime(date, '%Y-%m-%d') for date in holidays.keys()]

# Product-specific parameters for sales
product_params = {
    'Tomatoes': {'base_sales': 400, 'seasonal_peak': 6, 'seasonal_scale': 150, 'noise': 50, 'holiday_boost': 0.3, 'region_factor': {'California': 1.2, 'Florida': 1.0}},
    'Avocados': {'base_sales': 300, 'seasonal_peak': 5, 'seasonal_scale': 100, 'noise': 40, 'holiday_boost': 0.25, 'region_factor': {'California': 1.3, 'Florida': 0.9}},
    'Bananas': {'base_sales': 500, 'seasonal_peak': 7, 'seasonal_scale': 120, 'noise': 60, 'holiday_boost': 0.2, 'region_factor': {'California': 1.0, 'Florida': 1.1}},
    'Eggs': {'base_sales': 600, 'seasonal_peak': 11, 'seasonal_scale': 80, 'noise': 30, 'holiday_boost': 0.5, 'region_factor': {'California': 1.0, 'Florida': 1.0}},  # Strong Easter boost
    'Corn': {'base_sales': 350, 'seasonal_peak': 8, 'seasonal_scale': 130, 'noise': 45, 'holiday_boost': 0.3, 'region_factor': {'California': 0.9, 'Florida': 1.2}},
    'Coconuts': {'base_sales': 200, 'seasonal_peak': 7, 'seasonal_scale': 90, 'noise': 35, 'holiday_boost': 0.2, 'region_factor': {'California': 0.8, 'Florida': 1.3}}
}

# Region-specific weather parameters with seasonal variation
weather_params = {
    'California': {'temp_summer': 25, 'temp_winter': 15, 'temp_std': 3, 'rain_summer': 5, 'rain_winter': 15, 'rain_std': 5},
    'Florida': {'temp_summer': 28, 'temp_winter': 20, 'temp_std': 3, 'rain_summer': 25, 'rain_winter': 10, 'rain_std': 10}
}

# Initialize data dictionary
data = {
    'Date': [],
    'Product': [],
    'Region': [],
    'Sales': [],  # Tons for crops, thousands for eggs
    'Temperature': [],  # °C
    'Rainfall': [],  # mm
    'Holiday': [],
    'Holiday_Name': [],
    'Inventory': [],  # Tons for crops, thousands for eggs
    'TransportTime': [],
    'Urban': []
}

# Function to generate weather data
def generate_weather(date, region):
    w_params = weather_params[region]
    week_of_year = date.isocalendar()[1]
    # Seasonal temperature: warmer in summer (June-Aug), cooler in winter (Dec-Feb)
    season_factor = np.sin(2 * np.pi * week_of_year / 52)
    temp_mean = w_params['temp_winter'] + (w_params['temp_summer'] - w_params['temp_winter']) * (season_factor + 1) / 2
    temp = np.random.normal(temp_mean, w_params['temp_std'])
    temp = max(10, min(35, temp))  # Realistic range: 10-35°C
    # Seasonal rainfall: more in winter for California, summer for Florida
    rain_mean = w_params['rain_winter'] if region == 'California' else w_params['rain_summer']
    rain_mean += (w_params['rain_summer'] - w_params['rain_winter'] if region == 'California' else w_params['rain_winter'] - w_params['rain_summer']) * (season_factor + 1) / 2
    rainfall = np.random.normal(rain_mean, w_params['rain_std'])
    rainfall = max(0, rainfall)  # No negative rainfall
    return round(temp, 1), round(rainfall, 1)

# Generate data
for date in dates:
    for product in products:
        for region in regions:  # Corrected from 'products' to 'regions'
            # Basic info
            data['Date'].append(date)
            data['Product'].append(product)
            data['Region'].append(region)

            # Sales
            params = product_params[product]
            week_of_year = date.isocalendar()[1]
            seasonal_effect = params['seasonal_scale'] * np.sin(2 * np.pi * (week_of_year - params['seasonal_peak']) / 52)
            base_sales = params['base_sales'] + seasonal_effect
            base_sales *= params['region_factor'][region]  # Regional variation
            holiday_boost = 0
            holiday_name = 'None'
            for h_date in holiday_dates:
                if abs((date - h_date).days) <= 7:  # Holiday effect within 1 week
                    holiday_boost = base_sales * params['holiday_boost']
                    holiday_name = holidays[h_date.strftime('%Y-%m-%d')]
                    if holiday_name == 'Easter' and product != 'Eggs':
                        holiday_boost = 0  # Easter only boosts eggs
                    break
            noise = np.random.normal(0, params['noise'])
            sales = max(100, base_sales + holiday_boost + noise)  # Ensure sales > 100
            data['Sales'].append(round(sales, 2))

            # Weather
            temp, rainfall = generate_weather(date, region)
            data['Temperature'].append(temp)
            data['Rainfall'].append(rainfall)

            # Holiday
            is_holiday = 1 if holiday_name != 'None' else 0
            data['Holiday'].append(is_holiday)
            data['Holiday_Name'].append(holiday_name)

            # Supply Chain Metadata
            inventory = max(50, sales * np.random.uniform(0.5, 1.5))  # 50-150% of sales
            data['Inventory'].append(round(inventory, 2))
            transport_time = np.random.choice([1, 2, 3]) if region == 'California' else np.random.choice([2, 3, 4])
            data['TransportTime'].append(transport_time)
            urban = 1 if np.random.random() < 0.7 else 0  # 70% urban
            data['Urban'].append(urban)

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
output_file = 'crop_synapse_synthetic_data.csv'
df.to_csv(output_file, index=False)

# Print summary
print(f"Synthetic data generated and saved to '{output_file}'")
print(f"Shape: {df.shape}")
print("\nFirst few rows:")
print(df.head())
print("\nData summary:")
print(df.describe())
print("\nHoliday counts:")
print(df['Holiday_Name'].value_counts())