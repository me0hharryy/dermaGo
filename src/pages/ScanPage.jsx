import React, { useState } from 'react';
import ProductScanner from '../components/product/ProductScanner';
import ProductAnalysis from '../components/product/ProductAnalysis';
import { analyzeProduct } from '../services/gemini'; // This function is now updated
import { useAuth } from '../hooks/useAuth';
import { saveScannedProduct } from '../firebase/firestore';

export default function ScanPage() {
  const { currentUser } = useAuth();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * --- THIS IS THE UPDATED FUNCTION ---
   * It's called with the real barcode text from the scanner.
   */
  const handleScanSuccess = async (decodedText) => {
    setIsLoading(true);
    setError(null);
    
    console.log("Scanned Barcode:", decodedText);
    
    try {
      // --- THE SIMULATION IS REMOVED ---
      // We no longer simulate. We pass the *real barcode*
      // to the AI for analysis.
      const result = await analyzeProduct(decodedText); 
      // --- END OF FIX ---

      // 2. Save the analysis to Firestore (if the user is logged in)
      if (currentUser?.uid && result.productName !== "Unknown Product") {
        await saveScannedProduct(currentUser.uid, result);
      }

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
    <div className="max-w-2xl mx-auto mt-10 p-6 md:p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      {isLoading ? (
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold text-cyan-600">Analyzing Product...</h2>
          <p className="text-gray-600 mt-2">The AI is identifying the product from its barcode. Please wait.</p>
        </div>
      ) : error ? (
         <div className="text-center p-8">
          <h2 className="text-2xl font-semibold text-red-500">Oops! Something went wrong.</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={handleReset}
            className="mt-6 bg-cyan-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-cyan-700"
          >
            Try Again
          </button>
        </div>
      ) : !analysisData ? (
        // Pass the handleReset function to the scanner for its "Cancel" button
        <ProductScanner onScanSuccess={handleScanSuccess} onReset={handleReset} />
      ) : (
        <ProductAnalysis analysisData={analysisData} onReset={handleReset} />
      )}
    </div>
  );
}