import React, { useState, useEffect } from 'react';
import { EVENT_DATABASE } from '../constants/eventData';
import qrFallback from '../assets/QR.jpeg';

export default function Stage5PaymentClearance({
  selectedEventKey,
  selectedTeamSize,
  formData,
  setFormData,
  computedTotalAmount,
  setComputedTotalAmount,
  onBack,
  onNext,
}) {
  const [errors, setErrors] = useState({});
  const [qrSrc, setQrSrc] = useState(qrFallback);

  const ev = selectedEventKey ? EVENT_DATABASE[selectedEventKey] : null;
  const computedAmount = ev && selectedTeamSize ? ev.pricing[selectedTeamSize] || 0 : 0;

  useEffect(() => {
    setComputedTotalAmount(computedAmount);
    const upiUrl = `upi://pay?pa=8856813968@ptaxis&pn=Cyberpunk2K25&am=${computedAmount}&cu=INR`;
    const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
    setQrSrc(dynamicQrUrl);
  }, [computedAmount, setComputedTotalAmount]);

  const handleTxIdChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, txId: val }));
    if (errors.txId && val.trim().length >= 5) {
      setErrors((prev) => ({ ...prev, txId: false }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, screenshotFile: file }));
    if (errors.screenshotFile && file) {
      setErrors((prev) => ({ ...prev, screenshotFile: false }));
    }
  };

  const validateAndProceed = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.txId || !formData.txId.trim() || formData.txId.trim().length < 5) {
      newErrors.txId = true;
      isValid = false;
    }

    if (!formData.screenshotFile) {
      newErrors.screenshotFile = true;
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      onNext();
    }
  };

  const upiUrl = `upi://pay?pa=8856813968@ptaxis&pn=Cyberpunk2K25&am=${computedAmount}&cu=INR`;

  return (
    <section className="stage-section active">
      <div className="section-headline">
        <div className="section-tag">STEP 04 // PAYMENT CLEARANCE</div>
        <h2 className="section-title">CLEARANCE & SCAN</h2>
        <p className="section-subtitle">
          Review dynamic price calculation, scan payment QR, and submit transaction ID.
        </p>
      </div>

      <div className="payment-split-grid">
        {/* Price Calculation Panel */}
        <div className="price-summary-panel">
          <div>
            <div className="form-group-title">💳 PAYMENT SUMMARY</div>
            <table className="summary-table">
              <tbody>
                <tr>
                  <td className="label-col">Target Operation:</td>
                  <td className="val-col">{ev ? ev.name : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label-col">Operation Code:</td>
                  <td className="val-col">{ev ? ev.code : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label-col">Squad Configuration:</td>
                  <td className="val-col">
                    {selectedTeamSize === 1 ? 'Solo Operative' : `Team of ${selectedTeamSize}`}
                  </td>
                </tr>
                <tr>
                  <td className="label-col">Team Name:</td>
                  <td className="val-col">{formData.teamName || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label-col">Calculated Amount:</td>
                  <td
                    className="val-col"
                    style={{ color: 'var(--amber-warn)', fontWeight: 700 }}
                  >
                    ₹{computedAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="total-due-box">
            <div className="total-due-label">TOTAL AMOUNT DUE</div>
            <div className="total-due-amount">₹{computedAmount}</div>
          </div>
        </div>

        {/* QR Scan Panel */}
        <div className="qr-clearance-panel">
          <div className="form-group-title">🔍 SCAN UPI QR CODE</div>

          <div className="qr-scanner-frame">
            <div className="qr-scanner-line"></div>
            <img
              src={qrSrc}
              onError={() => setQrSrc(qrFallback)}
              alt="Payment QR Code"
            />
          </div>

          <div className="upi-instruction">
            <div style={{ marginBottom: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}>
              Scan with Google Pay / PhonePe / Paytm / BHIM
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--cyan-primary)',
                marginBottom: '10px',
              }}
            >
              Pre-filled scan amount:{' '}
              <strong style={{ color: 'var(--amber-warn)' }}>₹{computedAmount}</strong>
            </div>
            <a href={upiUrl} className="mobile-upi-btn">
              ⚡ TAP TO PAY ₹{computedAmount} DIRECTLY VIA UPI APP
            </a>
          </div>

          {/* Transaction Form Inputs */}
          <div style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
            <div className="input-field-wrapper" style={{ marginBottom: '14px' }}>
              <label className="field-label">
                Transaction ID / UTR Number <span className="req">*</span>
              </label>
              <input
                type="text"
                className={`cyber-input ${errors.txId ? 'invalid' : ''}`}
                placeholder="Enter 12-digit UPI Txn ID / UTR"
                value={formData.txId || ''}
                onChange={handleTxIdChange}
              />
              <span className={`field-error-msg ${errors.txId ? 'visible' : ''}`}>
                Valid Transaction ID required.
              </span>
            </div>

            <div className="input-field-wrapper">
              <label className="field-label">
                Upload Payment Screenshot <span className="req">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className={`cyber-input ${errors.screenshotFile ? 'invalid' : ''}`}
                onChange={handleFileChange}
              />
              <span
                className={`field-error-msg ${errors.screenshotFile ? 'visible' : ''}`}
              >
                Payment screenshot required.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons-group">
        <button onClick={onBack} className="cyber-btn cyber-btn-secondary">
          ← <span>BACK: DOSSIER</span>
        </button>
        <button onClick={validateAndProceed} className="cyber-btn cyber-btn-primary">
          <span>NEXT: FINAL REVIEW</span> →
        </button>
      </div>
    </section>
  );
}
