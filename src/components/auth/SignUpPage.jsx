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
    <div className="max-w-md mx-auto mt-10 p-8 bg-brand-white shadow-lg rounded-lg border border-brand-pink">
      <h2 className="text-3xl font-bold text-center text-brand-pink-dark mb-6">Create Your Account</h2>
      
      {firebaseError && <p className="text-red-500 text-center mb-4">{firebaseError}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-brand-text-light mb-1">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <label className="block text-brand-text-light mb-1">Password</label>
          <input
            {...register('password', { 
              required: 'Password is required', 
              minLength: { value: 6, message: 'Password must be at least 6 characters.' } 
            })}
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <button type="submit" className="w-full bg-brand-pink-dark text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Sign Up
        </button>
      </form>
      
      <div className="text-center my-4 text-brand-text-light">or</div>
      
      <button 
        onClick={onGoogleSignIn}
        className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Sign up with Google
      </button>

      <p className="text-center mt-6 text-brand-text">
        Already have an account? <Link to="/login" className="text-brand-pink-dark hover:underline">Login</Link>
      </p>
    </div>
  );
}