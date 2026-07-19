import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading views for client-side routing optimization (Efficiency)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const CrowdHeatmap = lazy(() => import('./pages/CrowdHeatmap'));
const QueuePrediction = lazy(() => import('./pages/QueuePrediction'));
const EmergencyDashboard = lazy(() => import('./pages/EmergencyDashboard'));
const MatchCompanion = lazy(() => import('./pages/MatchCompanion'));
const SmartTransport = lazy(() => import('./pages/SmartTransport'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CommandCenter = lazy(() => import('./pages/CommandCenter'));

// Fallback Loader Spinner
const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]" aria-live="polite" aria-busy="true">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sports-blue"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen bg-sports-grayBg text-sports-navy font-sans">
            {/* Main Navigation */}
            <Navbar />

            {/* Active Page View Container */}
            <main className="flex-1 w-full">
              <Suspense fallback={<Loader />}>
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
              </Suspense>
            </main>

            {/* Site Footer */}
            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
