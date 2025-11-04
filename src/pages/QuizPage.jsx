import React, { useState } from 'react';
import RoutineQuiz from '../components/routine/RoutineQuiz';
import RoutineDisplay from '../components/routine/RoutineDisplay';
import { generateRoutine } from '../services/gemini';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile, saveAiRoutine } from '../firebase/firestore';

export default function QuizPage() {
  const { currentUser } = useAuth();
  const [routineData, setRoutineData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function is passed to RoutineQuiz
  // It's called with the form data on submit
  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Save the user's quiz answers to their profile
      await updateUserProfile(currentUser.uid, { quizData: data });
      
      // 2. Call the Gemini API to get the routine
      const result = await generateRoutine(data);
      
      // 3. Save the *new routine* to a subcollection in Firestore
      // We pass the full result (AM/PM) to be saved
      await saveAiRoutine(currentUser.uid, result);

      // 4. Set the routine data to display it
      setRoutineData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRoutineData(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      {isLoading ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-cyan-600">Building your perfect routine...</h2>
          <p className="text-gray-600 mt-2">The AI is thinking. Please wait.</p>
          {/* You could add a spinner component here */}
        </div>
      ) : error ? (
         <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-500">Oops! Something went wrong.</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={handleReset}
            className="mt-4 bg-cyan-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-cyan-700"
          >
            Try Again
          </button>
        </div>
      ) : !routineData ? (
        <RoutineQuiz onQuizSubmit={handleQuizSubmit} />
      ) : (
        <RoutineDisplay routineData={routineData} onReset={handleReset} />
      )}
    </div>
  );
}