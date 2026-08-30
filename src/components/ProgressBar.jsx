import React from 'react';

export default function ProgressBar({ currentStep, onGoToStep }) {
  const steps = [
    { num: 1, label: 'Entry' },
    { num: 2, label: 'Event' },
    { num: 3, label: 'Team' },
    { num: 4, label: 'Dossier' },
    { num: 5, label: 'Clearance' },
    { num: 6, label: 'Review' },
  ];

  const fillPercent = Math.min(100, Math.max(0, ((currentStep - 1) / 5) * 100));

  return (
    <div className="stage-progress-bar">
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${fillPercent}%` }}
        ></div>
      </div>
      {steps.map((step) => {
        let nodeClass = 'step-node';
        if (step.num === currentStep) {
          nodeClass += ' active';
        } else if (step.num < currentStep) {
          nodeClass += ' completed';
        }

        return (
          <div
            key={step.num}
            className={nodeClass}
            onClick={() => onGoToStep(step.num)}
          >
            <div className="node-box">0{step.num}</div>
            <span className="node-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
