import React from 'react';
import { EVENT_DATABASE } from '../constants/eventData';

export default function Stage6FinalReview({
  selectedEventKey,
  selectedTeamSize,
  formData,
  computedTotalAmount,
  onGoToStep,
  onConfirm,
  isSubmitting,
}) {
  const ev = selectedEventKey ? EVENT_DATABASE[selectedEventKey] : null;

  const memberBlocks = [];
  for (let i = 1; i <= selectedTeamSize; i++) {
    const m = formData[`member_${i}`] || {};
    memberBlocks.push(
      <div
        key={i}
        style={{
          marginTop: '8px',
          paddingLeft: '10px',
          borderLeft: '2px solid var(--cyan-primary)',
        }}
      >
        <strong style={{ color: '#fff' }}>Member 0{i}:</strong> {m.fullName || 'N/A'} |{' '}
        {m.email || ''} | {m.phone || ''} <br />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {m.college || ''} ({m.branch || ''}, {m.year || ''}, Roll: {m.roll || ''})
        </span>
      </div>
    );
  }

  return (
    <section className="stage-section active">
      <div className="section-headline">
        <div className="section-tag">STEP 05 // FINAL REVIEW</div>
        <h2 className="section-title">OPERATION DOSSIER REVIEW</h2>
        <p className="section-subtitle">
          Verify all operative data and payment clearance before final confirmation.
        </p>
      </div>

      <div className="review-dossier-panel">
        <div className="review-section-block">
          <div className="review-header-flex">
            <span className="review-subhead">01. OPERATION & TEAM</span>
            <button className="edit-step-btn" onClick={() => onGoToStep(2)}>
              EDIT
            </button>
          </div>
          <div className="review-data-grid">
            <div>
              <div className="data-item-label">SELECTED EVENT</div>
              <div className="data-item-val">
                {ev ? `${ev.name} (${ev.code})` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="data-item-label">TEAM NAME</div>
              <div className="data-item-val">{formData.teamName || 'N/A'}</div>
            </div>
            <div>
              <div className="data-item-label">TEAM SIZE</div>
              <div className="data-item-val">{selectedTeamSize} Participant(s)</div>
            </div>
          </div>
        </div>

        <div className="review-section-block">
          <div className="review-header-flex">
            <span className="review-subhead">02. PARTICIPANT DOSSIERS</span>
            <button className="edit-step-btn" onClick={() => onGoToStep(4)}>
              EDIT
            </button>
          </div>
          {memberBlocks}
        </div>

        <div className="review-section-block">
          <div className="review-header-flex">
            <span className="review-subhead">03. PAYMENT CLEARANCE</span>
            <button className="edit-step-btn" onClick={() => onGoToStep(5)}>
              EDIT
            </button>
          </div>
          <div className="review-data-grid">
            <div>
              <div className="data-item-label">TOTAL AMOUNT PAID</div>
              <div className="data-item-val" style={{ color: 'var(--green-status)' }}>
                ₹{computedTotalAmount}
              </div>
            </div>
            <div>
              <div className="data-item-label">TRANSACTION ID</div>
              <div className="data-item-val" style={{ color: 'var(--cyan-primary)' }}>
                {formData.txId || 'N/A'}
              </div>
            </div>
            <div>
              <div className="data-item-label">PAYMENT PROOF</div>
              <div className="data-item-val">
                {formData.screenshotFile ? formData.screenshotFile.name : 'Uploaded'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons-group">
        <button
          onClick={() => onGoToStep(5)}
          className="cyber-btn cyber-btn-secondary"
          disabled={isSubmitting}
        >
          ← <span>EDIT DETAILS</span>
        </button>
        <button
          onClick={onConfirm}
          className="cyber-btn cyber-btn-primary"
          style={{
            background: 'var(--green-status)',
            color: '#000',
            boxShadow: '0 0 20px rgba(0, 255, 102, 0.4)',
          }}
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? 'TRANSMITTING DOSSIER...' : 'CONFIRM REGISTRATION ✓'}</span>
        </button>
      </div>
    </section>
  );
}
