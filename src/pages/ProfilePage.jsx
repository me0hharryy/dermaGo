import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSavedRoutines, getSavedProducts } from '../firebase/firestore';
import { handleLogout } from '../firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setLoading(true);
        const [routinesData, productsData] = await Promise.all([
          getSavedRoutines(currentUser.uid),
          getSavedProducts(currentUser.uid)
        ]);
        setRoutines(routinesData);
        setProducts(productsData);
        setLoading(false);
      };
      fetchData();
    }
  }, [currentUser]);

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  if (!currentUser) return null; // Should be handled by ProtectedRoute, but good practice

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-brand-white shadow-lg rounded-lg border border-brand-pink">
      <h2 className="text-3xl font-bold text-center text-brand-pink-dark mb-6">
        My Profile
      </h2>
      <div className="space-y-4 mb-8">
        <p className="text-lg">
          <strong className="text-brand-text-light">Email:</strong> {currentUser.email}
        </p>
        <p className="text-lg">
          <strong className="text-brand-text-light">User ID:</strong> <span className="text-sm break-all">{currentUser.uid}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Saved Routines */}
        <div>
          <h3 className="text-2xl font-semibold text-brand-pink-dark mb-4">My Saved Routines</h3>
          {loading ? (
            <p className="text-brand-text-light">Loading routines...</p>
          ) : routines.length === 0 ? (
            <p className="text-brand-text-light">You have no saved routines. Go to the <Link to="/quiz" className="text-brand-pink-dark hover:underline">Routine AI</Link> page to create one!</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {routines.map((routine) => (
                <div key={routine.id} className="p-4 border border-brand-pink rounded-lg bg-brand-pink-light">
                  <h4 className="font-semibold text-brand-text">Routine from {routine.createdAt.toDate().toLocaleDateString()}</h4>
                  {/* You would expand this to show the routine details */}
                  <p className="text-sm text-brand-text-light whitespace-pre-wrap">{routine.am.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Products */}
        <div>
          <h3 className="text-2xl font-semibold text-brand-pink-dark mb-4">My Saved Products</h3>
          {loading ? (
            <p className="text-brand-text-light">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-brand-text-light">You have no saved products. Go to the <Link to="/scanner" className="text-brand-pink-dark hover:underline">Scan Product</Link> page to add one!</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {products.map((product) => (
                <div key={product.id} className="p-4 border border-brand-pink rounded-lg bg-brand-pink-light">
                  <h4 className="font-semibold text-brand-text">{product.productName || 'Scanned Product'}</h4>
                  <p className="text-sm text-brand-text-light">Scanned on {product.scannedAt.toDate().toLocaleDateString()}</p>
                  <p className="text-sm text-brand-text-light">{product.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full mt-10 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}