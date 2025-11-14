// routes/weatherRoutes.js - NEW
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getWeather, updateWeather } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/:district", verifyToken, getWeather);
router.put("/:district", verifyToken, updateWeather);

export default router;