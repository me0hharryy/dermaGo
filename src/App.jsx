import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import ScanPage from './pages/ScanPage';
import MapPage from './pages/MapPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
          />
          <Route 
            path="/quiz" 
            element={<ProtectedRoute><QuizPage /></ProtectedRoute>} 
          />
          <Route 
            path="/scanner" 
            element={<ProtectedRoute><ScanPage /></ProtectedRoute>} 
          />
          <Route 
            path="/map" 
            element={<ProtectedRoute><MapPage /></ProtectedRoute>} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App