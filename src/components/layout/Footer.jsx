import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-12 p-6">
      <div className="container mx-auto text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} DermatGo. All rights reserved.</p>
        <p className="text-sm mt-1">Your personal AI skincare assistant.</p>
      </div>
    </footer>
  );
}