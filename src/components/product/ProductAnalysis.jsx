import React from 'react';

export default function ProductAnalysis({ analysisData, onReset }) {
  const { 
    productName, 
    description, 
    harmfulIngredients, 
    comedogenicity, 
    suitableSkinTypes, 
    solvesProblems 
  } = analysisData;

  const Tag = ({ text }) => (
    <span className="bg-brand-pink-light border border-brand-pink text-brand-text text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded">
      {text}
    </span>
  );

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-brand-pink-dark mb-2">{productName}</h2>
      <p className="text-brand-text-light mb-6">{description}</p>
      
      <div className="space-y-6">
        {/* Comedogenicity */}
        <div>
          <h4 className="text-lg font-semibold text-brand-text mb-2">Comedogenicity (Clog-Poring)</h4>
          <p className="text-brand-text-light">{comedogenicity}</p>
        </div>

        {/* Harmful Ingredients */}
        <div>
          <h4 className="text-lg font-semibold text-brand-text mb-2">Potential Irritants</h4>
          {harmfulIngredients && harmfulIngredients.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {harmfulIngredients.map((item, index) => (
                <li key={index} className="text-brand-text-light">
                  <strong className="text-red-500">{item.name}:</strong> {item.reason}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-text-light">✅ No common harmful ingredients or irritants found.</p>
          )}
        </div>
        
        {/* Suitable Skin Types */}
        <div>
          <h4 className="text-lg font-semibold text-brand-text mb-2">Good for These Skin Types</h4>
          <div className="flex flex-wrap">
            {suitableSkinTypes.map((type) => <Tag key={type} text={type} />)}
          </div>
        </div>
        
        {/* Solves Problems */}
        <div>
          <h4 className="text-lg font-semibold text-brand-text mb-2">Helps With These Concerns</h4>
          <div className="flex flex-wrap">
            {solvesProblems.map((problem) => <Tag key={problem} text={problem} />)}
          </div>
        </div>
      </div>
      
      <p className="text-center text-brand-text-light mt-6 text-sm">
        This analysis is AI-generated and saved to your profile.
      </p>

      <button 
        onClick={onReset}
        className="w-full mt-6 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
      >
        Scan Another Product
      </button>
    </div>
  );
}