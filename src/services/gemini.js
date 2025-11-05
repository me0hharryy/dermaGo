import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI model
const API_KEY = "AIzaSyBB7TyszktjRoopl7-uy7bi1Kz5D3PFTWc";
const genAI = new GoogleGenerativeAI(API_KEY);

// The model is initialized to return JSON by default
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

/**
 * Helper function to convert a Base64 string into a GenerativePart object.
 */
const imageToGenerativePart = (base64Image, mimeType) => {
  return {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };
};

/**
 * Generates a skincare routine based on quiz data.
 */
export const generateRoutine = async (quizData) => {
  // ... (Your existing generateRoutine function - content unchanged)
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
    
    For each step, include:
    1. The name of the step (e.g., Cleanser).
    2. The *recommended product type* (e.g., "Gentle Hydrating Cleanser with Ceramides").
    3. A detailed explanation of *why* this product type is essential and how it addresses the user's specific skin type/concerns.
    
    Format your response *exactly* as a JSON object, like this:
    {
      "am": "1. Cleanser: [Product Recommendation Type] - [Detailed Reason]\\n2. Step Two: [Product Recommendation Type] - [Detailed Reason]",
      "pm": "1. Cleanser: [Product Recommendation Type] - [Detailed Reason]\\n2. Step Two: [Product Recommendation Type] - [Detailed Reason]",
      "tip": "A single, highly personalized, and actionable general skincare tip based on their quiz answers (e.g., for sunscreen, water intake, or exfoliation)."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating routine:", error);
    throw new Error("Failed to analyze product. Please try again.");
  }
};

/**
 * --- UPDATED FUNCTION FOR MULTIMODAL INPUT ---
 * Analyzes a product based on its name and an image of its ingredient list.
 * @param {object} productDetails - Object containing productName, base64Image, and mimeType.
 * @returns {object} An analysis object.
 */
export const analyzeProduct = async (productDetails) => {
  const { productName, base64Image, mimeType } = productDetails;

  const textPrompt = `
    You are a cosmetic chemist AI. A user wants an analysis of a product named: ${productName}.
    
    Your primary task is to use the attached image of the product's label to accurately read the FULL ingredient list.
    
    After extracting the ingredients, provide a full analysis of that product in the following *exact* JSON format:
    {
      "productName": "${productName}",
      "description": "A brief, neutral description of what this product does based on its ingredients.",
      "harmfulIngredients": [
        { "name": "Ingredient Name", "reason": "Why it's potentially harmful (e.g., common irritant, paraben, etc.)" }
      ],
      "comedogenicity": "A rating from 0-5 (0 = non-comedogenic, 5 = highly comedogenic) with a brief explanation.",
      "suitableSkinTypes": ["Oily", "Dry", "Sensitive", "Combination", "Normal", "Acne-Prone"],
      "solvesProblems": ["Acne", "Dryness", "Dullness", "Hyperpigmentation", "Fine Lines", "Redness"]
    }

    Notes for your response:
    - If you cannot clearly read the ingredient list from the image, set the description to "Analysis limited as ingredients could not be fully read from the image." and use empty arrays/generic responses for fields that cannot be accurately determined.
    - If no harmful ingredients are found, return an empty array for "harmfulIngredients".
  `;
  
  // Construct the parts array for multimodal input
  const imagePart = imageToGenerativePart(base64Image, mimeType);
  const parts = [imagePart, { text: textPrompt }];

  try {
    // Send the multimodal content to Gemini
    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing product:", error);
    throw new Error("Failed to analyze product. Please ensure the image is clear and try again.");
  }
};