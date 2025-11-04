import React from 'react';

export default function RoutineDisplay({ routineData, onReset }) {
  // Function to format the routine steps
  const formatRoutine = (routineString) => {
    if (!routineString) return null;
    return routineString.split('\n').map((step, index) => (
      <li key={index} className="mb-3">
        {step}
      </li>
    ));
  };

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-center text-brand-pink-dark mb-6">Your Custom AI Routine</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AM Routine */}
        <div className="bg-brand-pink-light p-6 rounded-lg border border-brand-pink">
          <h3 className="text-2xl font-semibold text-brand-pink-dark mb-4">🌞 AM Routine (Morning)</h3>
          <ul className="list-inside list-none space-y-2 text-brand-text">
            {formatRoutine(routineData.am)}
          </ul>
        </div>
        
        {/* PM Routine */}
        <div className="bg-brand-pink-light p-6 rounded-lg border border-brand-pink">
          <h3 className="text-2xl font-semibold text-brand-pink-dark mb-4">🌜 PM Routine (Night)</h3>
          <ul className="list-inside list-none space-y-2 text-brand-text">
            {formatRoutine(routineData.pm)}
          </ul>
        </div>
      </div>
      
      <p className="text-center text-brand-text-light mt-6 text-sm">
        Remember to patch-test new products and introduce them one at a time. This routine is saved to your profile!
      </p>
      
      <button 
        onClick={onReset}
        className="w-full mt-6 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
      >
        Start Over
      </button>
    </div>
  );
}