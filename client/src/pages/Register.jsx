import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaLock, FaTrophy, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
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
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-sports-navy">Create Account</h2>
          <p className="mt-1 text-xs text-sports-muted">Register as a Fan or Stadium Administrator</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-4 text-xs text-sports-danger font-medium leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sports-muted">
                <FaUser className="text-sm" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cristiano Ronaldo"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-sports-navy focus:bg-white transition-colors focus:border-sports-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sports-muted">
                <FaEnvelope className="text-sm" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@fifa.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-sports-navy focus:bg-white transition-colors focus:border-sports-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Role Profile</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-sports-navy focus:bg-white focus:border-sports-blue"
            >
              <option value="user">FIFA Football Fan</option>
              <option value="admin">Stadium Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sports-muted">
                <FaLock className="text-sm" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-sports-navy focus:bg-white transition-colors focus:border-sports-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sports-muted">
                <FaLock className="text-sm" />
              </span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-sports-navy focus:bg-white transition-colors focus:border-sports-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sports-blue py-3 font-semibold text-white hover:bg-sports-blueLight transition-all disabled:opacity-50 shadow-premium"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <span>Register</span>
                <FaUserPlus className="text-xs" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-sports-muted">Already have an account? </span>
          <Link to="/login" className="font-semibold text-sports-blue hover:text-sports-blueLight transition-colors">
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
