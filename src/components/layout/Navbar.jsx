import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { SparklesIcon, UserCircleIcon, MapIcon, CameraIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="bg-brand-white shadow-md w-full p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-brand-pink-dark flex items-center">
          <SparklesIcon className="w-8 h-8 mr-2" />
          DermatGo
        </Link>
        <div className="flex space-x-6 items-center">
          {currentUser ? (
            <>
              <Link to="/quiz" className="flex items-center text-brand-text hover:text-brand-pink-dark">
                <QuestionMarkCircleIcon className="w-5 h-5 mr-1" /> Routine AI
              </Link>
              <Link to="/scanner" className="flex items-center text-brand-text hover:text-brand-pink-dark">
                <CameraIcon className="w-5 h-5 mr-1" /> Scan Product
              </Link>
              <Link to="/map" className="flex items-center text-brand-text hover:text-brand-pink-dark">
                <MapIcon className="w-5 h-5 mr-1" /> Recycle Map
              </Link>
              <Link to="/profile" className="flex items-center text-brand-text hover:text-brand-pink-dark">
                <UserCircleIcon className="w-5 h-5 mr-1" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-brand-text text-white py-2 px-4 rounded-lg hover:bg-opacity-80 transition-opacity"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-brand-text hover:text-brand-pink-dark">Login</Link>
              <Link to="/signup" className="bg-brand-pink-dark text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-opacity">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}