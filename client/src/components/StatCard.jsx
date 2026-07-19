import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, description, trend, status = 'info' }) => {
  const statusColors = {
    info: 'text-sports-blue bg-blue-50 border-blue-100',
    success: 'text-sports-success bg-green-50 border-green-100',
    danger: 'text-sports-danger bg-red-50 border-red-100',
    warning: 'text-amber-600 bg-amber-50 border-amber-100',
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-xl border border-slate-100 bg-white p-6 shadow-premium transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-sports-muted uppercase tracking-wider">{title}</span>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-sports-navy">{value}</h3>
        </div>
        <div className={`rounded-lg p-3 border ${statusColors[status] || statusColors.info}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs font-medium">
          <span className="text-sports-muted">{description}</span>
          {trend && (
            <span className={trend.startsWith('+') || trend.includes('Improve') ? 'text-sports-success' : 'text-sports-danger'}>
              {trend}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
