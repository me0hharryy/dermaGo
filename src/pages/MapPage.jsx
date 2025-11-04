import React, { useState } from 'react';
import RecycleMap from '../components/map/RecycleMap.jsx';
import { TrashIcon, BeakerIcon, MapPinIcon } from '@heroicons/react/24/outline'; // Using outline icons

export default function MapPage() {
  const [searchType, setSearchType] = useState('recycling');

  // New "Segmented Control" Button Component
  const SearchButton = ({ type, currentType, setType, icon: Icon, children }) => {
    const isActive = type === currentType;
    
    return (
      <button
        onClick={() => setType(type)}
        className={`flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-lg font-medium transition-all duration-200
          ${isActive 
            ? 'bg-white text-cyan-700 shadow-md' 
            : 'text-gray-600 hover:bg-gray-200'
          }
        `}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-600' : 'text-gray-500'}`} />
        <span>{children}</span>
      </button>
    );
  };

  return (
    // This is the main white "card" for the page
    <div className="max-w-6xl mx-auto mt-10 p-6 md:p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      
      {/* 1. New Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Explore Local Resources
        </h2>
        <p className="text-lg text-gray-600">
          Find nearby dermatologists, recycling centers, and more.
        </p>
      </div>

      {/* 2. New Segmented Control for Filters */}
      <div className="max-w-xl mx-auto flex space-x-2 p-1.5 bg-gray-100 rounded-lg">
        <SearchButton 
          type="recycling" 
          currentType={searchType} 
          setType={setSearchType} 
          icon={TrashIcon}
        >
          Recycle Centers
        </SearchButton>
        <SearchButton 
          type="dermatologist" 
          currentType={searchType} 
          setType={setSearchType} 
          icon={BeakerIcon}
        >
          Dermatologists
        </SearchButton>
        <SearchButton 
          type="dumping" 
          currentType={searchType} 
          setType={setSearchType} 
          icon={MapPinIcon}
        >
          Dumping Places
        </SearchButton>
      </div>

      {/* 3. The Map (with a clean top margin) */}
      <div className="mt-8">
        <RecycleMap searchType={searchType} />
      </div>
    </div>
  );
}