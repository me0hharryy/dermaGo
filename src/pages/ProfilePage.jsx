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
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        My Profile
      </h2>
      <div className="space-y-4 mb-8">
        <p className="text-lg text-gray-700">
          <strong className="text-gray-500">Email:</strong> {currentUser.email}
        </p>
        <p className="text-lg text-gray-700">
          <strong className="text-gray-500">User ID:</strong> <span className="text-sm break-all">{currentUser.uid}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Saved Routines */}
        <div>
          <h3 className="text-2xl font-semibold text-cyan-600 mb-4">My Saved Routines</h3>
          {loading ? (
            <p className="text-gray-500">Loading routines...</p>
          ) : routines.length === 0 ? (
            <p className="text-gray-500">You have no saved routines. Go to the <Link to="/quiz" className="text-cyan-600 hover:underline">Routine AI</Link> page to create one!</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {routines.map((routine) => (
                <div key={routine.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-800">Routine from {routine.createdAt.toDate().toLocaleDateString()}</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap mt-2">{routine.am.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Products */}
        <div>
          <h3 className="text-2xl font-semibold text-cyan-600 mb-4">My Saved Products</h3>
          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">You have no saved products. Go to the <Link to="/scanner" className="text-cyan-600 hover:underline">Scan Product</Link> page to add one!</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {products.map((product) => (
                <div key={product.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-800">{product.productName || 'Scanned Product'}</h4>
                  <p className="text-sm text-gray-500">Scanned on {product.scannedAt.toDate().toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 mt-2">{product.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full mt-10 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}