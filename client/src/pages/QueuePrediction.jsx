import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaUtensils, FaShieldAlt, FaParking, FaRestroom, FaInfoCircle } from 'react-icons/fa';

const QueuePrediction = () => {
  const [activeTab, setActiveTab] = useState('food');

  const queueData = {
    food: {
      label: 'Concessions & Food Courts',
      icon: FaUtensils,
      average: '14 Mins',
      peak: '28 Mins (Half-Time)',
      trend: 'Declining slightly',
      chartData: [
        { time: 'Pre-Match', wait: 15 },
        { time: 'Kick-off', wait: 4 },
        { time: '1st Half', wait: 6 },
        { time: 'Half-Time', wait: 28 },
        { time: '2nd Half', wait: 8 },
        { time: 'Post-Match', wait: 18 }
      ],
      tips: 'Concession blocks behind Sections 105 and 124 have digital prepay pickup lines. Order via the stadium mobile app during the 40th minute to skip the main half-time rush.'
    },
    security: {
      label: 'Entrance Security Gates',
      icon: FaShieldAlt,
      average: '8 Mins',
      peak: '22 Mins (1 hour pre-match)',
      trend: 'Low queue times active',
      chartData: [
        { time: '2h Pre', wait: 12 },
        { time: '1h Pre', wait: 24 },
        { time: '30m Pre', wait: 16 },
        { time: 'Kick-off', wait: 5 },
        { time: '1st Half', wait: 2 },
        { time: 'Half-Time', wait: 1 }
      ],
      tips: 'Security Gate D is currently the clearest gate (3 min wait). Gate B is heavily congested due to high arrival volumes from public transit connections.'
    },
    parking: {
      label: 'Stadium Parking Exits',
      icon: FaParking,
      average: '18 Mins',
      peak: '40 Mins (Post-Match)',
      trend: 'Stable flow',
      chartData: [
        { time: 'Kick-off', wait: 1 },
        { time: '1st Half', wait: 1 },
        { time: 'Half-Time', wait: 2 },
        { time: '2nd Half', wait: 1 },
        { time: 'Full-Time', wait: 35 },
        { time: '1h Post', wait: 15 }
      ],
      tips: 'Parking Lot North is currently 98% full. Lot South is operating at 70% and is highly recommended. Outbound exit lanes will be reversed to double outbound traffic flow post-match.'
    },
    restroom: {
      label: 'Restroom Complexes',
      icon: FaRestroom,
      average: '6 Mins',
      peak: '15 Mins (Half-Time)',
      trend: 'High local variation',
      chartData: [
        { time: 'Pre-Match', wait: 8 },
        { time: '1st Half', wait: 2 },
        { time: 'Half-Time', wait: 16 },
        { time: '2nd Half', wait: 3 },
        { time: 'Full-Time', wait: 10 },
        { time: 'Post-Match', wait: 5 }
      ],
      tips: 'Restroom complexes behind Section 112 are under-utilized. Avoid the central Concourse A restroom block during the first 10 minutes of half-time.'
    }
  };

  const selectedData = queueData[activeTab];
  const IconComponent = selectedData.icon;

  // Max value in chartData to scale heights
  const maxWait = Math.max(...selectedData.chartData.map(d => d.wait));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-sports-blue">AI Analytics</span>
        <h2 className="text-3xl font-black text-sports-navy font-display tracking-tight mt-1">Smart Queue Predictions</h2>
        <p className="text-sm text-sports-muted font-light mt-1">
          Predictive queuing times calculated by historical game entry models and active sensor logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Object.entries(queueData).map(([key, value]) => {
          const TabIcon = value.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center justify-center gap-3 rounded-xl p-4 border font-bold text-xs transition-all ${
                activeTab === key
                  ? 'bg-sports-navy border-sports-navy text-white shadow-premium'
                  : 'bg-white border-slate-100 hover:border-slate-350 text-sports-navy'
              }`}
            >
              <TabIcon className="text-base" />
              <span>{key.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Analytics Card split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Custom SVG Line/Bar Chart */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-sm text-sports-navy">{selectedData.label} Queue Projections</h3>
            <span className="text-[10px] bg-sports-blue/10 text-sports-blue px-2.5 py-0.5 rounded font-extrabold uppercase">
              Time (Minutes) vs Match Timeline
            </span>
          </div>

          {/* Render custom SVG bar chart */}
          <div className="w-full h-64 flex items-end justify-between px-4 border-b border-l border-slate-200 pb-2 pl-4">
            {selectedData.chartData.map((d, index) => {
              // Calculate percentage height
              const heightPercent = maxWait > 0 ? (d.wait / maxWait) * 80 : 0; // scale to 80% max
              return (
                <div key={index} className="flex flex-col items-center flex-1 mx-2 sm:mx-4">
                  <span className="text-[10px] font-black text-sports-navy mb-1.5">{d.wait}m</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`w-full rounded-t-lg ${d.wait > 18 ? 'bg-sports-danger' : d.wait > 10 ? 'bg-amber-500' : 'bg-sports-blue'}`}
                  />
                  <span className="text-[9px] font-bold text-sports-muted uppercase tracking-wider mt-2.5 text-center truncate w-full">
                    {d.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projections info sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-sports-navy uppercase tracking-wider">Metrics Overview</span>
              <IconComponent className="text-lg text-sports-blue" />
            </div>

            <div className="space-y-4">
              <div className="border-b border-slate-50 pb-3">
                <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Average Wait</span>
                <span className="text-2xl font-black text-sports-navy">{selectedData.average}</span>
              </div>
              <div className="border-b border-slate-50 pb-3">
                <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Peak Estimated Wait</span>
                <span className="text-lg font-bold text-sports-navy">{selectedData.peak}</span>
              </div>
              <div>
                <span className="text-[10px] text-sports-muted font-bold uppercase tracking-wider block">Telemetry Trend</span>
                <span className="text-xs font-semibold text-sports-success flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 rounded-full bg-sports-success animate-pulse"></span>
                  {selectedData.trend}
                </span>
              </div>
            </div>
          </div>

          {/* AI Tips */}
          <div className="rounded-2xl gradient-navy p-6 text-white shadow-premium border border-slate-800">
            <div className="flex items-center gap-2 text-sports-blueLight mb-3">
              <FaInfoCircle />
              <h4 className="font-bold text-xs uppercase tracking-wider">Gemini Dispatch Recommendation</h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              {selectedData.tips}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueuePrediction;
