import React from 'react';
import { SunIcon, MoonIcon, LightBulbIcon } from '@heroicons/react/24/solid';

/**
 * A helper function to parse the AI's string response into a structured array.
 * It uses string manipulation to reliably find the LAST ' - ' separator, 
 * even if the product name contains hyphens.
 */
const parseRoutineString = (routineString) => {
  if (!routineString) return [];
  
  return routineString.split('\n').map((line, index) => {
    // 1. Extract the step number
    const numberMatch = line.match(/^(\d+)\.\s*/);
    const number = numberMatch ? numberMatch[1] : index + 1;
    let content = line.replace(numberMatch ? numberMatch[0] : '', '').trim();

    // 2. Separate Step Title from Product/Reason block at the first colon
    const firstColonIndex = content.indexOf(':');
    if (firstColonIndex === -1) {
      // Fallback if format is entirely wrong
       return { number, stepTitle: "Skincare Step", product: content, reason: "Check routine format." };
    }

    const stepTitle = content.substring(0, firstColonIndex).trim();
    const productAndReason = content.substring(firstColonIndex + 1).trim();

    // 3. Find the LAST " - " to split the Product from the Reason (the critical fix)
    const lastSeparator = " - ";
    const lastSeparatorIndex = productAndReason.lastIndexOf(lastSeparator);

    if (lastSeparatorIndex === -1) {
      // Fallback if separator is missing
      return { number, stepTitle, product: productAndReason, reason: "Missing detailed rationale." };
    }

    const product = productAndReason.substring(0, lastSeparatorIndex).trim();
    const reason = productAndReason.substring(lastSeparatorIndex + lastSeparator.length).trim();
    
    return {
        number,
        stepTitle,
        product,
        reason,
    };
  });
};

/**
 * A sub-component to render a single step in the timeline.
 */
const RoutineStep = ({ step, color }) => {
  const colorClasses = {
    cyan: {
      bg: 'bg-cyan-100',
      text: 'text-cyan-700',
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
    }
  };
  const colors = colorClasses[color] || colorClasses.cyan;

  return (
    <li className="mb-8 ml-10"> {/* Margin-left creates space for the icon */}
      {/* The Step Number Circle */}
      <span 
        className={`absolute -left-5 flex items-center justify-center w-10 h-10 ${colors.bg} rounded-full text-lg ${colors.text} font-bold`}
      >
        {step.number}
      </span>
      
      {/* The Step Content - IMPROVED BLOCK FORMATTING */}
      <div className="flex flex-col">
        {/* Step Title as a subtle label */}
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-0.5">{step.stepTitle}</h4> 
        
        {/* Highlighted Product Recommendation - Primary Focus */}
        <p className="text-lg font-bold text-cyan-700 mb-3"> 
            {step.product}
        </p> 
        
        {/* Detailed Reason - Now in a separate visual block with an explicit Rationale title */}
        {step.reason && (
          <div className="bg-gray-100 p-3 rounded-md border border-gray-200 mt-1">
            <p className="text-sm font-bold text-gray-800 mb-1">Rationale</p>
            <p className="text-sm text-gray-700 leading-snug">{step.reason}</p>
          </div>
        )}
      </div>
    </li>
  );
};

/**
 * The Main Routine Display Component
 */
export default function RoutineDisplay({ routineData, onReset }) {
  const amSteps = parseRoutineString(routineData.am);
  const pmSteps = parseRoutineString(routineData.pm);
  const personalizedTip = routineData.tip;

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Your Custom AI Routine</h2>
      <p className="text-center text-gray-600 mb-10">
        Congratulations! Here is your personalized plan. This routine has been saved to your profile.
      </p>
      
      {/* Personalized Tip Section */}
      {personalizedTip && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-10 shadow-md rounded-lg flex items-start space-x-3">
          <LightBulbIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Pro Tip</h3>
            <p className="text-gray-700">{personalizedTip}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* AM Routine Card */}
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
          <h3 className="text-3xl font-bold text-gray-800 flex items-center mb-8">
            <SunIcon className="w-10 h-10 text-yellow-500 mr-4" />
            <span>AM Routine</span>
          </h3>
          
          <ol className="relative border-l border-gray-300">
            {amSteps.map((step, index) => (
              <RoutineStep key={`am-${index}`} step={step} color="cyan" />
            ))}
          </ol>
        </div>
        
        {/* PM Routine Card */}
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
          <h3 className="text-3xl font-bold text-gray-800 flex items-center mb-8">
            <MoonIcon className="w-10 h-10 text-indigo-500 mr-4" />
            <span>PM Routine</span>
          </h3>
          
          <ol className="relative border-l border-gray-300">
            {pmSteps.map((step, index) => (
              <RoutineStep key={`pm-${index}`} step={step} color="indigo" />
            ))}
          </ol>
        </div>
      </div>
      
      <p className="text-center text-gray-500 mt-8 text-sm">
        Remember to patch-test new products and introduce them one at a time.
      </p>
      
      <button 
        onClick={onReset}
        className="w-full mt-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
      >
        Start Over
      </button>
    </div>
  );
}