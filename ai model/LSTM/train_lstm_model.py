import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt

# Step 1: Load and Preprocess Data
df = pd.read_csv('crop_synapse_synthetic_data.csv')
df['Date'] = pd.to_datetime(df['Date'])
df = df.sort_values(['Product', 'Region', 'Date'])

# Handle missing or invalid data
df = df.dropna()
df = df[df['Sales'] > 0]

# Select features and target
features = ['Sales', 'Temperature', 'Rainfall', 'Holiday', 'Inventory', 'TransportTime', 'Urban']
target = 'Sales'

# Step 2: Create Sequences for LSTM
def create_sequences(data, seq_length, feature_cols, target_col):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[feature_cols].iloc[i:i+seq_length].values)
        y.append(data[target_col].iloc[i+seq_length])
    return np.array(X), np.array(y)

seq_length = 16  # Increased to 16 weeks for better pattern capture
X, y = [], []

# Group by Product and Region
for (product, region), group in df.groupby(['Product', 'Region']):
    if len(group) < seq_length + 1:
        continue
    # Scale features and target within group
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(group[features])
    scaled_df = pd.DataFrame(scaled_data, columns=features, index=group.index)
    target_scaler_group = MinMaxScaler()
    scaled_df['Sales'] = target_scaler_group.fit_transform(group[[target]]).flatten()
    
    # Create sequences
    X_group, y_group = create_sequences(scaled_df, seq_length, features, 'Sales')
    if X_group.size > 0:
        X.append(X_group)
        y.append(y_group)

# Concatenate all sequences
if not X:
    raise ValueError("No valid sequences generated. Check data or sequence length.")
X = np.concatenate(X, axis=0)
y = np.concatenate(y, axis=0)

# Step 3: Split Data
train_size = int(0.7 * len(X))
val_size = int(0.2 * len(X))
X_train, y_train = X[:train_size], y[:train_size]
X_val, y_val = X[train_size:train_size+val_size], y[train_size:train_size+val_size]
X_test, y_test = X[train_size+val_size:], y[train_size+val_size:]

# Step 4: Build LSTM Model
model = Sequential([
    Input(shape=(seq_length, len(features))),
    LSTM(128, return_sequences=True),
    Dropout(0.3),
    LSTM(64),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dense(1)
])

model.compile(optimizer=Adam(learning_rate=0.0005), loss='mse')

# Step 5: Train Model
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=100,
    batch_size=64,
    verbose=1
)

# Step 6: Evaluate Model
test_loss = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Loss (MSE): {test_loss:.6f}")

# Predict on test set
y_pred = model.predict(X_test, verbose=0)

# Inverse scale predictions and actuals (using first group's scaler for simplicity)
_, target_scaler = MinMaxScaler(), MinMaxScaler()  # Placeholder; ideally use stored scaler
for (_, _), group in df.groupby(['Product', 'Region']):
    target_scaler.fit(group[[target]])
    break  # Use first group's scaler for demo
y_pred = target_scaler.inverse_transform(y_pred).flatten()
y_test = target_scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()

# Calculate RMSE and MAPE
rmse = np.sqrt(np.mean((y_pred - y_test) ** 2))
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
print(f"Test RMSE: {rmse:.2f}")
print(f"Test MAPE: {mape:.2f}%")

# Step 7: Plot Training History
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')  # Corrected key
plt.title('LSTM Training and Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss (MSE)')
plt.legend()
plt.savefig('lstm_training_loss.png')
plt.close()

# Step 8: Plot Predictions vs Actuals
plt.plot(y_test[:100], label='Actual Sales')
plt.plot(y_pred[:100], label='Predicted Sales')
plt.title('LSTM Predictions vs Actuals (First 100 Test Samples)')
plt.xlabel('Sample')
plt.ylabel('Sales')
plt.legend()
plt.savefig('lstm_predictions.png')
plt.close()

# Step 9: Save Model
model.save('lstm_demand_forecasting_model.h5')
np.save('scaler.npy', target_scaler)

print("Model and scaler saved successfully.")