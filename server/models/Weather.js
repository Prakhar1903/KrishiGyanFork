// models/Weather.js - NEW
import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true
  },
  temperature: {
    current: Number,
    min: Number,
    max: Number
  },
  humidity: Number,
  rainfall: Number,
  windSpeed: Number,
  condition: {
    type: String,
    enum: ["sunny", "cloudy", "rainy", "stormy", "foggy"]
  },
  forecast: [{
    date: Date,
    temperature: {
      min: Number,
      max: Number
    },
    rainfall: Number,
    condition: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Weather = mongoose.model("Weather", weatherSchema);
export default Weather;