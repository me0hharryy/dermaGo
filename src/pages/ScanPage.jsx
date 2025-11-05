import React, { useState } from 'react';
import ProductAnalysis from '../components/product/ProductAnalysis';
import { analyzeProduct } from '../services/gemini';
import { useAuth } from '../hooks/useAuth';
import { saveScannedProduct } from '../firebase/firestore';
import { useForm } from 'react-hook-form';
import { PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Updated icons


/**
 * New component for image upload and product details input.
 */
function ImageUploadForm({ onAnalyzeSubmit }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const selectedFile = watch('image'); // Watch the file input for preview

  const fileReader = new FileReader();

  const handleFormSubmit = (data) => {
    const file = data.image[0];
    
    if (!file) return;

    fileReader.onload = () => {
      // FileReader result contains the Data URL (base64 string)
      const base64Image = fileReader.result.split(',')[1];
      
      onAnalyzeSubmit({
        productName: data.productName,
        base64Image: base64Image,
        mimeType: file.type,
      });
    };

    fileReader.onerror = (error) => {
      console.error("File reading error:", error);
      // You might want to display an error to the user here
    };

    fileReader.readAsDataURL(file);
  };
  
  const previewUrl = selectedFile && selectedFile.length > 0 ? URL.createObjectURL(selectedFile[0]) : null;

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Analyze Product from Image</h2>
      <p className="text-center text-gray-600 mb-6">
        Upload a clear image of the <b>ingredient list</b> and <b>product name</b> for AI analysis.
      </p>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Product Name Input */}
        <div>
          <label htmlFor="productName" className="block text-gray-600 mb-1 font-medium">Product Name</label>
          <input
            id="productName"
            {...register('productName', { required: 'Product Name is required' })}
            type="text"
            placeholder="e.g., CeraVe Moisturizing Cream"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
        </div>

        {/* Image Upload Area */}
        <div>
          <label className="block text-gray-600 mb-1 font-medium">Ingredient Label Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            {previewUrl ? (
              <div className="space-y-4 w-full">
                <img src={previewUrl} alt="Ingredient Label Preview" className="max-h-64 w-auto mx-auto rounded-md shadow-lg object-contain" />
                <button 
                  type="button" 
                  onClick={() => setValue('image', undefined)}
                  className="w-full flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-800"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-1" /> Change Image
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*"
                      {...register('image', { required: 'An image is required' })} 
                      className="sr-only" 
                    />
                  </label>
                  <p className="pl-1">of the ingredient label</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, or JPEG up to 10MB</p>
              </div>
            )}
          </div>
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
        >
          Analyze Product
        </button>
      </form>
    </div>
  );
}

export default function ScanPage() {
  const { currentUser } = useAuth();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles the analysis submission.
   * @param {object} data - Contains productName, base64Image, and mimeType.
   */
  const handleAnalyzeSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    console.log("Analyzing Product from image:", data.productName);
    
    try {
      const result = await analyzeProduct(data); 

      // 2. Save the analysis to Firestore (if the user is logged in)
      if (currentUser?.uid) {
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
          <p className="text-gray-600 mt-2">The AI is reading the ingredients from your image. Please wait.</p>
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
        // Render the new image upload form
        <ImageUploadForm onAnalyzeSubmit={handleAnalyzeSubmit} />
      ) : (
        <ProductAnalysis analysisData={analysisData} onReset={handleReset} />
      )}
    </div>
  );
}