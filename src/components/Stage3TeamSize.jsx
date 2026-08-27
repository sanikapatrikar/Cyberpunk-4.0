import React from 'react';
import { EVENT_DATABASE } from '../constants/eventData';

export default function Stage3TeamSize({ selectedEventKey, selectedTeamSize, onSelectTeamSize, onBack, onNext }) {
  const ev = selectedEventKey ? EVENT_DATABASE[selectedEventKey] : null;
  const allowedSizes = ev ? ev.allowedSizes : [];

  const teamSizes = [
    { size: 1, label: 'Solo (1 Member)' },
    { size: 2, label: 'Duo (2 Members)' },
    { size: 3, label: 'Trio (3 Members)' },
    { size: 4, label: 'Squad (4 Members)' },
    
  ];

  return (
    <section className="stage-section active">
      <div className="section-headline">
        <div className="section-tag">STEP 02 // SQUAD CONFIGURATION</div>
        <h2 className="section-title">CHOOSE TEAM SIZE</h2>
        <p className="section-subtitle">
          Select operative count. Unavailable squad sizes for selected event are disabled automatically.
        </p>
      </div>

      <div className="team-size-cards">
        {teamSizes.map((item) => {
          const isAllowed = allowedSizes.includes(item.size);
          const isSelected = selectedTeamSize === item.size;
          let cardClass = 'team-card-option';
          if (!isAllowed) cardClass += ' disabled';
          if (isSelected && isAllowed) cardClass += ' selected';

          return (
            <div
              key={item.size}
              className={cardClass}
              onClick={() => {
                if (isAllowed) onSelectTeamSize(item.size);
              }}
            >
              <div className="team-size-number">0{item.size}</div>
              <div className="team-size-label">{item.label}</div>
            </div>
          );
        })}
      </div>

      <div className="action-buttons-group">
        <button onClick={onBack} className="cyber-btn cyber-btn-secondary">
          ← <span>BACK: EVENTS</span>
        </button>
        <button
          onClick={onNext}
          className="cyber-btn cyber-btn-primary"
          disabled={!selectedTeamSize}
        >
          <span>NEXT: PARTICIPANT DOSSIER</span> →
        </button>
      </div>
    </section>
  );
}
