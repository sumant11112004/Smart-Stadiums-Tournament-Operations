import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  FaTrophy, FaTv, FaExclamationTriangle, FaCheckCircle, 
  FaShieldAlt, FaLeaf, FaCompass, FaHeartbeat, FaCloudSun, 
  FaBolt, FaTint, FaSubway, FaParking, FaUsers, FaClock, FaVolumeUp 
} from 'react-icons/fa';

const CommandCenter = () => {
  const [scenario, setScenario] = useState('normal'); // normal, surge, medical, weather
  const [matchMinutes, setMatchMinutes] = useState(78);
  const [matchSeconds, setMatchSeconds] = useState(42);
  const [liveLog, setLiveLog] = useState([
    '09:45 - Operations initiated for FIFA World Cup Final Match.',
    '10:00 - Stadium gates opened for spectators.',
    '11:00 - Kick-off: Argentina vs France.'
  ]);
  
  const [aiAdvice, setAiAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const cctvRef = useRef(null);

  // Dynamic values depending on active scenario
  const getScenarioData = () => {
    switch (scenario) {
      case 'surge':
        return {
          aiRecommendation: "⚠️ AI detected abnormal crowd density near Gate B (91% capacity). Redirection warning initiated. Action: Instruct marshals to close incoming Gate B lanes. Redirect arriving spectators to Gate D (currently 24% capacity). Expected wait-time reduction: 37% (from 28m down to 6m).",
          activeIncident: "Crowd Surge Alert at Gate B Entrance",
          alertStatus: "danger",
          gateTimes: { A: 4, B: 28, C: 12, D: 4 },
          gateOccupancies: { A: 45, B: 91, C: 62, D: 24 },
          cctvStatus: "CRITICAL BOTTLENECK - REDIRECT ACTIVE",
          ambulancePos: null
        };
      case 'medical':
        return {
          aiRecommendation: "⚠️ Medical Alert in Section 104, Row G. Action: Reroute pedestrian traffic in Concourse Sector East to Concourse Bridge A to clear pathway. Dispatch Paramedic Team 3 via elevator B. Expected EMT arrival: 2.2 mins.",
          activeIncident: "Medical Dispatch: Sec 104 Concourse",
          alertStatus: "danger",
          gateTimes: { A: 4, B: 10, C: 12, D: 6 },
          gateOccupancies: { A: 45, B: 60, C: 62, D: 30 },
          cctvStatus: "MEDICAL DISPATCH - EMT IN ROUTE",
          ambulancePos: { x: 195, y: 155 } // animate ambulance moving to Sec 104 on map
        };
      case 'weather':
        return {
          aiRecommendation: "⚠️ Lightning threat within 3km of MetLife Stadium. Action: Broadcast weather evacuation warning to all stadium displays. Open sheltered lower concourses. Instruct upper stand spectators to descend. Dim solar grid floodlights by 15% to buffer power surge protection.",
          activeIncident: "Flash Lightning Evacuation warning",
          alertStatus: "warning",
          gateTimes: { A: 12, B: 15, C: 18, D: 10 },
          gateOccupancies: { A: 70, B: 75, C: 80, D: 68 },
          cctvStatus: "WEATHER ADVISORY - EVACUATION ACTIVE",
          ambulancePos: null
        };
      case 'normal':
      default:
        return {
          aiRecommendation: "✅ Operations running within standard safety thresholds. Expected average security wait: 4.5 minutes. Recommended route for general arrivals: Gate D and Lot South shuttle lanes.",
          activeIncident: null,
          alertStatus: "success",
          gateTimes: { A: 3, B: 8, C: 12, D: 4 },
          gateOccupancies: { A: 40, B: 62, C: 60, D: 28 },
          cctvStatus: "NORMAL FLOW - SCANNING GATES",
          ambulancePos: null
        };
    }
  };

  const scData = getScenarioData();

  // Increment ticking match clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setMatchSeconds((sec) => {
        if (sec >= 59) {
          setMatchMinutes((min) => (min >= 90 ? 90 : min + 1));
          return 0;
        }
        return sec + 1;
      });
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // CCTV Video canvas loop simulator
  useEffect(() => {
    const canvas = cctvRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let gridOffset = 0;

    const renderCCTV = () => {
      ctx.fillStyle = '#0F172A'; // Slate 900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw camera scanning grids
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw horizontal scanning line
      ctx.strokeStyle = scenario === 'surge' || scenario === 'medical' ? '#EF4444' : '#10B981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, gridOffset);
      ctx.lineTo(canvas.width, gridOffset);
      ctx.stroke();

      gridOffset = (gridOffset + 1.5) % canvas.height;

      // Draw CCTV indicators
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('CAM_04 - GATE B OUTLOOK', 10, 20);
      ctx.fillText('LIVE MATCH OPERATION SCAN', 10, 32);

      // Display dynamic simulated overlay text depending on scenario
      if (scenario === 'surge') {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 160, 80);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fillRect(40, 40, 160, 80);

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('AI DETECT: CONGESTION SURGE', 48, 55);
        ctx.fillText('CAPACITY: 91%', 48, 70);
        ctx.fillText('QUEUE TIME: 28 MINS', 48, 85);
        ctx.fillText('STATUS: REROUTE REQUIRED', 48, 100);
      } else if (scenario === 'medical') {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, 180, 90);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fillRect(30, 30, 180, 90);

        ctx.fillStyle = '#EF4444';
        ctx.fillText('AI DETECT: ACCIDENT EVENT', 38, 48);
        ctx.fillText('LOC: SEC 104 ROW G', 38, 63);
        ctx.fillText('DISPATCH: EMT TEAM 3 (ACTIVE)', 38, 78);
        ctx.fillText('ROUTE: CLEAR FOR RESPONDERS', 38, 93);
      } else if (scenario === 'weather') {
        // Draw simulated rain vectors
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1;
        for (let r = 0; r < 20; r++) {
          const rx = Math.random() * canvas.width;
          const ry = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 15);
          ctx.stroke();
        }
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('AI WARN: LIGHTNING WITHIN 3KM', 20, 70);
        ctx.fillText('ACTION: EVACUATE STANDS', 20, 85);
      } else {
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 50, 120, 60);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
        ctx.fillRect(60, 50, 120, 60);

        ctx.fillStyle = '#10B981';
        ctx.fillText('AI DETECT: FLOW NORMAL', 68, 68);
        ctx.fillText('WAIT TIME: 4.5 MINS', 68, 83);
        ctx.fillText('STATUS: GREEN', 68, 98);
      }

      ctx.fillStyle = '#10B981';
      ctx.fillText(`CCTV FEED: ${scData.cctvStatus}`, 10, canvas.height - 15);

      frameId = requestAnimationFrame(renderCCTV);
    };

    renderCCTV();
    return () => cancelAnimationFrame(frameId);
  }, [scenario]);

  const handleFetchScenarioGeminiAdvice = async () => {
    setAdviceLoading(true);
    setAiAdvice('');
    
    let scenarioDescription = '';
    switch (scenario) {
      case 'surge':
        scenarioDescription = 'Crowd Surge Bottleneck at Gate B. Queue wait-time is 28 minutes. Gate D is vacant.';
        break;
      case 'medical':
        scenarioDescription = 'Medical Emergency in stand Section 104, Row G. Paramedic dispatches needed.';
        break;
      case 'weather':
        scenarioDescription = 'Lightning warning within 3km of the open arena. Stand evacuations recommended.';
        break;
      case 'normal':
      default:
        scenarioDescription = 'Standard operations. No alerts.';
    }

    try {
      const res = await api.post('/ai/chat', { 
        query: `You are the Tournament Command Center Lead AI. Analyze the scenario: "${scenarioDescription}". Provide 3 short bullet-point tactical dispatch recommendations for the stewards and stadium operators.` 
      });
      setAiAdvice(res.data.response);
    } catch (err) {
      setAiAdvice('Connection timeout. Proactive telemetry remains operational.');
    } finally {
      setAdviceLoading(false);
    }
  };

  const handleTriggerScenario = (type) => {
    setScenario(type);
    setAiAdvice('');
    // Append to live logs list
    const logTime = `${String(matchMinutes).padStart(2, '0')}:${String(matchSeconds).padStart(2, '0')}`;
    let text = '';
    switch (type) {
      case 'surge': text = `${logTime} - AI Alert: High surge at Gate B. Redirection plan activated.`; break;
      case 'medical': text = `${logTime} - Emergency: Paramedic Team 3 dispatched to Sec 104.`; break;
      case 'weather': text = `${logTime} - Weather: Lightning warning raised. evacuation routes active.`; break;
      case 'normal': default: text = `${logTime} - Telemetry reset: Normal Operations restored.`;
    }
    setLiveLog(prev => [text, ...prev].slice(0, 5)); // Keep last 5 logs
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* HEADER SECTION (NASA Mission Control Theme) */}
      <div className="gradient-navy rounded-2xl p-6 text-white border border-slate-800 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Pitch pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-sports-blueLight font-semibold text-xs tracking-widest uppercase">
            <FaTrophy className="animate-pulse" />
            <span>FIFA WORLD CUP 2026 • OPERATIONS CENTER</span>
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight">TOURNAMENT COMMAND CONTROL</h1>
          <p className="text-xs text-gray-400 font-light">MetLife Stadium, East Rutherford, NJ | Host City Command Hub</p>
        </div>

        {/* Live Match Clock Telemetry */}
        <div className="relative z-10 flex items-center gap-4 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-5 py-3 shrink-0">
          <div className="text-center px-2">
            <span className="block text-[9px] font-bold text-sports-muted uppercase tracking-wider">MATCH TIMER</span>
            <span className="text-2xl font-black font-display text-white tracking-widest">
              {String(matchMinutes).padStart(2, '0')}:{String(matchSeconds).padStart(2, '0')}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-850"></div>
          <div className="text-center px-2">
            <span className="block text-[9px] font-bold text-sports-muted uppercase tracking-wider">SCORELINE</span>
            <span className="text-sm font-bold text-white tracking-wide block mt-1">ARG 2 - 2 FRA</span>
          </div>
          <div className="h-8 w-px bg-slate-850"></div>
          <div className="text-center px-2">
            <span className="block text-[9px] font-bold text-sports-muted uppercase tracking-wider">WEATHER</span>
            <span className="text-xs font-bold text-sports-blueLight block mt-1">29°C Clear</span>
          </div>
        </div>
      </div>

      {/* CORE CONTROL HUB GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CCTV & LOG FEED */}
        <div className="lg:col-span-4 space-y-6">
          {/* CCTV Feed Simulator */}
          <div className="rounded-2xl bg-white p-5 shadow-premium border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaTv className="text-sports-blue text-sm" />
                <span className="text-xs font-bold text-sports-navy uppercase tracking-wider">CCTV Smart Scanner</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${scenario === 'normal' ? 'bg-green-50 text-sports-success' : 'bg-red-50 text-sports-danger'}`}>
                {scenario === 'normal' ? 'Flow Nominal' : 'Incident Flagged'}
              </span>
            </div>
            
            <div className="rounded-lg overflow-hidden border border-slate-200 aspect-video relative bg-slate-900 shadow-inner">
              <canvas ref={cctvRef} width="320" height="180" className="w-full h-full block" />
            </div>
            <p className="text-[10px] text-sports-muted leading-relaxed font-medium">
              *AI overlays bounding box scans automatically when occupancy rates cross 80%.
            </p>
          </div>

          {/* Scenario Trigger panel */}
          <div className="rounded-2xl bg-white p-5 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-3">Live Demo Scenario Dispatch</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTriggerScenario('normal')}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold border transition-all ${scenario === 'normal' ? 'bg-sports-navy text-white border-sports-navy' : 'bg-white text-sports-navy border-slate-100 hover:bg-slate-50'}`}
              >
                Normal Flow
              </button>
              <button
                onClick={() => handleTriggerScenario('surge')}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold border transition-all ${scenario === 'surge' ? 'bg-sports-danger text-white border-sports-danger' : 'bg-white text-sports-navy border-slate-100 hover:bg-slate-50'}`}
              >
                Gate B Surge
              </button>
              <button
                onClick={() => handleTriggerScenario('medical')}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold border transition-all ${scenario === 'medical' ? 'bg-sports-danger text-white border-sports-danger' : 'bg-white text-sports-navy border-slate-100 hover:bg-slate-50'}`}
              >
                Medical (Sec 104)
              </button>
              <button
                onClick={() => handleTriggerScenario('weather')}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold border transition-all ${scenario === 'weather' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-sports-navy border-slate-100 hover:bg-slate-50'}`}
              >
                Lightning Warning
              </button>
            </div>
          </div>

          {/* Operations Incident Feed Log */}
          <div className="rounded-2xl bg-white p-5 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-3">Live Dispatch Feed</span>
            <div className="space-y-2 text-[10px] font-mono leading-relaxed text-sports-navy max-h-[140px] overflow-y-auto">
              {liveLog.map((log, idx) => (
                <div key={idx} className="py-1 border-b border-slate-50 last:border-0 truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: MAP BLUEPRINT */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-5 shadow-premium border border-slate-100 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider">Live Stadium Blueprint Heatmap</span>
            <span className="text-[10px] font-extrabold text-sports-muted uppercase tracking-wider">Sectors A - D</span>
          </div>

          {/* Interactive SVG Stadium Blueprint Heatmap with ev animations */}
          <div className="w-full aspect-square relative my-4 max-w-[340px]">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
              {/* Outer track */}
              <circle cx="200" cy="200" r="180" fill="none" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="6,4" />
              
              {/* Field */}
              <rect x="130" y="110" width="140" height="180" rx="4" fill="#34D399" opacity="0.25" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="30" fill="none" stroke="#10B981" strokeWidth="1.5" />
              <line x1="130" y1="200" x2="270" y2="200" stroke="#10B981" strokeWidth="1.5" />

              {/* Sectors color fills mapped dynamically */}
              {/* Gate A / North Stand */}
              <path
                d="M 120 70 A 150 150 0 0 1 280 70 L 250 100 A 110 110 0 0 0 150 100 Z"
                fill={scenario === 'weather' ? '#F59E0B' : '#10B981'}
                className="transition-all duration-300 stroke-white stroke-2"
              />
              
              {/* Gate C / South Stand */}
              <path
                d="M 120 330 A 150 150 0 0 0 280 330 L 250 300 A 110 110 0 0 1 150 300 Z"
                fill={scenario === 'weather' ? '#F59E0B' : '#10B981'}
                className="transition-all duration-300 stroke-white stroke-2"
              />
              
              {/* Gate B / East Stand */}
              <path
                d="M 330 120 A 150 150 0 0 1 330 280 L 300 250 A 110 110 0 0 0 300 150 Z"
                fill={scenario === 'surge' ? '#EF4444' : scenario === 'weather' ? '#F59E0B' : '#10B981'}
                className="transition-all duration-300 stroke-white stroke-2"
              />

              {/* Gate D / West Stand */}
              <path
                d="M 70 120 A 150 150 0 0 0 70 280 L 100 250 A 110 110 0 0 1 100 150 Z"
                fill={scenario === 'weather' ? '#F59E0B' : '#10B981'}
                className="transition-all duration-300 stroke-white stroke-2"
              />

              {/* Sheltered Concourse bridges (weather highlights in blue) */}
              <path
                d="M 200 15 A 185 185 0 0 1 200 385 L 200 355 A 155 155 0 0 0 200 45 Z"
                fill={scenario === 'weather' ? '#3B82F6' : '#E2E8F0'}
                opacity="0.8"
                className="transition-all duration-350 stroke-white stroke-1"
              />
              <path
                d="M 200 15 A 185 185 0 0 0 200 385 L 200 355 A 155 155 0 0 1 200 45 Z"
                fill={scenario === 'weather' ? '#3B82F6' : '#E2E8F0'}
                opacity="0.8"
                className="transition-all duration-350 stroke-white stroke-1"
              />

              {/* DOTTED REDIRECTION PATH (Flashes in surge mode) */}
              {scenario === 'surge' && (
                <path
                  d="M 315 200 C 315 110, 290 55, 200 55 C 110 55, 85 110, 85 200"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  className="animate-[dash_2s_linear_infinite]"
                />
              )}

              {/* EMERGENCY VEHICLE / PARAMEDICS PATHWAY (Animates in medical mode) */}
              {scenario === 'medical' && scData.ambulancePos && (
                <>
                  <path
                    d="M 200 340 C 290 340, 315 285, 315 200"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeDasharray="5,3"
                  />
                  <motion.circle
                    cx="315"
                    cy="200"
                    r="6"
                    fill="#EF4444"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  {/* Ambulance label */}
                  <text x="325" y="200" fill="#EF4444" fontSize="8" fontWeight="bold" fontFamily="monospace">EMT VEHICLE</text>
                </>
              )}
            </svg>
          </div>

          {/* Heat map legends */}
          <div className="flex gap-4 text-[9px] font-bold text-sports-navy uppercase tracking-wider mt-2 border-t border-slate-50 pt-3 w-full justify-center">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500"></span><span>Nominal</span></div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500"></span><span>Moderate</span></div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-rose-500"></span><span>Congested</span></div>
            {scenario === 'weather' && (
              <div className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-blue-500 animate-pulse"></span><span>Shelter Zones</span></div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PROACTIVE AI DISPATCH & LIVE METRICS */}
        <div className="lg:col-span-3 space-y-6">
          {/* Proactive AI Insights Panel (AI Everywhere) */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-premium space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-sports-blueLight animate-pulse"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sports-blueLight opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sports-blueLight"></span>
                </span>
                <span className="text-xs font-bold text-sports-navy uppercase tracking-wider">Proactive AI Recommendations</span>
              </div>
              <button 
                onClick={handleFetchScenarioGeminiAdvice}
                disabled={adviceLoading}
                className="text-[9px] font-extrabold text-sports-blue hover:text-sports-blueLight uppercase tracking-wider"
              >
                {adviceLoading ? 'Consulting...' : 'Audit Advice'}
              </button>
            </div>

            {/* AI suggest Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={scenario}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="rounded-lg bg-slate-50 border border-slate-150 p-4 text-xs font-medium text-sports-navy leading-relaxed"
              >
                {scData.aiRecommendation}
              </motion.div>
            </AnimatePresence>

            {/* Custom Gemini advice result */}
            {aiAdvice && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] leading-relaxed text-sports-navy font-medium bg-blue-50/50 border border-blue-100 rounded-lg p-3 space-y-1.5"
              >
                <span className="text-[8px] font-bold text-sports-blue uppercase tracking-wider block border-b border-blue-100 pb-1">Gemini Audit Dispatch</span>
                {aiAdvice.split('\n').map((line, idx) => (
                  <p key={idx}>{line.replace(/[\*\-]/g, '')}</p>
                ))}
              </motion.div>
            )}
          </div>

          {/* Coordinated live parameters dashboard */}
          <div className="rounded-2xl bg-white p-5 shadow-premium border border-slate-100 space-y-4">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block">Coordinated Live Telemetry</span>
            
            {/* Gate progress rows */}
            <div className="space-y-2.5">
              <span className="text-[9px] font-bold text-sports-muted uppercase tracking-widest block">Access Gate Queue times</span>
              {Object.entries(scData.gateTimes).map(([gate, wTime]) => {
                const occupancy = scData.gateOccupancies[gate];
                return (
                  <div key={gate} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-sports-navy">
                      <span>Gate {gate}</span>
                      <span>{wTime} mins ({occupancy}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${occupancy > 80 ? 'bg-sports-danger' : occupancy > 50 ? 'bg-amber-500' : 'bg-sports-success'}`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Transport status */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[9px] font-bold text-sports-muted uppercase tracking-widest block">Transit connections</span>
              <div className="flex items-center justify-between text-xs font-semibold text-sports-navy">
                <span className="flex items-center gap-1.5"><FaSubway className="text-sports-muted" /> Metro Line 1</span>
                <span className="text-sports-success">4 mins</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-sports-navy">
                <span className="flex items-center gap-1.5"><FaParking className="text-sports-muted" /> Lot South Vacancy</span>
                <span className="text-sports-success">124 slots</span>
              </div>
            </div>

            {/* Sustainability status */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[9px] font-bold text-sports-muted uppercase tracking-widest block">Arena Grid consumption</span>
              <div className="flex items-center justify-between text-xs font-semibold text-sports-navy">
                <span className="flex items-center gap-1.5"><FaBolt className="text-sports-muted" /> Solar Gen</span>
                <span>4.8 MWh</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-sports-navy">
                <span className="flex items-center gap-1.5"><FaTint className="text-sports-muted" /> Water Conserved</span>
                <span>3,240 m³</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CommandCenter;
