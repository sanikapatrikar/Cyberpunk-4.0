import React, { useState } from 'react';
import { BRANCH_OPTIONS, YEAR_OPTIONS } from '../constants/eventData';
 
export default function Stage4ParticipantDetails({
  selectedTeamSize,
  formData,
  setFormData,
  onBack,
  onNext,
}) {
  const [errors, setErrors] = useState({});
 
  const handleTeamNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, teamName: val }));
    if (errors.teamName && val.trim()) {
      setErrors((prev) => ({ ...prev, teamName: false }));
    }
  };
 
  const handleMemberChange = (memberIndex, field, value) => {
    setFormData((prev) => {
      const currentMember = prev[`member_${memberIndex}`] || {};
      return {
        ...prev,
        [`member_${memberIndex}`]: {
          ...currentMember,
          [field]: value,
        },
      };
    });
 
    const errKey = `member_${memberIndex}_${field}`;
    if (errors[errKey]) {
      setErrors((prev) => ({ ...prev, [errKey]: false }));
    }
  };
 
  // Used to reject "garbage" input (e.g. "1234", "....", "     ")
  // in fields that must contain a real name/place - i.e. at least one letter.
  const hasLetter = /[a-zA-Z]/;
 
  const validateAndProceed = () => {
    const newErrors = {};
    let isValid = true;
 
    // Validate Team Name
    if (!formData.teamName || !formData.teamName.trim() || !hasLetter.test(formData.teamName)) {
      newErrors.teamName = true;
      isValid = false;
    }
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
 
    for (let i = 1; i <= selectedTeamSize; i++) {
      const mem = formData[`member_${i}`] || {};
 
      if (!mem.fullName || !mem.fullName.trim() || !hasLetter.test(mem.fullName)) {
        newErrors[`member_${i}_fullName`] = true;
        isValid = false;
      }
      if (!mem.email || !emailRegex.test(mem.email.trim())) {
        newErrors[`member_${i}_email`] = true;
        isValid = false;
      }
      if (!mem.phone || !phoneRegex.test(mem.phone.trim())) {
        newErrors[`member_${i}_phone`] = true;
        isValid = false;
      }
      if (!mem.college || !mem.college.trim() || !hasLetter.test(mem.college)) {
        newErrors[`member_${i}_college`] = true;
        isValid = false;
      }
      if (!mem.branch) {
        newErrors[`member_${i}_branch`] = true;
        isValid = false;
      }
      if (!mem.year) {
        newErrors[`member_${i}_year`] = true;
        isValid = false;
      }
    }
 
    setErrors(newErrors);
 
    if (isValid) {
      onNext();
    }
  };
 
  const memberCards = [];
  for (let i = 1; i <= selectedTeamSize; i++) {
    const memData = formData[`member_${i}`] || {};
 
    memberCards.push(
      <div key={i} className="form-group-card">
        <div className="form-group-header">
          <div className="form-group-title">
            👤 Participant 0{i} {i === 1 ? '(Team Leader)' : ''}
          </div>
          <span className="op-badge">MEMBER #{i}</span>
        </div>
        <div className="fields-row">
          <div className="input-field-wrapper">
            <label className="field-label">
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              className={`cyber-input ${errors[`member_${i}_fullName`] ? 'invalid' : ''}`}
              placeholder="Operative full name"
              value={memData.fullName || ''}
              onChange={(e) => handleMemberChange(i, 'fullName', e.target.value)}
            />
            <span
              className={`field-error-msg ${
                errors[`member_${i}_fullName`] ? 'visible' : ''
              }`}
            >
              Full name required.
            </span>
          </div>
 
          <div className="input-field-wrapper">
            <label className="field-label">
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              className={`cyber-input ${errors[`member_${i}_email`] ? 'invalid' : ''}`}
              placeholder="operative@domain.com"
              value={memData.email || ''}
              onChange={(e) => handleMemberChange(i, 'email', e.target.value)}
            />
            <span
              className={`field-error-msg ${
                errors[`member_${i}_email`] ? 'visible' : ''
              }`}
            >
              Valid email required.
            </span>
          </div>
 
          <div className="input-field-wrapper">
            <label className="field-label">
              Phone Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              maxLength="10"
              className={`cyber-input ${errors[`member_${i}_phone`] ? 'invalid' : ''}`}
              placeholder="10-digit mobile number"
              value={memData.phone || ''}
              onChange={(e) => handleMemberChange(i, 'phone', e.target.value)}
            />
            <span
              className={`field-error-msg ${
                errors[`member_${i}_phone`] ? 'visible' : ''
              }`}
            >
              10-digit phone required.
            </span>
          </div>
 
          <div className="input-field-wrapper">
            <label className="field-label">
              College Name <span className="req">*</span>
            </label>
            <input
              type="text"
              className={`cyber-input ${errors[`member_${i}_college`] ? 'invalid' : ''}`}
              placeholder="Institution / College"
              value={memData.college || ''}
              onChange={(e) => handleMemberChange(i, 'college', e.target.value)}
            />
            <span
              className={`field-error-msg ${
                errors[`member_${i}_college`] ? 'visible' : ''
              }`}
            >
              College name required.
            </span>
          </div>
 
          <div className="input-field-wrapper">
            <label className="field-label">
              Branch <span className="req">*</span>
            </label>
            <select
              className={`cyber-select ${errors[`member_${i}_branch`] ? 'invalid' : ''}`}
              value={memData.branch || ''}
              onChange={(e) => handleMemberChange(i, 'branch', e.target.value)}
            >
              <option value="">Select Branch</option>
              {BRANCH_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <span
              className={`field-error-msg ${
                errors[`member_${i}_branch`] ? 'visible' : ''
              }`}
            >
              Select a branch.
            </span>
          </div>
 
          <div className="input-field-wrapper">
            <label className="field-label">
              Academic Year <span className="req">*</span>
            </label>
            <select
              className={`cyber-select ${errors[`member_${i}_year`] ? 'invalid' : ''}`}
              value={memData.year || ''}
              onChange={(e) => handleMemberChange(i, 'year', e.target.value)}
            >
              <option value="">Select Year</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <span
              className={`field-error-msg ${
                errors[`member_${i}_year`] ? 'visible' : ''
              }`}
            >
              Select year.
            </span>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <section className="stage-section active">
      <div className="section-headline">
        <div className="section-tag">STEP 03 // OPERATIVE DOSSIERS</div>
        <h2 className="section-title">PARTICIPANT DETAILS</h2>
        <p className="section-subtitle">
          Fill in complete identity information for all team operatives.
        </p>
      </div>
 
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid-layout">
          <div className="form-group-card">
            <div className="form-group-header">
              <div className="form-group-title">🛡️ Team Identity</div>
              <span className="classified-stamp">REQUIRED</span>
            </div>
            <div className="input-field-wrapper full-width">
              <label className="field-label">
                Team Designation / Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className={`cyber-input ${errors.teamName ? 'invalid' : ''}`}
                placeholder="e.g. CYBER_SHADOWS_X"
                value={formData.teamName || ''}
                onChange={handleTeamNameChange}
              />
              <span className={`field-error-msg ${errors.teamName ? 'visible' : ''}`}>
                Team name is required.
              </span>
            </div>
          </div>
 
          {memberCards}
        </div>
 
        <div className="action-buttons-group">
          <button type="button" onClick={onBack} className="cyber-btn cyber-btn-secondary">
            ← <span>BACK: TEAM SIZE</span>
          </button>
          <button
            type="button"
            onClick={validateAndProceed}
            className="cyber-btn cyber-btn-primary"
          >
            <span>NEXT: PAYMENT CLEARANCE</span> →
          </button>
        </div>
      </form>
    </section>
  );
}
