import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

/**
 * A helper function to parse the AI's string response into a structured array.
 * It assumes the format: "1. Cleanser: [Product Type] - [Reason]"
 */
const parseRoutineString = (routineString) => {
  if (!routineString) return [];
  
  return routineString.split('\n').map((line, index) => {
    // Regex to capture: 1. (Step): (Product) - (Reason)
    const match = line.match(/(\d+)\.\s*[^:]+:\s*(.*?)\s*-\s*(.*)/);
    
    if (match) {
      return {
        number: match[1],
        title: match[2].trim(), // e.g., "Gentle hydrating cleanser"
        description: match[3].trim(), // e.g., "To remove..."
      };
    }
    
    // Fallback for any line that doesn't match the complex format
    return {
      number: index + 1,
      title: line.replace(/^\d+\.\s*/, ''), // Remove leading "1. "
      description: ""
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
      
      {/* The Step Content */}
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold text-gray-800">{step.title}</h4>
        {step.description && (
          <p className="text-gray-600">{step.description}</p>
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

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Your Custom AI Routine</h2>
      <p className="text-center text-gray-600 mb-10">
        Congratulations! Here is your personalized plan. This routine has been saved to your profile.
      </p>
      
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