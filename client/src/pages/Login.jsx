import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { FaEnvelope, FaLock, FaTrophy, FaArrowRight, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const { login, isAuthenticated, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || '/';
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Auth success is handled by useEffect
    } catch (err) {
      setError(err.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for quick logging in
  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError('');
    try {
      if (role === 'admin') {
        await login('admin@fifa.com', 'admin123');
      } else {
        await login('user@fifa.com', 'user123');
      }
    } catch (err) {
      setError('Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(h-screen-16)] items-center justify-center bg-sports-grayBg px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-premium border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-full bg-sports-navy p-3 text-white shadow-premium">
            <FaTrophy className="text-xl text-sports-blueLight" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-sports-navy">Log in to operations</h2>
          <p className="mt-1 text-xs text-sports-muted">Enter credentials or select quick-access profiles</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-4 text-xs text-sports-danger font-medium leading-relaxed" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sports-muted">
                <FaEnvelope className="text-sm" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@fifa.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-sports-navy focus:bg-white transition-colors focus:border-sports-blue focus:ring-2 focus:ring-sports-blueLight focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sports-muted">
                <FaLock className="text-sm" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-sports-navy focus:bg-white transition-colors focus:border-sports-blue focus:ring-2 focus:ring-sports-blueLight focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-label="Sign In"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sports-blue py-3 font-semibold text-white hover:bg-sports-blueLight transition-all disabled:opacity-50 shadow-premium focus:ring-2 focus:ring-sports-blueLight focus:outline-none"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <span>Sign In</span>
                <FaSignInAlt className="text-xs" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <span className="relative bg-white px-3 text-[10px] font-bold text-sports-muted tracking-wider uppercase">Demo Quick Access</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleQuickLogin('user')}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-sports-navy hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-sports-blueLight focus:outline-none"
          >
            <span>Fan Profile</span>
            <FaArrowRight className="text-[10px] text-sports-blueLight" />
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-sports-navy hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-sports-blueLight focus:outline-none"
          >
            <span>Admin Panel</span>
            <FaArrowRight className="text-[10px] text-sports-blueLight" />
          </button>
        </div>

        <div className="text-center text-xs">
          <span className="text-sports-muted">Don't have an account? </span>
          <Link to="/register" className="font-semibold text-sports-blue hover:text-sports-blueLight transition-colors focus:ring-2 focus:ring-sports-blueLight focus:outline-none rounded px-1">
            Register Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
