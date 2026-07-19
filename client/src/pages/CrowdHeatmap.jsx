import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FaUsers, FaArrowRight, FaExclamationTriangle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const CrowdHeatmap = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emergencies, setEmergencies] = useState([]);

  const densityColors = {
    low: { bg: 'bg-emerald-500', border: 'border-emerald-600', text: 'text-emerald-700', badgeBg: 'bg-emerald-50 text-emerald-700', fill: '#10B981' },
    medium: { bg: 'bg-amber-500', border: 'border-amber-600', text: 'text-amber-700', badgeBg: 'bg-amber-50 text-amber-700', fill: '#F59E0B' },
    high: { bg: 'bg-orange-500', border: 'border-orange-600', text: 'text-orange-700', badgeBg: 'bg-orange-50 text-orange-700', fill: '#F97316' },
    critical: { bg: 'bg-rose-500', border: 'border-rose-600', text: 'text-rose-700', badgeBg: 'bg-rose-50 text-rose-700', fill: '#EF4444' },
  };

  const fetchTelemetry = async () => {
    try {
      const crowdRes = await api.get('/crowd/status');
      setZones(crowdRes.data);
      if (crowdRes.data.length > 0) {
        setSelectedZone(crowdRes.data[0]);
      }

      // Fetch active alerts for emergency warning banner
      const alertRes = await api.get('/emergency/alerts');
      setEmergencies(alertRes.data.filter(a => a.status === 'active'));
    } catch (err) {
      console.error('Error fetching telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sports-grayBg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sports-blue border-t-transparent"></div>
      </div>
    );
  }

  // Find a specific zone object by name
  const findZone = (name) => zones.find(z => z.zone.toLowerCase().includes(name.toLowerCase())) || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sports-blue">Real-Time Telemetry</span>
          <h2 className="mt-1 text-3xl font-black text-sports-navy font-display tracking-tight">Crowd Heatmap & Flow Control</h2>
          <p className="text-sm text-sports-muted font-light mt-1">
            Stadium zone layout updated automatically via concourse weight sensors and optical gate scanners.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sports-success animate-ping"></span>
          <span className="text-xs font-semibold text-sports-success uppercase tracking-wider">Updates Live (10s)</span>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      {emergencies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-5 text-sports-danger shadow-sm"
        >
          <FaExclamationTriangle className="text-xl shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-sports-navy">Active Safety Incident Reported</h4>
            <div className="mt-2 space-y-1">
              {emergencies.map((alert, index) => (
                <div key={index} className="leading-relaxed font-medium">
                  • <span className="uppercase font-bold">[{alert.type}]</span> {alert.details} | Evacuation instruction: {alert.route}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stadium Interactive Map Blueprint */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-premium border border-slate-100 flex flex-col items-center">
          <span className="text-xs font-bold text-sports-navy uppercase tracking-wider mb-4 self-start">Interactive Blueprint</span>
          
          {/* Custom SVG Stadium Floor Map */}
          <div className="w-full max-w-[420px] aspect-square relative my-6">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
              {/* Outer boundary */}
              <circle cx="200" cy="200" r="180" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="6,4" />
              
              {/* Pitch */}
              <rect x="130" y="110" width="140" height="180" rx="4" fill="#34D399" opacity="0.3" stroke="#10B981" strokeWidth="2" />
              <circle cx="200" cy="200" r="30" fill="none" stroke="#10B981" strokeWidth="2" />
              <line x1="130" y1="200" x2="270" y2="200" stroke="#10B981" strokeWidth="2" />
              
              {/* Sectors - Interactive SVG Paths */}
              {/* Gate A / North Stand (Top) */}
              <path
                d="M 120 70 A 150 150 0 0 1 280 70 L 250 100 A 110 110 0 0 0 150 100 Z"
                fill={densityColors[findZone('Gate A').density]?.fill || '#CBD5E1'}
                className="cursor-pointer transition-all hover:opacity-85 stroke-white stroke-2"
                onClick={() => setSelectedZone(findZone('Gate A'))}
              />
              
              {/* Gate C / South Stand (Bottom) */}
              <path
                d="M 120 330 A 150 150 0 0 0 280 330 L 250 300 A 110 110 0 0 1 150 300 Z"
                fill={densityColors[findZone('Gate C').density]?.fill || '#CBD5E1'}
                className="cursor-pointer transition-all hover:opacity-85 stroke-white stroke-2"
                onClick={() => setSelectedZone(findZone('Gate C'))}
              />
              
              {/* Gate B / East Stand (Right) */}
              <path
                d="M 330 120 A 150 150 0 0 1 330 280 L 300 250 A 110 110 0 0 0 300 150 Z"
                fill={densityColors[findZone('Gate B').density]?.fill || '#CBD5E1'}
                className="cursor-pointer transition-all hover:opacity-85 stroke-white stroke-2"
                onClick={() => setSelectedZone(findZone('Gate B'))}
              />

              {/* Gate D / West Stand (Left) */}
              <path
                d="M 70 120 A 150 150 0 0 0 70 280 L 100 250 A 110 110 0 0 1 100 150 Z"
                fill={densityColors[findZone('Gate D').density]?.fill || '#CBD5E1'}
                className="cursor-pointer transition-all hover:opacity-85 stroke-white stroke-2"
                onClick={() => setSelectedZone(findZone('Gate D'))}
              />

              {/* Concourse Areas represented as outer circular tracks */}
              {/* Concourse 1 (East side) */}
              <path
                d="M 200 15 A 185 185 0 0 1 200 385 L 200 355 A 155 155 0 0 0 200 45 Z"
                fill={densityColors[findZone('Concourse 1').density]?.fill || '#CBD5E1'}
                className="cursor-pointer transition-all hover:opacity-80 stroke-white stroke-1"
                opacity="0.75"
                onClick={() => setSelectedZone(findZone('Concourse 1'))}
              />

              {/* Concourse 2 (West side) */}
              <path
                d="M 200 15 A 185 185 0 0 0 200 385 L 200 355 A 155 155 0 0 1 200 45 Z"
                fill={densityColors[findZone('Concourse 2').density]?.fill || '#CBD5E1'}
                className="cursor-pointer transition-all hover:opacity-80 stroke-white stroke-1"
                opacity="0.75"
                onClick={() => setSelectedZone(findZone('Concourse 2'))}
              />
            </svg>
            <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold text-sports-muted uppercase tracking-widest">
              Click Sectors to Inspect Telemetry
            </div>
          </div>

          {/* Color Key */}
          <div className="flex gap-4 text-xs font-semibold mt-4">
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-500"></span><span>Low</span></div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-500"></span><span>Med</span></div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-orange-500"></span><span>High</span></div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-rose-500"></span><span>Critical</span></div>
          </div>
        </div>

        {/* Selected Zone Inspector & Detailed Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {selectedZone && (
            <motion.div
              layoutId="inspector"
              className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-sports-navy uppercase tracking-wider">Sector Inspector</span>
                <span className={`rounded px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${densityColors[selectedZone.density]?.badgeBg}`}>
                  {selectedZone.density} Density
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-sports-navy">{selectedZone.zone}</h3>
              
              <div className="grid grid-cols-2 gap-4 my-5 border-y border-slate-100 py-4">
                <div>
                  <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Average Queue</span>
                  <span className="text-2xl font-black text-sports-navy">{selectedZone.queueTimeMinutes} Mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Zone Safety Status</span>
                  <span className={`text-sm font-bold flex items-center gap-1 mt-1 ${selectedZone.density === 'critical' ? 'text-sports-danger' : 'text-sports-success'}`}>
                    {selectedZone.density === 'critical' ? (
                      <><FaExclamationCircle /> Avoid Immediately</>
                    ) : (
                      <><FaCheckCircle /> Safe Entrance</>
                    )}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block mb-1">AI Recommendation</span>
                <p className="text-xs text-sports-navy font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-150">
                  {selectedZone.suggestions}
                </p>
              </div>
            </motion.div>
          )}

          {/* List of all gates */}
          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-4">Live Stand Queue Logs</span>
            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
              {zones.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedZone(item)}
                  className={`flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 transition-colors px-2 rounded-lg ${selectedZone?._id === item._id ? 'bg-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${densityColors[item.density]?.bg}`}></span>
                    <span className="text-xs font-semibold text-sports-navy">{item.zone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-sports-navy">{item.queueTimeMinutes}m wait</span>
                    <FaArrowRight className="text-[10px] text-sports-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdHeatmap;
