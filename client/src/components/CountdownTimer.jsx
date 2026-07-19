import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  // Target: July 19, 2026 18:00:00 (FIFA World Cup 2026 Final)
  const targetDate = new Date('2026-07-19T18:00:00');
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +targetDate - +new Date();
      let tempTimeLeft = {};

      if (difference > 0) {
        tempTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isOver: false
        };
      } else {
        tempTimeLeft = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isOver: true
        };
      }
      setTimeLeft(tempTimeLeft);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  if (timeLeft.isOver) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-sports-blue p-6 text-white shadow-premium">
        <span className="text-xs font-semibold tracking-widest text-sports-blueLight uppercase">Status</span>
        <h3 className="mt-1 font-display text-2xl font-bold tracking-tight animate-pulse">🏟️ FIFA 2026 FINAL - MATCH IN PROGRESS</h3>
        <p className="mt-1 text-sm text-gray-200">MetLife Stadium, East Rutherford</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-xl bg-sports-navyLight p-6 border border-slate-800 shadow-premium">
      <span className="text-xs font-bold tracking-widest text-sports-blueLight uppercase mb-3">Live Countdown to Kick-Off</span>
      <div className="flex gap-4">
        {timeBlocks.map((block) => (
          <div key={block.label} className="flex flex-col items-center bg-sports-navy rounded-lg px-4 py-3 min-w-[70px] border border-slate-800">
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">
              {String(block.value).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[10px] font-bold text-sports-muted tracking-wider">
              {block.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400 font-medium">FIFA World Cup 2026 Final • July 19, 2026</p>
    </div>
  );
};

export default CountdownTimer;
