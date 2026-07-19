import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { FaExclamationTriangle, FaHeartbeat, FaFire, FaSkullCrossbones, FaChild, FaCloudSun, FaArrowRight, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const EmergencyDashboard = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState('medical');
  const [customDetails, setCustomDetails] = useState('');
  const [triggerStatus, setTriggerStatus] = useState('');

  const incidentTypes = {
    medical: {
      label: 'Medical Emergency',
      icon: FaHeartbeat,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      defaultDetails: 'Reported chest pains or unconscious fan at Concourse Level 2.',
      defaultRoute: 'Evacuate sector pathways to clear access. Direct EMT responders via Elevator C.',
      defaultTeam: 'EMT Team 4 (Sector North)'
    },
    fire: {
      label: 'Fire Alert',
      icon: FaFire,
      color: 'text-orange-600 bg-orange-50 border-orange-100',
      defaultDetails: 'Smoke sensor trigger in Concession Stand B4 kitchen.',
      defaultRoute: 'Direct fans in Sectors 104-106 to evacuate via exit stairs A-East. Close ventilation fire dampers.',
      defaultTeam: 'Fire Rescue Unit 1'
    },
    panic: {
      label: 'Crowd Panic / Surge',
      icon: FaSkullCrossbones,
      color: 'text-red-700 bg-red-50 border-red-100',
      defaultDetails: 'Aggressive crowd movement reported at Gate B turnstiles.',
      defaultRoute: 'Open override perimeter exit gates. Hold incoming transit shuttles to reduce arrivals.',
      defaultTeam: 'Crowd Tactical Squad Bravo'
    },
    lost_child: {
      label: 'Lost Child Log',
      icon: FaChild,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
      defaultDetails: '7-year-old separated near VIP Suite entrance. Blue t-shirt, khaki shorts.',
      defaultRoute: 'Station stewards at Gates C and D. Review CCTV logs at Entrance Vestibule 3.',
      defaultTeam: 'Marshal Security Team'
    },
    weather: {
      label: 'Weather Warning',
      icon: FaCloudSun,
      color: 'text-amber-605 bg-amber-50 border-amber-100',
      defaultDetails: 'Severe weather alert. Lightning strike within 3km of the arena.',
      defaultRoute: 'Instruct spectators in open stands to move to sheltered indoor concourse levels. Discontinue pitch warmups.',
      defaultTeam: 'Operations Command Center'
    }
  };

  const selectedTemplate = incidentTypes[selectedIncident];

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/emergency/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerAlert = async () => {
    if (!isAuthenticated) {
      setTriggerStatus('Please log in to raise simulated alarms.');
      return;
    }
    
    setTriggerStatus('');
    try {
      const payload = {
        type: selectedIncident,
        details: customDetails || selectedTemplate.defaultDetails,
        route: selectedTemplate.defaultRoute,
        responseTeam: selectedTemplate.defaultTeam
      };

      await api.post('/emergency/trigger', payload);
      setTriggerStatus('✅ Simulated alert successfully logged to database!');
      setCustomDetails('');
      fetchAlerts();
    } catch (err) {
      setTriggerStatus(`⚠️ Alert trigger failed: ${err.message}`);
    }
  };

  const handleResolveAlert = async (id) => {
    try {
      await api.put(`/emergency/resolve/${id}`);
      fetchAlerts();
    } catch (err) {
      console.error('Resolve failed:', err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sports-grayBg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sports-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-sports-blue">Safety Command</span>
        <h2 className="text-3xl font-black text-sports-navy font-display tracking-tight mt-1">Smart Emergency Command</h2>
        <p className="text-sm text-sports-muted font-light mt-1">
          Monitor safety incidents and simulate active evacuations. (Registration required to trigger test alarms).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Simulation Templates */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-4">Simulation Trigger Panel</span>
            
            <div className="space-y-2">
              {Object.entries(incidentTypes).map(([key, val]) => {
                const IncIcon = val.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedIncident(key);
                      setTriggerStatus('');
                    }}
                    className={`flex items-center justify-between w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedIncident === key
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-sports-navy border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IncIcon className="text-base" />
                      <span className="text-xs font-bold">{val.label}</span>
                    </div>
                    <FaArrowRight className="text-[10px]" />
                  </button>
                );
              })}
            </div>

            {/* Custom Description Text */}
            <div className="mt-5 space-y-3">
              <label className="block text-[10px] text-sports-muted font-bold uppercase tracking-wider">Custom Incident Details (Optional)</label>
              <textarea
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder={selectedTemplate.defaultDetails}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-sports-navy focus:bg-white focus:outline-none focus:border-sports-blue h-20 resize-none"
              />
              
              {triggerStatus && (
                <div className="text-[11px] font-bold py-1 text-sports-blue block">
                  {triggerStatus}
                </div>
              )}

              <button
                onClick={handleTriggerAlert}
                className="w-full py-2.5 rounded-lg bg-sports-danger text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-premium flex items-center justify-center gap-2"
              >
                <FaExclamationTriangle className="text-2xs" />
                <span>Raise Simulated Alarm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Plan Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-4">Emergency Protocol Guide</span>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2.5 rounded-lg ${selectedTemplate.color}`}>
                  <selectedTemplate.icon className="text-lg" />
                </div>
                <h3 className="text-lg font-bold text-sports-navy font-display">{selectedTemplate.label} Standard Operating Procedure</h3>
              </div>

              <div className="border-t border-slate-50 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Recommended Action</span>
                  <p className="text-xs text-sports-navy font-semibold mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-150">
                    {customDetails || selectedTemplate.defaultDetails}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Evacuation Pathway</span>
                  <p className="text-xs text-sports-navy font-semibold mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-150">
                    {selectedTemplate.defaultRoute}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Assigned Incident Responders</span>
                <p className="text-xs text-sports-navy font-bold mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-150">
                  {selectedTemplate.defaultTeam}
                </p>
              </div>
            </div>
          </div>

          {/* Active Logs */}
          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-4">Live Incident Log Feed</span>
            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <p className="text-xs text-sports-muted text-center py-6">No safety incidents reported.</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert._id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <span className="mt-1 shrink-0">
                        {alert.status === 'active' ? (
                          <FaExclamationCircle className="text-sports-danger text-sm" />
                        ) : (
                          <FaCheckCircle className="text-sports-success text-sm" />
                        )}
                      </span>
                      <div className="text-xs">
                        <span className="font-bold text-sports-navy uppercase block">
                          {alert.type} Alarm
                          {alert.status === 'resolved' && <span className="ml-2 bg-green-50 text-sports-success text-[8px] px-1.5 py-0.5 rounded font-extrabold lowercase">resolved</span>}
                        </span>
                        <p className="text-sports-muted mt-1 leading-relaxed">{alert.details}</p>
                        <p className="text-[10px] text-sports-muted font-semibold mt-0.5">Route: {alert.route}</p>
                      </div>
                    </div>
                    {alert.status === 'active' && isAdmin && (
                      <button
                        onClick={() => handleResolveAlert(alert._id)}
                        className="rounded border border-slate-200 px-2 py-1 text-[10px] font-bold text-sports-navy hover:bg-slate-50 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
