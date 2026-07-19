import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FaEnvelope, FaUser, FaInfoCircle, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError('Please fill in all required fields.');
      return;
    }
    if (message.length < 10) {
      setError('Message must be at least 10 characters long.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/contact', { name, email, subject, message });
      setSuccess(res.data.message || 'Feedback submitted successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Submission failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-sports-blue">Inquiries</span>
        <h2 className="text-3xl font-black text-sports-navy font-display tracking-tight mt-1">Contact Operations Control</h2>
        <p className="text-sm text-sports-muted font-light mt-1 max-w-lg mx-auto">
          For technical stadium inquiries, logistics requests, or vendor details, submit an operational ticket.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-8 shadow-premium border border-slate-100"
      >
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-150 p-4 text-xs font-semibold text-sports-success leading-relaxed">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-150 p-4 text-xs font-semibold text-sports-danger leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  placeholder="e.g. John Doe"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-sports-navy focus:bg-white focus:outline-none focus:border-sports-blue transition-colors"
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
                  placeholder="e.g. name@fifa.com"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-sports-navy focus:bg-white focus:outline-none focus:border-sports-blue transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Subject / Reference</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sports-muted">
                <FaInfoCircle className="text-sm" />
              </span>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Wheelchair access elevator check"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-sports-navy focus:bg-white focus:outline-none focus:border-sports-blue transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sports-navy uppercase tracking-wider mb-2">Message Content</label>
            <textarea
              required
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide a detailed description of your request or issue..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-sports-navy focus:bg-white focus:outline-none focus:border-sports-blue transition-colors h-32 resize-none"
            />
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
                <span>Submit Ticket</span>
                <FaPaperPlane className="text-xs" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
