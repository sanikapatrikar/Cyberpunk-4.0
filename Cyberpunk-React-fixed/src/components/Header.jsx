import React, { useState, useEffect } from 'react';

export default function Header() {
  const [timeStr, setTimeStr] = useState('00:00:00 UTC+5.30');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC+5.30');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="hud-header">
      <div className="hud-brand">
        <span className="op-badge">OPERATION 2K26</span>
        <div className="op-title">
          CYBERPUNK <span>REGISTRATION</span>
        </div>
      </div>
      <div className="hud-status-bar">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>SYSTEM ONLINE</span>
        </div>
        <div className="hud-clock">{timeStr}</div>
      </div>
    </header>
  );
}
