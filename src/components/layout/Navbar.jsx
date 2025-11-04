import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { 
  SparklesIcon, 
  UserCircleIcon, 
  MapIcon, 
  CameraIcon, 
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon, // CORRECTED: This is the icon for "Login"
  ArrowRightOnRectangleIcon, // CORRECTRCD: This is the icon for "Logout"
  UserPlusIcon 
} from '@heroicons/react/24/outline'; // Using outline icons for a lighter feel

/**
 * A reusable NavLink component for a consistent, artistic look.
 * This creates the "glass" button effect.
 */
const NavLink = ({ to, icon: Icon, children }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-4 py-2 rounded-lg 
               text-gray-700 font-medium
               hover:bg-cyan-50 hover:text-cyan-700
               transition-all duration-200"
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </Link>
);

/**
 * The main, redesigned Navbar
 */
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
    <nav className="bg-white/95 backdrop-blur-lg shadow-sm w-full p-4 sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* --- 1. Artistic Logo --- */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 p-2 rounded-lg shadow">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">
            DermatGo
          </span>
        </Link>
        
        {/* --- 2. Main Navigation & Auth --- */}
        <div className="flex items-center space-x-2">
          {currentUser ? (
            <>
              {/* --- Logged-in Navigation --- */}
              <div className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                <NavLink to="/quiz" icon={SparklesIcon}>Routine AI</NavLink>
                <NavLink to="/scanner" icon={CameraIcon}>Scan Product</NavLink>
                <NavLink to="/map" icon={MapIcon}>Recycle Map</NavLink>
              </div>

              {/* --- Logged-in User Actions --- */}
              <NavLink to="/profile" icon={UserCircleIcon}>Profile</NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                           text-gray-700 font-medium bg-gray-100
                           hover:bg-gray-200 hover:text-gray-900
                           transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" /> {/* CORRECTED ICON */}
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* --- Guest Actions --- */}
              <Link 
                to="/login" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                           text-gray-700 font-medium
                           hover:bg-gray-100
                           transition-all duration-200"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" /> {/* CORRECTED ICON */}
                <span>Login</span>
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                           bg-cyan-600 text-white font-semibold
                           hover:bg-cyan-700
                           transition-all duration-200"
              >
                <UserPlusIcon className="w-5 h-5" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}