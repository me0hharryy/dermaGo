import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function ProductAnalysis({ analysisData, onReset }) {
  const { 
    productName, 
    description, 
    harmfulIngredients, 
    comedogenicity, 
    suitableSkinTypes, 
    solvesProblems 
  } = analysisData;

  // New "Pill" Tag component
  const Tag = ({ text }) => (
    <span className="bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
      {text}
    </span>
  );

  // New Section component for consistency
  const AnalysisSection = ({ title, children }) => (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="mt-6 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{productName}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="space-y-4">
        
        <AnalysisSection title="Comedogenicity (Clog-Poring)">
          <p className="text-gray-600">{comedogenicity}</p>
        </AnalysisSection>

        <AnalysisSection title="Potential Irritants">
          {harmfulIngredients && harmfulIngredients.length > 0 ? (
            <ul className="space-y-2">
              {harmfulIngredients.map((item, index) => (
                <li key={index} className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">
                    <strong className="text-red-600">{item.name}:</strong> {item.reason}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-gray-600">No common harmful ingredients or irritants found.</p>
            </div>
          )}
        </AnalysisSection>
        
        <AnalysisSection title="Good for These Skin Types">
          <div className="flex flex-wrap">
            {suitableSkinTypes.map((type) => <Tag key={type} text={type} />)}
          </div>
        </AnalysisSection>
        
        <AnalysisSection title="Helps With These Concerns">
          <div className="flex flex-wrap">
            {solvesProblems.map((problem) => <Tag key={problem} text={problem} />)}
          </div>
        </AnalysisSection>
      </div>
      
      <p className="text-center text-gray-500 mt-8 text-sm">
        This AI analysis has been saved to your profile.
      </p>

      <button 
        onClick={onReset}
        className="w-full mt-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
      >
        Scan Another Product
      </button>
    </div>
  );
}