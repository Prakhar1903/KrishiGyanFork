// src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key from environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage) => {
  try {
    console.log('Sending request to Gemini API...');

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    if (!API_KEY) {
      throw new Error("API_KEY_MISSING");
    }

    const prompt = `
      You are an agricultural assistant for Kerala farmers. Always respond in the same language as the user's question (English or Malayalam).
      
      User Question: "${userMessage}"
      
      Provide helpful, accurate, and practical information about:
      - Crop cultivation in Kerala (rice, coconut, spices, vegetables)
      - Pest and disease management
      - Weather patterns and monsoon advice
      - Market prices and selling strategies  
      - Government schemes for farmers
      - Organic farming practices
      
      Keep responses concise, farmer-friendly, and focused on Kerala agriculture.
      If you're unsure, suggest consulting local agriculture experts at Krishi Vigyan Kendra.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response received:', text);
    return text;

  } catch (error) {
    console.error('Gemini API error details:', error);

    // Provide more specific error messages
    if (error.message?.includes('API_KEY') || error.message?.includes('key')) {
      return "API key issue. Please check if your Gemini API key is properly set in the .env file.";
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return "Network connection issue. Please check your internet connection.";
    } else {
      return "I'm having trouble connecting to the AI service right now. Please try again in a few moments.";
    }
  }
};