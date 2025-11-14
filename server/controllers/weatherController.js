// controllers/weatherController.js - NEW
import Weather from "../models/Weather.js";

// Mock weather data for Kerala districts
const mockWeatherData = {
  "Thiruvananthapuram": {
    temperature: { current: 28, min: 24, max: 32 },
    humidity: 78,
    rainfall: 2.5,
    windSpeed: 12,
    condition: "cloudy",
    forecast: [
      { date: new Date(Date.now() + 86400000), temperature: { min: 24, max: 31 }, rainfall: 1.8, condition: "rainy" },
      { date: new Date(Date.now() + 172800000), temperature: { min: 25, max: 33 }, rainfall: 0.5, condition: "cloudy" }
    ]
  },
  "Ernakulam": {
    temperature: { current: 30, min: 25, max: 34 },
    humidity: 75,
    rainfall: 1.8,
    windSpeed: 15,
    condition: "sunny",
    forecast: [
      { date: new Date(Date.now() + 86400000), temperature: { min: 25, max: 33 }, rainfall: 2.1, condition: "rainy" },
      { date: new Date(Date.now() + 172800000), temperature: { min: 26, max: 34 }, rainfall: 0.8, condition: "sunny" }
    ]
  }
};

export const getWeather = async (req, res) => {
  try {
    const { district } = req.params;
    
    // In production, replace with actual weather API
    let weather = await Weather.findOne({ district });
    
    if (!weather) {
      // Create mock data if not exists
      if (mockWeatherData[district]) {
        weather = new Weather({
          district,
          ...mockWeatherData[district],
          lastUpdated: new Date()
        });
        await weather.save();
      } else {
        return res.status(404).json({ message: "Weather data not available for this district" });
      }
    }

    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWeather = async (req, res) => {
  try {
    const { district } = req.params;
    const updateData = req.body;

    const weather = await Weather.findOneAndUpdate(
      { district },
      { ...updateData, lastUpdated: new Date() },
      { new: true, upsert: true }
    );

    res.json({ message: "Weather data updated", weather });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};