import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { currentUser } = useAuth();
  const linkBase = currentUser ? '' : '/login';

  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-brand-pink-dark mb-4">
        Welcome to DermatGo
      </h1>
      <p className="text-xl text-brand-text-light mb-12">
        Your personal AI-powered skincare assistant.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        
        <Link 
          to={`${linkBase || '/quiz'}`}
          className="bg-brand-white p-8 rounded-lg shadow-lg border-2 border-brand-pink hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold text-brand-pink-dark mb-3">Get Your Routine</h2>
          <p className="text-brand-text-light">Fill out our quiz and let AI build your perfect daily skincare routine.</p>
        </Link>
        
        <Link 
          to={`${linkBase || '/scanner'}`}
          className="bg-brand-white p-8 rounded-lg shadow-lg border-2 border-brand-pink hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold text-brand-pink-dark mb-3">Scan a Product</h2>
          <p className="text-brand-text-light">Scan any product's barcode to get a full analysis of its ingredients.</p>
        </Link>
        
        <Link 
          to={`${linkBase || '/map'}`}
          className="bg-brand-white p-8 rounded-lg shadow-lg border-2 border-brand-pink hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold text-brand-pink-dark mb-3">Recycle Map</h2>
          <p className="text-brand-text-light">Find locations near you to recycle your empty cosmetic containers.</p>
        </Link>
        
      </div>
    </div>
  );
}