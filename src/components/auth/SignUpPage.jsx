import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { handleEmailSignUp, handleGoogleSignIn } from '../../firebase/auth.js';

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [firebaseError, setFirebaseError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setFirebaseError(null);
      await handleEmailSignUp(data.email, data.password);
      navigate('/profile'); // Redirect to profile on success
    } catch (error) {
      setFirebaseError("Failed to create account. This email might already be in use.");
    }
  };

  const onGoogleSignIn = async () => {
    try {
      setFirebaseError(null);
      await handleGoogleSignIn();
      navigate('/profile');
    } catch (error) {
      setFirebaseError("Failed to sign in with Google.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-10 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
      
      {firebaseError && <p className="text-red-500 text-center mb-4">{firebaseError}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-600 mb-1 font-medium">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <label className="block text-gray-600 mb-1 font-medium">Password</label>
          <input
            {...register('password', { 
              required: 'Password is required', 
              minLength: { value: 6, message: 'Password must be at least 6 characters.' } 
            })}
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <button type="submit" className="w-full bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors">
          Sign Up
        </button>
      </form>
      
      <div className="relative text-center my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">or</span>
        </div>
      </div>
      
      <button 
        onClick={onGoogleSignIn}
        className="w-full bg-white text-gray-700 py-2 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
      >
        <img className="w-5 h-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" />
        Sign up with Google
      </button>

      <p className="text-center mt-6 text-gray-600">
        Already have an account? <Link to="/login" className="text-cyan-600 hover:underline font-medium">Login</Link>
      </p>
    </div>
  );
}