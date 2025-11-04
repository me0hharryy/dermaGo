import React, { useState } from 'react';
import RecycleMap from '../components/map/RecycleMap.jsx'; // Make sure this path is correct

export default function MapPage() {
  // We'll use 'recycling' as the default search type
  const [searchType, setSearchType] = useState('recycling');

  // Helper component for the buttons
  const SearchButton = ({ type, children }) => (
    <button
      onClick={() => setSearchType(type)}
      className={`py-2 px-4 rounded-lg font-semibold transition-colors
        ${searchType === type 
          ? 'bg-brand-pink-dark text-white' 
          : 'bg-gray-200 text-brand-text hover:bg-gray-300'
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-brand-white shadow-lg rounded-lg border border-brand-pink">
      <h2 className="text-3xl font-bold text-center text-brand-pink-dark mb-4">
        Find Local Resources
      </h2>
      <p className="text-center text-brand-text-light mb-6">
        Select a category below to find locations near Chandigarh.
      </p>

      {/* Buttons to change search type */}
      <div className="flex justify-center space-x-4 mb-6">
        <SearchButton type="recycling">♻️ Recycle Places</SearchButton>
        <SearchButton type="dermatologist">⚕️ Dermatologists</SearchButton>
        <SearchButton type="dumping">🗑️ Dumping Places</SearchButton>
      </div>

      {/* Pass the selected searchType to the map component */}
      <RecycleMap searchType={searchType} />
    </div>
  );
}