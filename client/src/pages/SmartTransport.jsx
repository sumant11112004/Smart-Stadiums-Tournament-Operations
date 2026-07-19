import React from 'react';
import { motion } from 'framer-motion';
import { FaSubway, FaParking, FaTaxi, FaBus, FaWalking, FaCar } from 'react-icons/fa';

const SmartTransport = () => {
  const transits = [
    {
      type: 'Metro (Line 1 & 2)',
      icon: FaSubway,
      status: 'Normal Service',
      statusColor: 'text-sports-success',
      detail: 'Trains departing every 3 minutes. High boarding count post-match.',
      capacity: 85,
      frequency: '3 mins'
    },
    {
      type: 'Stadium Parking Lot South',
      icon: FaParking,
      status: '72% Capacity',
      statusColor: 'text-amber-500',
      detail: '124 spaces vacant. Lot North is currently FULL.',
      capacity: 72,
      frequency: 'Zone C/D open'
    },
    {
      type: 'Taxi Dispatch Stand',
      icon: FaTaxi,
      status: 'High Volume',
      statusColor: 'text-amber-500',
      detail: '15-minute wait time. Priority dispatch lanes active.',
      capacity: 65,
      frequency: 'Wait: 15 mins'
    },
    {
      type: 'Express Bus Loop',
      icon: FaBus,
      status: 'Normal Service',
      statusColor: 'text-sports-success',
      detail: 'Free loops running directly to central transit centers.',
      capacity: 40,
      frequency: '5 mins'
    }
  ];

  const trafficData = [
    { time: 'Pre-Match (Peak)', index: 'High Congestion', val: 78 },
    { time: 'Active Gameplay', index: 'Low Traffic', val: 12 },
    { time: 'Half-Time', index: 'Low Traffic', val: 15 },
    { time: 'Post-Match (Peak)', index: 'Severe Bottleneck', val: 95 }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-sports-blue">Transit Portal</span>
        <h2 className="text-3xl font-black text-sports-navy font-display tracking-tight mt-1">Smart Transport & Traffic Predictions</h2>
        <p className="text-sm text-sports-muted font-light mt-1">
          Coordinated traffic reports and public transit schedules for the tournament arena.
        </p>
      </div>

      {/* Transit Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {transits.map((item, idx) => {
          const TrIcon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-slate-100 bg-white p-6 shadow-premium flex gap-5 items-start"
            >
              <div className="rounded-lg bg-sports-navy text-white p-3.5 border border-slate-800">
                <TrIcon className="text-xl" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-sports-navy">{item.type}</h3>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-sports-muted leading-relaxed font-medium">{item.detail}</p>
                
                {/* Capacity Progress Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-[9px] font-bold text-sports-muted uppercase tracking-wider mb-1">
                    <span>Capacity / Spaces used</span>
                    <span>{item.capacity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.capacity > 80 ? 'bg-sports-danger' : item.capacity > 60 ? 'bg-amber-500' : 'bg-sports-success'}`}
                      style={{ width: `${item.capacity}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-sports-muted font-bold uppercase tracking-wider pt-2 border-t border-slate-50">
                  <span>Frequency / Interval</span>
                  <span className="text-sports-navy">{item.frequency}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Walking Directions card */}
        <div className="lg:col-span-6 rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
          <div className="flex items-center gap-2.5 mb-4">
            <FaWalking className="text-sports-blue text-lg" />
            <h3 className="font-bold text-sm text-sports-navy">Recommended Pedestrian Pathways</h3>
          </div>
          <div className="space-y-4 text-xs font-medium leading-relaxed text-sports-navy">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-150">
              <span className="font-bold block text-sports-blue uppercase text-[10px] tracking-wider mb-1">Fastest Walkway (12 Mins)</span>
              Exit via **Gate D** and use the **West Concourse Bridge**. This path is less crowded and bypasses the main bus queue.
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-150">
              <span className="font-bold block text-sports-blue uppercase text-[10px] tracking-wider mb-1">Accessibility Path (15 Mins)</span>
              Exit via **Gate C elevators** to access the ramp leading directly to Lot South shuttle pick-up.
            </div>
          </div>
        </div>

        {/* Traffic prediction block */}
        <div className="lg:col-span-6 rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
          <div className="flex items-center gap-2.5 mb-4">
            <FaCar className="text-sports-blue text-lg" />
            <h3 className="font-bold text-sm text-sports-navy">Pre-Match vs Post-Match Congestion Projections</h3>
          </div>
          <div className="space-y-4">
            {trafficData.map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-sports-navy">
                  <span>{t.time}</span>
                  <span className={t.val > 70 ? 'text-sports-danger' : 'text-sports-success'}>{t.index}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${t.val > 70 ? 'bg-sports-danger' : t.val > 40 ? 'bg-amber-500' : 'bg-sports-success'}`}
                    style={{ width: `${t.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartTransport;
