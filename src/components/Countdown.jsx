import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const Countdown = ({ isEmbedded = false }) => {
  const targetDate = new Date('2026-09-10T09:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  const content = (
    <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
      {/* Section Header Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-950/60 border border-red-600/50 rounded-full text-red-500 font-mono-cyber text-xs tracking-widest uppercase mb-4 sm:mb-6 shadow-[0_0_15px_rgba(230,0,0,0.3)]">
        <AlertTriangle size={14} className="animate-pulse" />
        <span>OPERATION COUNTDOWN INITIALIZED</span>
      </div>

      <h2 className="font-compacta text-4xl sm:text-6xl md:text-7xl text-white tracking-widest mb-2 sm:mb-3">
        TIME UNTIL THE <span className="text-red-600 text-glow-red">HEIST BEGINS</span>
      </h2>
      <p className="font-mono-cyber text-gray-400 text-xs sm:text-sm max-w-xl mx-auto mb-6 sm:mb-8">
        TARGET DATE: <span className="text-red-500 font-bold">10 SEPTEMBER 2026</span> // SYSTEM LOCKDOWN IMMINENT
      </p>

      {/* Countdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="relative group bg-zinc-950/80 border border-red-900/40 rounded-xl p-4 sm:p-8 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:border-red-600 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Top LED bar */}
            <div className="absolute top-0 inset-x-4 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent group-hover:via-red-500 transition-all" />

            <div className="font-compacta text-5xl sm:text-7xl md:text-8xl text-white tracking-wider font-bold mb-1 text-glow-red">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="font-mono-cyber text-red-500 text-xs sm:text-sm tracking-[0.2em]">
              {unit.label}
            </div>

            {/* Corner tech notches */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-red-600/40 rounded-full" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600/40 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );

  if (isEmbedded) {
    return (
      <div id="countdown-section" className="relative w-full mb-4 sm:mb-6">
        {content}
      </div>
    );
  }

  return (
    <section id="countdown-section" className="relative py-24 bg-[#050505] border-t border-zinc-900 overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(230,0,0,0.12)_0%,transparent_70%)] pointer-events-none" />
      {content}
    </section>
  );
};

export default Countdown;
