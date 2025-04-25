// src/services/weatherService.ts
import axios from 'axios';

// OpenWeather API Configuration
const API_KEY = '1eceee44619179169ee5a912cc84231f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Types for weather data
export interface CurrentWeather {
  temperature: number;
  humidity: number;
  pressure: number;
  condition: string;
  conditionDescription: string;
  windSpeed: number;
  icon: string;
  location: string;
}

export interface ForecastDay {
  date: string;
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

// Utility function to convert from Kelvin to Celsius
const kelvinToCelsius = (kelvin: number): number => {
  return Math.round((kelvin - 273.15) * 10) / 10;
};

// Get day name from date string
const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const weatherService = {
  // Get weather data by coordinates
  getWeatherByCoordinates: async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      // Get current weather data
      const currentResponse = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      
      // Get 5-day forecast data
      const forecastResponse = await axios.get(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      
      // Process current weather data
      const currentData = currentResponse.data;
      const current: CurrentWeather = {
        temperature: kelvinToCelsius(currentData.main.temp),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        condition: currentData.weather[0].main,
        conditionDescription: currentData.weather[0].description,
        windSpeed: currentData.wind.speed,
        icon: currentData.weather[0].icon,
        location: currentData.name
      };
      
      // Process forecast data
      // OpenWeather provides forecast data every 3 hours, we'll take one reading per day at noon
      const forecastList = forecastResponse.data.list;
      const dailyForecasts: { [key: string]: any } = {};
      
      // Group forecast by day and take the noon (or closest to noon) reading
      forecastList.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        const time = item.dt_txt.split(' ')[1];
        
        if (!dailyForecasts[date] || Math.abs(new Date(`${date}T12:00:00`).getTime() - new Date(`${date}T${time}`).getTime()) < 
            Math.abs(new Date(`${date}T12:00:00`).getTime() - new Date(`${date}T${dailyForecasts[date].dt_txt.split(' ')[1]}`).getTime())) {
          dailyForecasts[date] = item;
        }
      });
      
      // Convert to array and limit to 5 days
      const forecast: ForecastDay[] = Object.keys(dailyForecasts)
        .slice(0, 5)
        .map(date => {
          const item = dailyForecasts[date];
          return {
            date: formatDate(date),
            day: getDayName(date),
            temp: kelvinToCelsius(item.main.temp),
            condition: item.weather[0].main,
            icon: item.weather[0].icon
          };
        });
      
      return { current, forecast };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  },
  
  // Get weather by location name (city, country)
  getWeatherByLocation: async (location: string): Promise<WeatherData> => {
    try {
      // Get coordinates first
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error('Location not found');
      }
      
      const { lat, lon } = geoResponse.data[0];
      
      // Use the coordinates to get weather data
      return weatherService.getWeatherByCoordinates(lat, lon);
    } catch (error) {
      console.error('Error fetching weather data by location:', error);
      throw new Error('Failed to fetch weather data for the location');
    }
  },
  
  // Parse coordinates from string format (e.g. "39.7456,-97.0892")
  parseCoordinates: (locationCoordinates: string | undefined | null): { lat: number, lon: number } | null => {
    if (!locationCoordinates) return null;
    
    try {
      const [lat, lon] = locationCoordinates.split(',').map(coord => parseFloat(coord.trim()));
      
      if (isNaN(lat) || isNaN(lon)) {
        console.error('Invalid coordinates format:', locationCoordinates);
        return null;
      }
      
      return { lat, lon };
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return null;
    }
  },
  
  // Get user's current location using browser geolocation
  getCurrentLocation: (): Promise<{ lat: number, lon: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            reject('Unable to retrieve your location');
          }
        );
      } else {
        reject('Geolocation is not supported by your browser');
      }
    });
  },
  
  // Get weather for the user's current location
  getCurrentLocationWeather: async (): Promise<WeatherData> => {
    try {
      const { lat, lon } = await weatherService.getCurrentLocation();
      return weatherService.getWeatherByCoordinates(lat, lon);
    } catch (error) {
      console.error('Error getting current location weather:', error);
      throw new Error('Failed to get weather for your current location');
    }
  },
  
  // Get OpenWeather icon URL
  getIconUrl: (icon: string): string => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
};

export default weatherService;