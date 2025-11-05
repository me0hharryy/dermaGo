# DermatGo: Smart Skincare Assistant

**DermatGo** is an AI-powered application designed to help users establish personalized skincare routines, analyze product ingredients using image recognition, and promote eco-friendly disposal of cosmetic packaging. It is built using **React**, **Vite**, **Tailwind CSS**, and integrates **Firebase** for user authentication and data storage, and the **Google Gemini API** for core AI intelligence.

## ✨ Features

DermatGo offers three core features accessible after user authentication:

1.  **AI Routine Builder (`/quiz`)**
    * **Personalized Routine:** Users complete a multi-step quiz on their skin type, concerns, and lifestyle.
    * **Gemini Generation:** The AI processes this information to create a customized AM and PM skincare routine.
    * **Detailed Steps:** Each step includes a specific product type recommendation (e.g., "Gentle Hydrating Cleanser with Ceramides") and a rationale for why it's recommended.
    * **Pro Tip:** Provides a highly personalized general skincare tip based on quiz answers.
    * **Persistence:** Routines are saved to the user's Firestore profile and can be viewed later.

2.  **Product Analyzer (`/scanner`)**
    * **Multimodal Analysis:** Users upload an image of a product's ingredient label and provide the product name.
    * **Gemini OCR & Analysis:** Gemini uses multimodal capabilities to read the ingredient list from the image and performs a detailed analysis.
    * **Key Metrics:** Provides analysis on potential harmful ingredients, comedogenicity (pore-clogging rating), suitable skin types, and skin concerns the product targets.
    * **Persistence:** Analyses are saved to the user's Firestore profile and can be reviewed.

3.  **Eco-Friendly Map (`/map`)**
    * **Resource Location:** Uses the Google Maps API to help users locate nearby facilities.
    * **Search Types:** Find local **Recycle Centers** for proper disposal of containers, or **Dermatologists** for professional consultations.

## 🛠️ Technology Stack

* **Frontend:** React (with functional components and hooks), Vite, Tailwind CSS (for modern, responsive styling).
* **Backend & Database:** Google Firebase (Authentication and Firestore).
* **AI Engine:** Google Gemini API (via `gemini-flash-latest`) for routine generation and multimodal ingredient analysis.
* **Mapping:** `@react-google-maps/api`

## 🚀 Setup and Installation

### Prerequisites

You must have Node.js and npm installed.

1.  **Clone the repository:**
    ```
    git clone [repository-url]
    cd dermago
    ```

2.  **Install dependencies:**
    ```
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in your project root and add your API keys.

    ```
    # Firebase Configuration (Required for Auth & Firestore)
    VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
    VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"

    # Google Gemini API Key (Required for AI features)
    VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

    # Google Maps API Key (Required for Recycle Map)
    VITE_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
    ```
    *Note: The hardcoded key in `src/firebase/config.js` should be replaced with your actual Firebase configuration.*

### Running the Project

To run the app in development mode:
  npm run dev
