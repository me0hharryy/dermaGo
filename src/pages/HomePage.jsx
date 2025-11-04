import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SparklesIcon, CameraIcon, MapIcon } from '@heroicons/react/24/outline'; // Using outline icons

export default function HomePage() {
  const { currentUser } = useAuth();
  const linkBase = currentUser ? '' : '/login';

  const FeatureCard = ({ to, icon: Icon, title, children }) => (
    <Link
      to={to}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-cyan-100 hover:border-cyan-300 transition-all duration-300 group"
    >
      <Icon className="w-12 h-12 text-cyan-500 group-hover:scale-110 transition-transform" />
      <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">{title}</h2>
      <p className="text-gray-600">{children}</p>
    </Link>
  );

  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
        Smarter Skincare Starts Here.
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Welcome to DermatGo, your personal AI-powered assistant for a healthier, happier skin.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard
          to={`${linkBase || '/quiz'}`}
          icon={SparklesIcon}
          title="AI Routine Builder"
        >
          Fill out our quiz and let AI build a personalized daily skincare routine just for you.
        </FeatureCard>

        <FeatureCard
          to={`${linkBase || '/scanner'}`}
          icon={CameraIcon}
          title="Product Analyzer"
        >
          Scan any product's barcode to get a full, easy-to-understand analysis of its ingredients.
        </FeatureCard>

        <FeatureCard
          to={`${linkBase || '/map'}`}
          icon={MapIcon}
          title="Eco-Friendly Map"
        >
          Find locations near you to recycle your empty cosmetic containers and find dermatologists.
        </FeatureCard>
      </div>
    </div>
  );
}