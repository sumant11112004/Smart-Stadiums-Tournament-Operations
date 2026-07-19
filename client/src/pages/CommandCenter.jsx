import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  FaTrophy, FaTv, FaExclamationTriangle, FaCheckCircle, 
  FaShieldAlt, FaLeaf, FaCompass, FaHeartbeat, FaCloudSun, 
  FaBolt, FaTint, FaSubway, FaParking, FaUsers, FaClock, 
  FaPlay, FaPause, FaHistory, FaCheck, FaExclamationCircle
} from 'react-icons/fa';

const CommandCenter = () => {
  // Scenario states: normal (Pre-Match), surge (Peak Crowd), medical (Incident), weather (Storm), dispersal (Post-Match)
  const [scenario, setScenario] = useState('normal'); 
  const [isSimulating, setIsSimulating] = useState(true);
  
  // Simulated Sensor States
  const [attendance, setAttendance] = useState(74820);
  const [metroWait, setMetroWait] = useState(4); // minutes
  const [parkingOcc, setParkingOcc] = useState(72); // percentage
  const [aiConfidence, setAiConfidence] = useState(96.4);
  const [activeMedicalCases, setActiveMedicalCases] = useState(0);
  const [matchMinutes, setMatchMinutes] = useState(78);
  const [matchSeconds, setMatchSeconds] = useState(42);

  // Dynamic gate queues
  const [gateBQueue, setGateBQueue] = useState(8);
  const [gateCQueue, setGateCQueue] = useState(12);

  const [aiAdvice, setAiAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const cctvRef = useRef(null);

  // Guided Walkthrough timeline stages
  const timelineStages = [
    { id: 'normal', label: '1. Arrival', desc: 'Gates open' },
    { id: 'surge', label: '2. Peak Surge', desc: 'Congestion detected' },
    { id: 'medical', label: '3. Medical Case', desc: 'Sec 104 dispatch' },
    { id: 'weather', label: '4. Lightning Warning', desc: 'Shelter broadcast' },
    { id: 'dispersal', label: '5. Post-Match', desc: 'Spectator dispersal' }
  ];

  // Dynamic values depending on active scenario
  const getScenarioData = () => {
    switch (scenario) {
      case 'surge':
        return {
          aiRecommendation: "⚠️ AI INSIGHT: Gate B occupancy is critical (91%). Recommend redirecting fans entering from East Parking to Gate D. Estimated wait-time reduction: 37%. Redirection arrows enabled on map.",
          activeIncident: "Crowd Surge Alert at Gate B",
          alertStatus: "danger",
          gateTimes: { A: 4, B: 28, C: 12, D: 4 },
          gateOccupancies: { A: 45, B: 91, C: 62, D: 24 },
          cctvStatus: "CRITICAL BOTTLE-NECK - OVERFLOW ROUTING",
          ambulancePos: null
        };
      case 'medical':
        return {
          aiRecommendation: "⚠️ AI INSIGHT: Emergency dispatch in Section 104, Row G. Recommended action: Direct paramedics via elevator B, reroute Sec 104 flows to Concourse Bridge A. Expected EMT arrival: 2.2 minutes.",
          activeIncident: "Medical Case: Stand Section 104",
          alertStatus: "danger",
          gateTimes: { A: 4, B: 10, C: 12, D: 6 },
          gateOccupancies: { A: 45, B: 60, C: 62, D: 30 },
          cctvStatus: "MEDICAL DISPATCH - EMT IN ROUTE",
          ambulancePos: { x: 195, y: 155 }
        };
      case 'weather':
        return {
          aiRecommendation: "⚠️ AI INSIGHT: Lightning strike threat within 3km. Recommended action: Evacuate upper stand sectors to concourse shelters. Dim solar grid floodlights by 15% for grid safety. Evac paths highlighted.",
          activeIncident: "Severe Weather Warning: Lightning",
          alertStatus: "warning",
          gateTimes: { A: 12, B: 15, C: 18, D: 10 },
          gateOccupancies: { A: 70, B: 75, C: 80, D: 68 },
          cctvStatus: "WEATHER ADVISORY - CONCOURSE SHELTERS ACTIVE",
          ambulancePos: null
        };
      case 'dispersal':
        return {
          aiRecommendation: "⚠️ AI INSIGHT: Post-match dispersal mode. Recommended action: Open all perimeter exits. Hold incoming shuttle vehicles. Direct public transit queues to Metro Line 2. Estimated clearance time: 42 minutes.",
          activeIncident: "Post-Match Dispersal Active",
          alertStatus: "info",
          gateTimes: { A: 15, B: 18, C: 20, D: 14 },
          gateOccupancies: { A: 82, B: 85, C: 89, D: 78 },
          cctvStatus: "DISPERSAL ACTIVE - SCANNING OUTFLOWS",
          ambulancePos: null
        };
      case 'normal':
      default:
        return {
          aiRecommendation: "✅ AI INSIGHT: All entry checkpoints operating within nominal wait limits. Recommended arrival stand: Gate D. Expected average security check time: 4.5 minutes.",
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

  // Match clock ticking loop
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

      // Draw camera scan lines
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

      // Draw scan cursor
      ctx.strokeStyle = scenario === 'surge' || scenario === 'medical' ? '#EF4444' : '#10B981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, gridOffset);
      ctx.lineTo(canvas.width, gridOffset);
      ctx.stroke();

      gridOffset = (gridOffset + 1.5) % canvas.height;

      // Overlay details
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('CAM_04 - STADIUM GATE B', 10, 20);
      ctx.fillText('SECURITY ROW OBJECT SCANNER', 10, 32);

      if (scenario === 'surge') {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 160, 80);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fillRect(40, 40, 160, 80);

        ctx.fillStyle = '#EF4444';
        ctx.fillText('AI DETECT: CROWD SURGE', 48, 55);
        ctx.fillText(`CAPACITY: ${scData.gateOccupancies.B}%`, 48, 70);
        ctx.fillText('WAIT TIME: 28 MINS', 48, 85);
        ctx.fillText('ACTION: INITIATE REDIRECT', 48, 100);
      } else if (scenario === 'medical') {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, 180, 90);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fillRect(30, 30, 180, 90);

        ctx.fillStyle = '#EF4444';
        ctx.fillText('AI DETECT: MEDICAL CODE RED', 38, 48);
        ctx.fillText('LOC: SEC 104 CONCOURSE', 38, 63);
        ctx.fillText('DISPATCH: EMT 3 IN PATHWAY', 38, 78);
        ctx.fillText('ACTION: HOLD ENTRY GATES', 38, 93);
      } else if (scenario === 'weather') {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        for (let r = 0; r < 15; r++) {
          const rx = Math.random() * canvas.width;
          const ry = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 12);
          ctx.stroke();
        }
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('AI DETECT: WEATHER STORM', 20, 70);
        ctx.fillText('ACTION: FORCE SHELTERS', 20, 85);
      } else {
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 50, 120, 60);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
        ctx.fillRect(60, 50, 120, 60);

        ctx.fillStyle = '#10B981';
        ctx.fillText('FLOW STATUS: OPTIMAL', 68, 68);
        ctx.fillText('WAIT TIME: 4.5 MINS', 68, 83);
        ctx.fillText('OBJECTS STABLE', 68, 98);
      }

      ctx.fillStyle = '#10B981';
      ctx.fillText(`CCTV FEED OUTLOOK: ${scData.cctvStatus}`, 10, canvas.height - 15);

      frameId = requestAnimationFrame(renderCCTV);
    };

    renderCCTV();
    return () => cancelAnimationFrame(frameId);
  }, [scenario]);

  // LIVE SENSOR TICKER SIMULATION LOOP
  useEffect(() => {
    if (!isSimulating) return;

    const sensorInterval = setInterval(() => {
      // Dynamic Attendance increments
      setAttendance((prev) => {
        if (scenario === 'dispersal') {
          // Dispersal decrements
          return prev <= 10000 ? 10000 : prev - Math.floor(Math.random() * 80 + 30);
        }
        const targetCapacity = scenario === 'normal' ? 76000 : 82451;
        if (prev >= targetCapacity) return targetCapacity;
        return prev + Math.floor(Math.random() * 15 + 5);
      });

      // Metro train countdown loops
      setMetroWait((prev) => {
        if (prev <= 1) return 4; // resets back to 4 min
        return prev - 1;
      });

      // AI Confidence subtle jitter
      setAiConfidence((prev) => {
        const delta = (Math.random() * 0.4 - 0.2); // +/- 0.2%
        const nextVal = Number((prev + delta).toFixed(2));
        return nextVal > 98 ? 98 : nextVal < 94 ? 94 : nextVal;
      });

      // Parking capacity occupancy loops
      setParkingOcc((prev) => {
        if (scenario === 'dispersal') {
          return prev <= 15 ? 15 : prev - 1;
        }
        if (prev >= 95) return 95;
        return Math.random() > 0.6 ? prev + 1 : prev;
      });

      // Dynamic gate times fluctuate slightly
      if (scenario === 'surge') {
        setGateBQueue((prev) => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const val = prev + delta;
          return val > 35 ? 35 : val < 25 ? 25 : val;
        });
      } else {
        setGateBQueue(8);
      }

    }, 3000); // Ticks every 3 seconds

    return () => clearInterval(sensorInterval);
  }, [isSimulating, scenario]);

  // Sync active medical cases count
  useEffect(() => {
    if (scenario === 'medical') {
      setActiveMedicalCases(1);
    } else {
      setActiveMedicalCases(0);
    }
  }, [scenario]);

  // Fetch advice from Gemini
  const handleFetchScenarioGeminiAdvice = async () => {
    setAdviceLoading(true);
    setAiAdvice('');
    
    let scenarioDescription = '';
    switch (scenario) {
      case 'surge':
        scenarioDescription = `Peak crowd surge. Gate B is congested. Attendance is ${attendance} spectators. Redirection protocol is running.`;
        break;
      case 'medical':
        scenarioDescription = 'Medical Emergency in stand Section 104, Row G. ambulance paramedics requested.';
        break;
      case 'weather':
        scenarioDescription = 'Lightning warning within 3km of MetLife stadium. Force spectators under concourse shelter bridges.';
        break;
      case 'dispersal':
        scenarioDescription = `Post-match full time. Spectators evacuating stadium. Attendance decreasing from ${attendance}. Transport connections load peaking.`;
        break;
      case 'normal':
      default:
        scenarioDescription = `Nominal pre-match operations. Attendance is ${attendance} fans.`;
    }

    try {
      const res = await api.post('/ai/chat', { 
        query: `You are the FIFA operations AI director. For the scenario: "${scenarioDescription}", output exactly 3 bullet points detailing operational dispatches (e.g. redirect arrivals, dim grid power, coordinate buses).` 
      });
      setAiAdvice(res.data.response);
    } catch (err) {
      setAiAdvice('Telemetry connection timeout. Proactive AI dispatches remain active.');
    } finally {
      setAdviceLoading(false);
    }
  };

  // Stepper handler
  const handleTimelineStageClick = (stageId) => {
    setScenario(stageId);
    setAiAdvice('');
    
    // Set immediate realistic baseline values depending on stage
    if (stageId === 'normal') {
      setAttendance(74820);
      setParkingOcc(72);
      setActiveMedicalCases(0);
    } else if (stageId === 'surge') {
      setAttendance(81240);
      setParkingOcc(89);
      setActiveMedicalCases(0);
    } else if (stageId === 'medical') {
      setAttendance(82451);
      setParkingOcc(91);
      setActiveMedicalCases(1);
    } else if (stageId === 'weather') {
      setAttendance(82451);
      setParkingOcc(91);
      setActiveMedicalCases(0);
    } else if (stageId === 'dispersal') {
      setAttendance(78420);
      setParkingOcc(85);
      setActiveMedicalCases(0);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* HEADER SECTION (NASA Mission Control Theme) */}
      <div className="gradient-navy rounded-2xl p-6 text-white border border-slate-800 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Pitch pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
        
        <div className="relative z-10 space-y-1.5">
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

      {/* NEW: SIMULATOR CONTROLLER & TIMELINE GUIDED DEMO */}
      <div className="bg-white rounded-2xl p-5 shadow-premium border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Toggle Live Simulator */}
        <div className="lg:col-span-3 flex flex-col gap-2 border-r border-slate-100 pr-4">
          <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Simulator Switch</span>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`w-full py-3 rounded-lg text-xs font-bold text-white shadow-premium flex items-center justify-center gap-2 transition-all ${
              isSimulating ? 'bg-sports-navy hover:bg-sports-navyLight' : 'bg-sports-blue hover:bg-sports-blueLight'
            }`}
          >
            {isSimulating ? (
              <><FaPause className="text-[10px]" /> Stop Match Simulation</>
            ) : (
              <><FaPlay className="text-[10px]" /> Start Live Simulation</>
            )}
          </button>
        </div>

        {/* Guided Storytelling Timeline Stepper */}
        <div className="lg:col-span-9 flex flex-col gap-2">
          <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Guided Match Day Scenario Stepper</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {timelineStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => handleTimelineStageClick(stage.id)}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  scenario === stage.id
                    ? 'bg-sports-blue text-white border-sports-blue shadow-premium'
                    : 'bg-slate-50 text-sports-navy border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-[9px] font-bold block uppercase">{stage.label}</span>
                <span className={`text-[8px] font-medium block mt-0.5 ${scenario === stage.id ? 'text-blue-105' : 'text-sports-muted'}`}>
                  {stage.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CORE CONTROL HUB GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CCTV & LIVE STATS BOARD */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Mission Control Stats Board */}
          <div className="rounded-2xl bg-white p-5 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-4">NASA Live Stats Telemetry</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-150">
                <span className="text-[9px] text-sports-muted font-bold uppercase tracking-wider block">ATTENDANCE</span>
                <span className="text-lg font-black text-sports-navy font-mono block mt-1">
                  {attendance.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-150">
                <span className="text-[9px] text-sports-muted font-bold uppercase tracking-wider block">AI SYSTEM CONFIDENCE</span>
                <span className="text-lg font-black text-sports-blue font-mono block mt-1">
                  {aiConfidence}%
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-150">
                <span className="text-[9px] text-sports-muted font-bold uppercase tracking-wider block">PARKING FILL RATE</span>
                <span className="text-lg font-black text-sports-navy font-mono block mt-1">
                  {parkingOcc}%
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-150">
                <span className="text-[9px] text-sports-muted font-bold uppercase tracking-wider block">ACTIVE MEDICAL CASUALTY</span>
                <span className={`text-lg font-black font-mono block mt-1 ${activeMedicalCases > 0 ? 'text-sports-danger animate-pulse' : 'text-sports-success'}`}>
                  {activeMedicalCases} Active
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-150">
                <span className="text-[9px] text-sports-muted font-bold uppercase tracking-wider block">METRO ARRIVAL TIMING</span>
                <span className="text-lg font-black text-sports-success font-mono block mt-1">
                  {metroWait} mins
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-150">
                <span className="text-[9px] text-sports-muted font-bold uppercase tracking-wider block">SECURITY SCREEN STATUS</span>
                <span className="text-xs font-bold text-sports-navy block mt-1.5 uppercase">
                  {scenario === 'dispersal' ? 'Dispersing' : 'Nominal'}
                </span>
              </div>
            </div>
          </div>

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

        {/* RIGHT COLUMN: PROACTIVE AI DISPATCH & LIVE CHARTS */}
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
                <span className="text-xs font-bold text-sports-navy uppercase tracking-wider">Proactive AI Insights</span>
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

          {/* NEW: LIVE SVG DATA VISUALIZATIONS */}
          <div className="rounded-2xl bg-white p-5 shadow-premium border border-slate-100 space-y-4">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block">Live Operational Charts</span>
            
            {/* 1. Gate Occupancy Bar Chart (SVG) */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-sports-muted uppercase tracking-widest block">Gate Occupancy Bars</span>
              <div className="h-20 w-full flex items-end justify-between border-b border-slate-100 pb-1 px-1 bg-slate-50/50 rounded-lg p-2 border border-slate-100">
                {Object.entries(scData.gateOccupancies).map(([gate, occ]) => {
                  const barHeightPercent = Math.max(10, Math.min(occ, 95));
                  const isHigh = occ > 80;
                  return (
                    <div key={gate} className="flex flex-col items-center flex-1 mx-1">
                      <div className="text-[8px] font-bold text-sports-navy font-mono mb-0.5">{occ}%</div>
                      <div className="w-full bg-slate-200 h-12 rounded-t flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${barHeightPercent}%` }}
                          transition={{ type: 'spring', stiffness: 80 }}
                          className={`w-full rounded-t ${isHigh ? 'bg-sports-danger' : 'bg-sports-blue'}`}
                        />
                      </div>
                      <span className="text-[8px] font-bold text-sports-muted mt-1 uppercase">GT-{gate}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Transport Load Speedometer Circle (SVG) */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-sports-muted uppercase tracking-widest block">Transport Load Index</span>
              <div className="flex items-center gap-4 bg-slate-50/50 rounded-lg p-2 border border-slate-100">
                <svg width="45" height="45" className="rotate-[-90deg]">
                  <circle cx="22.5" cy="22.5" r="18" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                  <motion.circle
                    cx="22.5"
                    cy="22.5"
                    r="18"
                    fill="none"
                    stroke={scenario === 'dispersal' ? '#EF4444' : '#1D4ED8'}
                    strokeWidth="4"
                    strokeDasharray="113"
                    initial={{ strokeDashoffset: 113 }}
                    animate={{ strokeDashoffset: 113 - (113 * (scenario === 'dispersal' ? 88 : scenario === 'surge' ? 78 : 55)) / 100 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
                <div className="text-xs">
                  <span className="font-bold text-sports-navy block">
                    {scenario === 'dispersal' ? 'Peak Output (88%)' : 'Coordinated (55%)'}
                  </span>
                  <span className="text-[9px] text-sports-muted">Outbound Metro & Shuttles</span>
                </div>
              </div>
            </div>

            {/* 3. Crowd Trend Spline Line (SVG) */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-sports-muted uppercase tracking-widest block">Spectator Arrival Trend</span>
              <div className="bg-slate-50/50 rounded-lg p-2 border border-slate-100">
                <svg viewBox="0 0 100 30" width="100%" height="30">
                  <motion.path
                    d={scenario === 'dispersal' 
                      ? "M0,5 Q20,10 40,25 T80,30" // dropping trend
                      : "M0,28 Q30,22 60,10 T100,5" // rising trend
                    }
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="flex justify-between text-[8px] font-bold text-sports-muted uppercase mt-1">
                  <span>Match Hour 1</span>
                  <span>Full Time</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CommandCenter;
