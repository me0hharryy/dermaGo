import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI model
const API_KEY = "AIzaSyBB7TyszktjRoopl7-uy7bi1Kz5D3PFTWc";
const genAI = new GoogleGenerativeAI(API_KEY);

// This is the new, more robust way to initialize the model
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  // This is the fix: It forces the AI to output *only* valid JSON
  generationConfig: {
    responseMimeType: "application/json",
  },
});

/**
 * Generates a skincare routine based on quiz data.
 * @param {object} quizData - The data from the RoutineQuiz form.
 * @returns {object} An object with 'am' and 'pm' routine strings.
 */
export const generateRoutine = async (quizData) => {
  const prompt = `
    You are a professional dermatologist AI. A user has provided the following information about their skin:
    - Gender: ${quizData.gender}
    - Age: ${quizData.age}
    - Skin Type: ${quizData.skinType.join(', ')}
    - Lifestyle & Habits:
      - Sunlight Exposure: ${quizData.sunlight}
      - Wears Sunscreen: ${quizData.sunscreen}
      - Water Intake: ${quizData.water}
      - Exercise Frequency: ${quizData.exercise}
    - Skin Concerns: ${quizData.concerns.join(', ')}
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
    
    // We no longer need to clean the string, as the API guarantees it's valid JSON
    return JSON.parse(text); // This is where the error *was*
  } catch (error) {
    console.error("Error generating routine:", error);
    throw new Error("Failed to generate AI routine. Please try again.");
  }
};

/**
 * Analyzes a product based on its ingredients.
 * @param {string} productName - The name of the product.
 * @param {string} ingredients - A comma-separated list of ingredients.
 * @returns {object} An analysis object.
 */
export const analyzeProduct = async (productName, ingredients) => {
  const prompt = `
    You are a cosmetic chemist AI. Analyze the following skincare product:
    - Product Name: ${productName}
    - Ingredients: ${ingredients}

    Please provide an analysis in the following *exact* JSON format:
    {
      "productName": "${productName}",
      "description": "A brief, neutral description of what this product likely does based on its ingredients.",
      "harmfulIngredients": [
        { "name": "Ingredient Name", "reason": "Why it's potentially harmful (e.g., common irritant, paraben, etc.)" }
      ],
      "comedogenicity": "A rating from 0-5 (0 = non-comedogenic, 5 = highly comedogenic) with a brief explanation.",
      "suitableSkinTypes": ["Oily", "Dry", "Sensitive", "Combination", "Normal", "Acne-Prone"],
      "solvesProblems": ["Acne", "Dryness", "Dullness", "Hyperpigmentation", "Fine Lines", "Redness"]
    }

    Notes for your response:
    - If no harmful ingredients are found, return an empty array for "harmfulIngredients".
    - For "suitableSkinTypes", include all types that *could* use this product.
    - For "solvesProblems", include all concerns this product's key ingredients are known to target.
  `;

   try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // We no longer need to clean the string
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing product:", error);
    throw new Error("Failed to analyze product. Please try again.");
  }
};