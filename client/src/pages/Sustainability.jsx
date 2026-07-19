import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FaLeaf, FaBolt, FaTint, FaTrashAlt, FaCloud, FaChevronRight, FaInfoCircle } from 'react-icons/fa';

const Sustainability = () => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const metrics = [
    {
      title: 'Solar & Renewable Grid',
      icon: FaBolt,
      val: '4.8 MWh',
      trend: '+12% generation',
      desc: 'Off-grid battery storage is currently at 84% charge.',
      progress: 84
    },
    {
      title: 'Water Recovery Loop',
      icon: FaTint,
      val: '3,240 m³',
      trend: '94% recycled',
      desc: 'Pitch irrigation is completely supplied by rainwater loops.',
      progress: 94
    },
    {
      title: 'Waste Sorting Divert',
      icon: FaTrashAlt,
      val: '78.2%',
      trend: '+4% diversion',
      desc: 'Compostable packaging enforced at all concession stalls.',
      progress: 78
    },
    {
      title: 'Carbon Offset Savings',
      icon: FaCloud,
      val: '42.5 Tonnes',
      trend: 'Avoided CO₂',
      desc: 'Spectators using electric transport lines increased by 18%.',
      progress: 68
    }
  ];

  const handleFetchAdvice = async () => {
    setLoading(true);
    setSuggestion('');
    try {
      const res = await api.post('/ai/sustainability', { query: 'Provide immediate, detailed operational suggestions to optimize water, carbon, waste, and solar grids at the arena.' });
      setSuggestion(res.data.response);
    } catch (err) {
      setSuggestion('Could not contact sustainability coordinator. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sports-blue">Green Stadium</span>
          <h2 className="text-3xl font-black text-sports-navy font-display tracking-tight mt-1">Sustainability & Eco-Telemetry</h2>
          <p className="text-sm text-sports-muted font-light mt-1">
            Real-time tracking of resource usage, recycling diversion, and solar generation.
          </p>
        </div>
        <button
          onClick={handleFetchAdvice}
          disabled={loading}
          className="rounded-lg bg-sports-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-sports-navyLight transition-all shadow-premium hover:shadow-premiumHover flex items-center gap-2"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          ) : (
            <>
              <FaLeaf className="text-sports-success" />
              <span>Ask Gemini Eco-Advice</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, idx) => {
          const MIcon = m.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-slate-100 bg-white p-6 shadow-premium flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-sports-navy font-display uppercase tracking-wider">{m.title}</span>
                <div className="rounded-lg bg-green-50 border border-green-100 p-2.5 text-sports-success">
                  <MIcon className="text-sm" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-sports-navy tracking-tight">{m.val}</h3>
                <p className="text-[10px] text-sports-muted font-medium mt-1 leading-relaxed">{m.desc}</p>
              </div>

              {/* Progress bar */}
              <div className="pt-4 mt-4 border-t border-slate-50">
                <div className="flex justify-between text-[9px] font-bold text-sports-muted uppercase tracking-wider mb-1">
                  <span>Efficiency Target</span>
                  <span className="text-sports-success">{m.trend}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-sports-success rounded-full" style={{ width: `${m.progress}%` }}></div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Gemini recommendation block */}
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 shadow-premium border border-slate-150"
        >
          <div className="flex items-center gap-2 text-sports-navy mb-4 pb-3 border-b border-slate-100">
            <FaLeaf className="text-sports-success" />
            <h3 className="font-bold text-sm">Gemini Eco-Optimization Plan</h3>
          </div>
          <div className="text-xs text-sports-navy leading-relaxed font-medium space-y-2.5">
            {suggestion.split('\n').map((line, idx) => {
              const isHeader = line.startsWith('**') && line.endsWith('**');
              const cleanLine = line.replace(/\*\*/g, '');
              return (
                <p key={idx} className={isHeader ? 'font-bold text-sports-navy text-xs pt-1.5' : ''}>
                  {cleanLine}
                </p>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Info card footer */}
      {!suggestion && (
        <div className="rounded-2xl gradient-navy p-6 text-white shadow-premium border border-slate-800 flex gap-4 items-start">
          <FaInfoCircle className="text-sports-blueLight text-lg shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <h4 className="font-bold text-sm text-sports-blueLight">Eco-Grids Coordinated dispatch</h4>
            <p className="mt-1 text-gray-300 font-light">
              Click the **Ask Gemini Eco-Advice** button to consult the AI coordinator. It reviews grid data and proposes load reduction protocols, sorting guide placements, and irrigation cycles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sustainability;
