// models/Farm.js - UPDATED
import mongoose from "mongoose";

const farmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  farmName: {
    type: String,
    required: true
  },
  location: {
    district: String,
    village: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  cropType: {
    type: String,
    enum: ["rice", "coconut", "rubber", "spices", "vegetables", "fruits", "other"]
  },
  size: {
    value: Number,
    unit: { type: String, enum: ["acres", "hectares"], default: "acres" }
  },
  soilType: {
    type: String,
    enum: ["clay", "sandy", "loamy", "laterite", "other"]
  },
  irrigation: {
    type: String,
    enum: ["rainfed", "well", "canal", "drip", "sprinkler"]
  },
  status: {
    type: String,
    enum: ["active", "inactive", "harvested"],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Farm = mongoose.model("Farm", farmSchema);
export default Farm;