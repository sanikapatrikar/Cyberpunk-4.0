import React from 'react';
import { EVENT_DATABASE } from '../constants/eventData';

export default function Stage7Success({ selectedEventKey, refCode }) {
  const ev = selectedEventKey ? EVENT_DATABASE[selectedEventKey] : null;

  return (
    <section className="stage-section active">
      <div className="success-screen-panel">
        <div className="success-stamp-badge">MISSION ACCEPTED</div>
        <h2 className="section-title" style={{ color: 'var(--green-status)' }}>
          REGISTRATION COMPLETE
        </h2>
        <p className="section-subtitle" style={{ marginTop: '10px' }}>
          Your operative dossier has passed frontend clearance check.
        </p>

        <div className="ref-code-box">
          <div className="ref-code-title">TEMPORARY REGISTRATION REFERENCE</div>
          <div className="ref-code-val">{refCode || 'CYB-2026-XXXXX'}</div>
        </div>

        {ev && ev.whatsapp && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div className="whatsapp-community-card">
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  color: '#fff',
                  marginBottom: '6px',
                }}
              >
                JOIN {ev.name.toUpperCase()} OPERATIVE GROUP
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Connect with team mentors, receive mission schedules, and access live announcements.
              </p>

              <a
                href={ev.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <span>JOIN OFFICIAL WHATSAPP GROUP</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
