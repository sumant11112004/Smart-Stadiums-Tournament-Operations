import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Page Views
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AIAssistant from './pages/AIAssistant';
import CrowdHeatmap from './pages/CrowdHeatmap';
import QueuePrediction from './pages/QueuePrediction';
import EmergencyDashboard from './pages/EmergencyDashboard';
import MatchCompanion from './pages/MatchCompanion';
import SmartTransport from './pages/SmartTransport';
import Sustainability from './pages/Sustainability';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import CommandCenter from './pages/CommandCenter';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-sports-grayBg text-sports-navy font-sans">
          {/* Main Navigation */}
          <Navbar />

          {/* Active Page View Container */}
          <main className="flex-1 w-full">
            <Routes>
              {/* Public Views */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/command-center" element={<CommandCenter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/heatmap" element={<CrowdHeatmap />} />
              <Route path="/queues" element={<QueuePrediction />} />
              <Route path="/emergency" element={<EmergencyDashboard />} />
              <Route path="/companion" element={<MatchCompanion />} />
              <Route path="/transport" element={<SmartTransport />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Administrator Dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>

          {/* Site Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
