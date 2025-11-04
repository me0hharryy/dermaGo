import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI model
const API_KEY = "AIzaSyBB7TyszktjRoopl7-uy7bi1Kz5D3PFTWc";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

/**
 * Generates a skincare routine based on quiz data.
 */
export const generateRoutine = async (quizData) => {
  // ... (Your existing generateRoutine function - no changes needed here)
  const prompt = `
    You are a professional dermatologist AI. A user has provided the following information about their skin:
    - Gender: ${quizData.gender}
    - Age: ${quizData.age}
    - Skin Type: ${Array.isArray(quizData.skinType) ? quizData.skinType.join(', ') : quizData.skinType}
    - Lifestyle & Habits:
      - Sunlight Exposure: ${quizData.sunlight}
      - Wears Sunscreen: ${quizData.sunscreen}
      - Water Intake: ${quizData.water}
      - Exercise Frequency: ${quizData.exercise}
    - Skin Concerns: ${Array.isArray(quizData.concerns) ? quizData.concerns.join(', ') : 'None specified'}
    - Current Routine:
      - Face Wash Frequency: ${quizData.faceWash}
      - Uses Moisturizer: ${quizData.moisturizer}
      - Exfoliates: ${quizData.exfoliate}
      - Wears Makeup: ${quizData.makeup}
    - Medical Background:
      - Allergies: ${quizData.allergies || 'None specified'}
      - Medication: ${quizData.medication || 'None specified'}

    Based *only* on this information, please generate a simple, step-by-step AM (morning) and PM (night) skincare routine. 
    For each routine, list the steps (e.g., 1. Cleanser, 2. Moisturizer, 3. Sunscreen).
    For each step, briefly explain *why* it's important for this user and suggest the *type* of product (e.g., "gentle hydrating cleanser," "oil-free moisturizer," "broad-spectrum SPF 30+ sunscreen").
    
    Format your response *exactly* as a JSON object, like this:
    {
      "am": "1. Step One: [Product Type] - [Reason]\\n2. Step Two: [Product Type] - [Reason]",
      "pm": "1. Step One: [Product Type] - [Reason]\\n2. Step Two: [Product Type] - [Reason]"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating routine:", error);
    throw new Error("Failed to generate AI routine. Please try again.");
  }
};

/**
 * --- THIS IS THE UPDATED FUNCTION ---
 * Analyzes a product based on its barcode.
 * @param {string} barcode - The scanned barcode number.
 * @returns {object} An analysis object.
 */
export const analyzeProduct = async (barcode) => {
  const prompt = `
    You are a cosmetic chemist AI. A user has scanned a product with the following barcode: ${barcode}.

    First, use your knowledge to identify the product name and its ingredient list from this barcode.
    
    Then, provide a full analysis of that product in the following *exact* JSON format:
    {
      "productName": "The Product Name You Identified",
      "description": "A brief, neutral description of what this product does based on its ingredients.",
      "harmfulIngredients": [
        { "name": "Ingredient Name", "reason": "Why it's potentially harmful (e.g., common irritant, paraben, etc.)" }
      ],
      "comedogenicity": "A rating from 0-5 (0 = non-comedogenic, 5 = highly comedogenic) with a brief explanation.",
      "suitableSkinTypes": ["Oily", "Dry", "Sensitive", "Combination", "Normal", "Acne-Prone"],
      "solvesProblems": ["Acne", "Dryness", "Dullness", "Hyperpigmentation", "Fine Lines", "Redness"]
    }

    Notes for your response:
    - If you cannot identify the product from the barcode, return a JSON object with productName "Unknown Product" and description "Could not identify product from barcode ${barcode}. Please try another product." and all other fields as empty arrays.
    - If no harmful ingredients are found, return an empty array for "harmfulIngredients".
    - For "suitableSkinTypes", include all types that *could* use this product.
    - For "solvesProblems", include all concerns this product's key ingredients are known to target.
  `;

   try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing product:", error);
    throw new Error("Failed to analyze product. Please try again.");
  }
};