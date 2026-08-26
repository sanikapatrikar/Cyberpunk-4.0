import React, { useState } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Stage1Entry from './components/Stage1Entry';
import Stage2EventSelection from './components/Stage2EventSelection';
import Stage3TeamSize from './components/Stage3TeamSize';
import Stage4ParticipantDetails from './components/Stage4ParticipantDetails';
import Stage5PaymentClearance from './components/Stage5PaymentClearance';
import Stage6FinalReview from './components/Stage6FinalReview';
import Stage7Success from './components/Stage7Success';
import { EVENT_DATABASE } from './constants/eventData';
import { GOOGLE_SCRIPT_URL } from './config/googleScriptConfig';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEventKey, setSelectedEventKey] = useState(null);
  const [selectedTeamSize, setSelectedTeamSize] = useState(null);
  const [formData, setFormData] = useState({});
  const [computedTotalAmount, setComputedTotalAmount] = useState(0);
  const [refCode, setRefCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectEvent = (key) => {
    setSelectedEventKey(key);
    // Reset team size if previous selection is incompatible
    if (selectedTeamSize) {
      const ev = EVENT_DATABASE[key];
      if (ev && !ev.allowedSizes.includes(selectedTeamSize)) {
        setSelectedTeamSize(null);
      }
    }
  };

  const handleSelectTeamSize = (size) => {
    setSelectedTeamSize(size);
  };

  const goToStep = (stepNumber) => {
    if (stepNumber < 1 || stepNumber > 7) return;

    // Navigation checks
    if (stepNumber > 2 && !selectedEventKey) {
      alert('SEC_WARN: Please select an Event Dossier first.');
      return;
    }
    if (stepNumber > 3 && !selectedTeamSize) {
      alert('SEC_WARN: Please select a Team Size configuration.');
      return;
    }

    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);

    try {
      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_DEPLOYED')) {
        console.warn('[FRONTEND SUBMIT] GOOGLE_SCRIPT_URL is not set yet. Simulating submission.');
      }

      let screenshotBase64 = '';
      let screenshotFileName = '';
      let screenshotMimeType = '';

      if (formData.screenshotFile) {
        screenshotFileName = formData.screenshotFile.name;
        screenshotMimeType = formData.screenshotFile.type;

        screenshotBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read payment screenshot file.'));
          };
          reader.readAsDataURL(formData.screenshotFile);
        });
      }

      // IMPORTANT:
      // Keep the exact payload structure used by the original working
      // HTML/JS registration system. The deployed Google Apps Script
      // expects event + teamSize + totalAmount + formData.
      const registrationData = {
        event: EVENT_DATABASE[selectedEventKey],
        teamSize: selectedTeamSize,
        totalAmount: computedTotalAmount,
        formData: { ...formData },
        timestamp: new Date().toISOString(),
      };

      // The screenshot File object itself is not JSON-serializable.
      // The original project converted it to Base64 and added these
      // fields to the top-level payload before sending it.
      if (screenshotBase64) {
        registrationData.screenshotBase64 = screenshotBase64;
        registrationData.screenshotFileName = screenshotFileName;
        registrationData.screenshotMimeType = screenshotMimeType;
      }

      console.log('[FRONTEND SUBMIT] Sending registration payload:', registrationData);

      if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('YOUR_DEPLOYED')) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(registrationData),
        });
      }

      // Generate reference code
      const randomHex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
        .toUpperCase();
      const generatedRefCode = `CYB-2026-${randomHex}`;
      setRefCode(generatedRefCode);

      goToStep(7);
    } catch (err) {
      console.error('[FRONTEND SUBMIT] Submission failed:', err);
      alert(`SUBMISSION FAILED: ${err.message}\n\nPlease check your connection and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="cyber-bg-grid"></div>
      <div className="scanline-overlay"></div>
      <div className="vignette-overlay"></div>

      <div className="app-viewport">
        <Header />

        <ProgressBar currentStep={currentStep} onGoToStep={goToStep} />

        <main className="terminal-container">
          <div className="terminal-header">
            <div className="terminal-title-group">
              <div className="terminal-dot"></div>
              <span className="terminal-title">TERMINAL // ACCESS_LEVEL_01</span>
            </div>
            <div className="classified-stamp">SECRET // EYES ONLY</div>
          </div>

          {currentStep === 1 && (
            <Stage1Entry onNext={() => goToStep(2)} />
          )}

          {currentStep === 2 && (
            <Stage2EventSelection
              selectedEventKey={selectedEventKey}
              onSelectEvent={handleSelectEvent}
              onNext={() => goToStep(3)}
            />
          )}

          {currentStep === 3 && (
            <Stage3TeamSize
              selectedEventKey={selectedEventKey}
              selectedTeamSize={selectedTeamSize}
              onSelectTeamSize={handleSelectTeamSize}
              onBack={() => goToStep(2)}
              onNext={() => goToStep(4)}
            />
          )}

          {currentStep === 4 && (
            <Stage4ParticipantDetails
              selectedTeamSize={selectedTeamSize}
              formData={formData}
              setFormData={setFormData}
              onBack={() => goToStep(3)}
              onNext={() => goToStep(5)}
            />
          )}

          {currentStep === 5 && (
            <Stage5PaymentClearance
              selectedEventKey={selectedEventKey}
              selectedTeamSize={selectedTeamSize}
              formData={formData}
              setFormData={setFormData}
              computedTotalAmount={computedTotalAmount}
              setComputedTotalAmount={setComputedTotalAmount}
              onBack={() => goToStep(4)}
              onNext={() => goToStep(6)}
            />
          )}

          {currentStep === 6 && (
            <Stage6FinalReview
              selectedEventKey={selectedEventKey}
              selectedTeamSize={selectedTeamSize}
              formData={formData}
              computedTotalAmount={computedTotalAmount}
              onGoToStep={goToStep}
              onConfirm={handleConfirmSubmission}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 7 && (
            <Stage7Success
              selectedEventKey={selectedEventKey}
              refCode={refCode}
            />
          )}
        </main>
      </div>
    </>
  );
}
