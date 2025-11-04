import React from 'react';
import RecycleMap from '../components/map/RecycleMap';

export default function MapPage() {
  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-brand-white shadow-lg rounded-lg border border-brand-pink">
      <h2 className="text-3xl font-bold text-center text-brand-pink-dark mb-6">Cosmetic Recycle Map</h2>
      <p className="text-center text-brand-text-light mb-6">
        Find locations to recycle your empty cosmetic containers. We're starting with locations in Chandigarh.
      </p>
      <RecycleMap />
    </div>
  );
}