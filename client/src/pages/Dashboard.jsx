import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FaUsers, FaRobot, FaExclamationTriangle, FaEnvelope, FaPen, FaCheck } from 'react-icons/fa';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for updating zone telemetry
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [density, setDensity] = useState('low');
  const [queueTime, setQueueTime] = useState(5);
  const [suggestions, setSuggestions] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      const metricRes = await api.get('/admin/dashboard');
      setMetrics(metricRes.data);

      const crowdRes = await api.get('/crowd/status');
      setZones(crowdRes.data);
      if (crowdRes.data.length > 0 && !selectedZoneId) {
        const first = crowdRes.data[0];
        setSelectedZoneId(first._id);
        setDensity(first.density);
        setQueueTime(first.queueTimeMinutes);
        setSuggestions(first.suggestions);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleZoneSelectChange = (e) => {
    const id = e.target.value;
    setSelectedZoneId(id);
    const matched = zones.find(z => z._id === id);
    if (matched) {
      setDensity(matched.density);
      setQueueTime(matched.queueTimeMinutes);
      setSuggestions(matched.suggestions);
    }
  };

  const handleUpdateZone = async (e) => {
    e.preventDefault();
    setUpdateMessage('');
    try {
      await api.put(`/crowd/status/${selectedZoneId}`, {
        density,
        queueTimeMinutes: Number(queueTime),
        suggestions
      });
      setUpdateMessage('✅ Telemetry updated successfully!');
      
      // Refresh
      const crowdRes = await api.get('/crowd/status');
      setZones(crowdRes.data);
      
      const metricRes = await api.get('/admin/dashboard');
      setMetrics(metricRes.data);
    } catch (err) {
      setUpdateMessage(`⚠️ Update failed: ${err.message}`);
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sports-blue">Control Room</span>
          <h2 className="text-3xl font-black text-sports-navy font-display tracking-tight mt-1">Admin Operations Center</h2>
          <p className="text-sm text-sports-muted font-light mt-1">
            Aggregate overview metrics and modify real-time gate telemetry below.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-2xs font-extrabold uppercase ${metrics?.databaseState === 'demo-mode' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-sports-success border border-green-100'}`}>
          DB: {metrics?.databaseState || 'online'}
        </span>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="System Users" value={metrics.users} icon={FaUsers} description="Registered credentials" trend="Active sessions" status="info" />
          <StatCard title="Total AI Queries" value={metrics.aiQueries} icon={FaRobot} description="Gemini API logs" trend="98.2% response rate" status="success" />
          <StatCard title="Active Emergencies" value={metrics.activeAlerts} icon={FaExclamationTriangle} description="Requiring dispatch" trend="High Priority" status={metrics.activeAlerts > 0 ? 'danger' : 'success'} />
          <StatCard title="Inbound Feedback" value={metrics.feedbacks} icon={FaEnvelope} description="Submitted contact forms" trend="Tickets pending review" status="warning" />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Update Telemetry form */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <FaPen className="text-sports-blue text-sm" />
            <h3 className="font-bold text-sm text-sports-navy">Modify Zone Telemetry</h3>
          </div>

          <form onSubmit={handleUpdateZone} className="space-y-4">
            <div>
              <label className="block text-[10px] text-sports-muted font-bold uppercase tracking-wider mb-2">Select Stadium Zone</label>
              <select
                value={selectedZoneId}
                onChange={handleZoneSelectChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-sports-navy focus:bg-white focus:border-sports-blue"
              >
                {zones.map(z => (
                  <option key={z._id} value={z._id}>{z.zone}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-sports-muted font-bold uppercase tracking-wider mb-2">Density State</label>
                <select
                  value={density}
                  onChange={(e) => setDensity(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-sports-navy focus:bg-white focus:border-sports-blue"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-sports-muted font-bold uppercase tracking-wider mb-2">Queue (Minutes)</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={queueTime}
                  onChange={(e) => setQueueTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-sports-navy focus:bg-white focus:border-sports-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-sports-muted font-bold uppercase tracking-wider mb-2">AI Dispatch Suggestions</label>
              <textarea
                rows="3"
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Evacuation details or entry advices..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-sports-navy focus:bg-white focus:border-sports-blue h-16 resize-none"
              />
            </div>

            {updateMessage && (
              <span className="text-[10px] font-bold text-sports-blue block">{updateMessage}</span>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sports-navy text-white text-xs font-bold hover:bg-sports-navyLight transition-colors shadow-premium flex items-center justify-center gap-2"
            >
              <FaCheck className="text-[10px]" />
              <span>Update Telemetry</span>
            </button>
          </form>
        </div>

        {/* Recent logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent AI logs */}
          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-4">Recent Gemini AI Audits</span>
            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1 text-xs">
              {metrics?.recentQueries?.length === 0 ? (
                <p className="text-sports-muted text-center py-6">No queries logged yet.</p>
              ) : (
                metrics?.recentQueries?.map((q, idx) => (
                  <div key={idx} className="py-2.5">
                    <span className="font-bold text-sports-navy block">Prompt: {q.query}</span>
                    <p className="text-sports-muted font-light mt-0.5 leading-relaxed truncate">{q.response}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-4">Recent Operations Tickets</span>
            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1 text-xs font-medium">
              {metrics?.recentFeedback?.length === 0 ? (
                <p className="text-sports-muted text-center py-6">No tickets logged.</p>
              ) : (
                metrics?.recentFeedback?.map((f, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-start gap-4">
                    <div>
                      <span className="font-bold text-sports-navy block">{f.subject}</span>
                      <p className="text-sports-muted text-[10px] mt-0.5">Submitted by: {f.name} ({f.email})</p>
                      <p className="text-sports-muted text-2xs mt-1 leading-relaxed">{f.message}</p>
                    </div>
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

export default Dashboard;
