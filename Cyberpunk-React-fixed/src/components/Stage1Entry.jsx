import React from 'react';

export default function Stage1Entry({ onNext }) {
  return (
    <section className="stage-section active">
      <div className="entry-hero">
        <div className="hero-op-tag">SECURITY CLEARANCE REQUIRED</div>
        <h1 className="hero-main-title">
          CYBERPUNK <span className="glitch-red">REGISTRATION</span>
        </h1>
        <div className="hero-date-banner">10 SEPTEMBER 2026</div>

        <p className="hero-cinematic-quote">
          "ENTER THE OPERATION. Lock in your operatives, clear payment credentials, and secure your place in the grid."
        </p>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={onNext}
            className="cyber-btn cyber-btn-primary"
          >
            <span>START REGISTRATION</span> →
          </button>
        </div>
      </div>
    </section>
  );
}
