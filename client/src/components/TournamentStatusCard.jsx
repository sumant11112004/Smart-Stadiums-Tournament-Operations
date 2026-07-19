import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaClock, FaUsers, FaArrowAltCircleRight, FaCloudSun, FaHeartbeat } from 'react-icons/fa';

const TournamentStatusCard = () => {
  // 1. Kickoff Timer State (starts at 8m 12s = 492 seconds)
  const [secondsLeft, setSecondsLeft] = useState(492);

  // 2. Ticking Simulator State for match day metrics
  const [attendance, setAttendance] = useState(81242);
  const [gateA, setGateA] = useState(68);
  const [gateB, setGateB] = useState(91);
  const [parking, setParking] = useState(73);
  const [metroWait, setMetroWait] = useState(4);
  const [activeMedical, setActiveMedical] = useState(2);

  // 3. Proactive AI Recommendations list
  const aiRecommendations = useMemo(() => [
    {
      id: 1,
      alert: "Heavy congestion detected at Gate B (91%).",
      recommendation: "Redirect fans entering from East Parking lot to Gate D.",
      reduction: "32% estimated wait reduction"
    },
    {
      id: 2,
      alert: "Metro shuttle platforms crowding warning (Sec 3).",
      recommendation: "Increase electric shuttle frequency on Route 2.",
      reduction: "18% wait-time reduction"
    },
    {
      id: 3,
      alert: "Carbon footprint surge in West concourse.",
      recommendation: "Deploy waste volunteers to guide compostable sorting.",
      reduction: "12% trash diversion boost"
    },
    {
      id: 4,
      alert: "Medical dispatcher requested in Stand Sec 104.",
      recommendation: "Hold elevator B for paramedic dispatch route clearance.",
      reduction: "2.4 minutes faster EMT arrival"
    }
  ], []);

  const [activeRecommendIdx, setActiveRecommendIdx] = useState(0);

  // Ticks the kickoff countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 492 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formats seconds into HH:MM:SS
  const formatTime = useCallback((totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  // Simulates live metric updates (ticks metrics every 3.5 seconds)
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      // Subtle attendance drift
      setAttendance((prev) => prev + Math.floor(Math.random() * 11 - 5));
      // Random fluctuations for gate capacities
      setGateA((prev) => {
        const nextVal = prev + Math.floor(Math.random() * 5 - 2);
        return nextVal > 95 ? 95 : nextVal < 40 ? 40 : nextVal;
      });
      setGateB((prev) => {
        const nextVal = prev + Math.floor(Math.random() * 5 - 2);
        return nextVal > 98 ? 98 : nextVal < 80 ? 80 : nextVal; // Keep Gate B congested for visual warning
      });
      // Parking fluctuations
      setParking((prev) => {
        const nextVal = prev + (Math.random() > 0.7 ? 1 : -1);
        return nextVal > 90 ? 90 : nextVal < 60 ? 60 : nextVal;
      });
      // Metro wait dynamic time
      setMetroWait((prev) => {
        const nextVal = prev + (Math.random() > 0.6 ? 1 : -1);
        return nextVal > 8 ? 8 : nextVal < 2 ? 2 : nextVal;
      });
    }, 3500);

    return () => clearInterval(metricsInterval);
  }, []);

  // Rotates AI recommendations every 4 seconds
  useEffect(() => {
    const recommendationsInterval = setInterval(() => {
      setActiveRecommendIdx((prev) => (prev + 1) % aiRecommendations.length);
    }, 4000);
    return () => clearInterval(recommendationsInterval);
  }, [aiRecommendations]);

  const activeRec = aiRecommendations[activeRecommendIdx];

  return (
    <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 shadow-premium flex flex-col justify-between h-full relative overflow-hidden" aria-label="Tournament Status Dashboard" role="region">
      {/* Background scanner sweep line animation */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sports-blueLight to-transparent animate-pulse"></div>

      <div className="space-y-5 relative z-10">
        {/* Header - LIVE MATCH telemetries */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">LIVE TOURNAMENT MODE</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/60 rounded-full px-2.5 py-1 border border-slate-800/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">AI Status: Monitoring</span>
          </div>
        </div>

        {/* Kickoff countdown block */}
        <div className="text-center bg-slate-900/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Brazil vs Germany Kickoff</span>
          <div className="font-display text-3xl font-black text-white tracking-widest tabular-nums animate-pulse">
            {formatTime(secondsLeft)}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[10px] text-sports-blueLight">
            <FaClock className="text-2xs" />
            <span>Expected Match Time: 18:00 Local</span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Attendance */}
          <div className="bg-slate-900/25 p-3 rounded-lg border border-slate-900 flex items-center gap-2.5">
            <FaUsers className="text-slate-400 text-lg shrink-0" />
            <div>
              <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Attendance</span>
              <span className="font-display font-extrabold text-sm text-white tracking-wide">{attendance.toLocaleString()}</span>
            </div>
          </div>

          {/* Metro Wait */}
          <div className="bg-slate-900/25 p-3 rounded-lg border border-slate-900 flex items-center gap-2.5">
            <FaClock className="text-slate-400 text-lg shrink-0" />
            <div>
              <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Metro Connection</span>
              <span className="font-display font-extrabold text-sm text-white tracking-wide">{metroWait} mins wait</span>
            </div>
          </div>

          {/* Medical dispatcher */}
          <div className="bg-slate-900/25 p-3 rounded-lg border border-slate-900 flex items-center gap-2.5">
            <FaHeartbeat className="text-red-400 text-lg shrink-0" />
            <div>
              <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Medical Cases</span>
              <span className="font-display font-extrabold text-sm text-red-400 tracking-wide">{activeMedical} Active</span>
            </div>
          </div>

          {/* Weather */}
          <div className="bg-slate-900/25 p-3 rounded-lg border border-slate-900 flex items-center gap-2.5">
            <FaCloudSun className="text-amber-400 text-lg shrink-0" />
            <div>
              <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Weather Status</span>
              <span className="font-display font-extrabold text-sm text-white tracking-wide">29°C Clear</span>
            </div>
          </div>
        </div>

        {/* Access Gates queues metrics */}
        <div className="space-y-2 border-t border-slate-900 pt-3">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Checkpoint Congestion Levels</span>
          
          {/* Gate A */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-medium text-slate-300">
              <span>Gate A Checkpoint</span>
              <span>{gateA}% Capacity</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${gateA}%` }}
              ></div>
            </div>
          </div>

          {/* Gate B */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-medium text-slate-300">
              <span>Gate B Entry Check</span>
              <span className="text-red-400 font-bold">{gateB}% (Critical Surge)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-red-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${gateB}%` }}
              ></div>
            </div>
          </div>

          {/* Parking Area */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-medium text-slate-300">
              <span>Parking Lot (Zone A/B)</span>
              <span>{parking}% Full</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${parking}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Proactive AI Insights Ticker */}
      <div className="mt-5 border-t border-slate-900 pt-3 relative min-h-[92px]">
        <span className="text-[8px] font-bold text-sports-blueLight uppercase tracking-widest block mb-2">Proactive AI Recommendation</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRecommendIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-1.5"
            aria-live="polite"
          >
            <div>
              <span className="block text-[9px] font-bold text-red-400 uppercase mb-0.5">⚠️ AI detected: {activeRec.alert}</span>
              <p className="text-[10px] text-slate-200 leading-normal font-light">{activeRec.recommendation}</p>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold mt-1">
              <FaArrowAltCircleRight className="text-2xs" />
              <span>{activeRec.reduction}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(TournamentStatusCard);
