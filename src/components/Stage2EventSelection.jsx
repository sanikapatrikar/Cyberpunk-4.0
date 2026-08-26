import React from 'react';
import { EVENT_DATABASE } from '../constants/eventData';

export default function Stage2EventSelection({ selectedEventKey, onSelectEvent, onNext }) {
  return (
    <section className="stage-section active">
      <div className="section-headline">
        <div className="section-tag">STEP 01 // EVENT SELECTION</div>
        <h2 className="section-title">CHOOSE YOUR MISSION</h2>
        <p className="section-subtitle">Select an target operational event to unlock configuration options.</p>
      </div>

      <div className="events-grid">
        {Object.keys(EVENT_DATABASE).map((key) => {
          const ev = EVENT_DATABASE[key];
          const isSelected = selectedEventKey === key;
          const minPrice = Math.min(...Object.values(ev.pricing));
          const sizeRangeStr =
            ev.allowedSizes.length > 1
              ? `${ev.allowedSizes[0]}-${ev.allowedSizes[ev.allowedSizes.length - 1]} Members`
              : 'Solo Event';

          return (
            <div
              key={key}
              className={`event-dossier-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectEvent(key)}
            >
              <div>
                <div className="event-icon">{ev.icon}</div>
                <div className="event-code">{ev.code}</div>
                <div className="event-name">{ev.name}</div>
                <div className="event-desc">{ev.desc}</div>
              </div>
              <div className="event-footer">
                <span className="event-fee-tag">From ₹{minPrice}</span>
                <span className="event-team-range">{sizeRangeStr}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="action-buttons-group action-buttons-end">
        <button
          onClick={onNext}
          className="cyber-btn cyber-btn-primary"
          disabled={!selectedEventKey}
        >
          <span>NEXT: TEAM SIZE</span> →
        </button>
      </div>
    </section>
  );
}
