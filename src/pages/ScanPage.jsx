import React, { useState } from 'react';
import ProductScanner from '../components/product/ProductScanner';
import ProductAnalysis from '../components/product/ProductAnalysis';
import { analyzeProduct } from '../services/gemini';
import { useAuth } from '../hooks/useAuth';
import { saveScannedProduct } from '../firebase/firestore';

export default function ScanPage() {
  const { currentUser } = useAuth();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function is passed to ProductScanner
  // It's called with the decoded barcode text
  const handleScanSuccess = async (decodedText) => {
    setIsLoading(true);
    setError(null);
    
    // In a real app, you'd use the barcode (decodedText) to query a database 
    // like Open Food Facts (https://openfoodfacts.org/) to get the product name and ingredient list.
    
    // **--- SIMULATION ---**
    // We will simulate this lookup for now.
    console.log("Scanned Barcode:", decodedText);
    const simulatedProduct = {
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      ingredients: "Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin"
    };
    // **--- END SIMULATION ---**
    
    try {
      // 1. Call Gemini with the product info
      const result = await analyzeProduct(simulatedProduct.name, simulatedProduct.ingredients);
      
      // 2. Save the analysis to Firestore
      await saveScannedProduct(currentUser.uid, result);

      // 3. Set state to display the analysis
      setAnalysisData(result);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-brand-white shadow-lg rounded-lg border border-brand-pink">
      {isLoading ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-brand-pink-dark">Analyzing Product...</h2>
          <p className="text-brand-text-light mt-2">The AI is reading the ingredient list. Please wait.</p>
        </div>
      ) : error ? (
         <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-500">Oops! Something went wrong.</h2>
          <p className="text-brand-text-light mt-2">{error}</p>
          <button 
            onClick={handleReset}
            className="mt-4 bg-brand-pink-dark text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      ) : !analysisData ? (
        <ProductScanner onScanSuccess={handleScanSuccess} />
      ) : (
        <ProductAnalysis analysisData={analysisData} onReset={handleReset} />
      )}
    </div>
  );
}