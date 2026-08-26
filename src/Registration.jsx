import React, { useMemo, useState } from "react";
import "./Registration.css";
import {
  EVENT_DATABASE,
  TEAM_SIZE_DATABASE,
  BRANCH_OPTIONS,
  YEAR_OPTIONS,
  getTeamSizeConfig,
} from "./registrationData";
import { GOOGLE_SCRIPT_URL } from "./googleScriptConfig";

const initialParticipant = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  branch: "",
  year: "",
  rollNo: "",
};

const emptyForm = {
  teamName: "",
  participants: [],
  transactionId: "",
  paymentScreenshot: null,
};

function Registration() {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedTeamSize, setSelectedTeamSize] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [referenceCode, setReferenceCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const teamConfig = useMemo(
    () => getTeamSizeConfig(selectedTeamSize),
    [selectedTeamSize]
  );

  const amount = teamConfig?.amount ?? 0;
  const participantCount = teamConfig?.count ?? 0;

  const updateForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateParticipant = (index, key, value) => {
    setForm((prev) => {
      const participants = [...prev.participants];
      participants[index] = { ...participants[index], [key]: value };
      return { ...prev, participants };
    });
  };

  const chooseEvent = (key) => {
    setSelectedEvent(key);
    setError("");
  };

  const chooseTeamSize = (key) => {
    const config = getTeamSizeConfig(key);
    setSelectedTeamSize(key);
    setForm((prev) => ({
      ...prev,
      participants: Array.from(
        { length: config.count },
        (_, i) => prev.participants[i] || { ...initialParticipant }
      ),
    }));
    setError("");
  };

  const next = () => {
    setError("");

    if (step === 1 && !selectedEvent) {
      setError("Select an event dossier to continue.");
      return;
    }

    if (step === 2 && !selectedTeamSize) {
      setError("Select a team configuration to continue.");
      return;
    }

    if (step === 3) {
      const missing = form.participants.some(
        (p) =>
          !p.fullName ||
          !p.email ||
          !p.phone ||
          !p.college ||
          !p.branch ||
          !p.year ||
          !p.rollNo
      );
      if (missing) {
        setError("Complete every participant field before continuing.");
        return;
      }
    }

    if (step === 4 && (!form.transactionId || !form.paymentScreenshot)) {
      setError("Enter the transaction ID and upload the payment screenshot.");
      return;
    }

    setStep((s) => Math.min(5, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const submitRegistration = async () => {
    setSubmitting(true);
    setError("");

    try {
      const screenshotBase64 = await toBase64(form.paymentScreenshot);
      const code =
        "CYB-2026-" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0")
          .toUpperCase();

      const payload = {
        eventKey: selectedEvent,
        eventName: EVENT_DATABASE[selectedEvent].name,
        teamSizeKey: selectedTeamSize,
        teamSize: teamConfig.label,
        participantCount,
        totalAmount: amount,
        teamName: form.teamName,
        participants: form.participants,
        transactionId: form.transactionId,
        screenshotBase64,
        screenshotFileName: form.paymentScreenshot.name,
        screenshotMimeType: form.paymentScreenshot.type,
        referenceCode: code,
        timestamp: new Date().toISOString(),
      };

      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
        throw new Error(
          "Google Sheet is not connected yet. Add your deployed Google Apps Script URL in googleScriptConfig.js."
        );
      }

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setReferenceCode(code);
      setStep(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedEvent("");
    setSelectedTeamSize("");
    setForm(emptyForm);
    setReferenceCode("");
    setError("");
  };

  return (
    <div className="cp-registration">
      <div className="cp-noise" />
      <div className="cp-red-glow cp-glow-one" />
      <div className="cp-red-glow cp-glow-two" />

      <header className="cp-reg-header">
        <div>
          <div className="cp-operation">OPERATION // CYBERPUNK 2026</div>
          <h1>CYBERPUNK <span>REGISTRATION</span></h1>
        </div>
        <div className="cp-system">
          <i /> SYSTEM ONLINE
        </div>
      </header>

      <div className="cp-progress">
        {["ENTRY", "EVENT", "TEAM", "DOSSIER", "PAYMENT", "CLEAR"].map(
          (label, index) => {
            const n = index + 1;
            return (
              <div
                key={label}
                className={`cp-progress-item ${step >= n ? "active" : ""}`}
              >
                <b>0{n}</b>
                <span>{label}</span>
              </div>
            );
          }
        )}
      </div>

      <main className="cp-terminal">
        <div className="cp-terminal-top">
          <span>◆ TERMINAL // ACCESS_LEVEL_01</span>
          <strong>SECRET // EYES ONLY</strong>
        </div>

        {error && <div className="cp-error">⚠ {error}</div>}

        {step === 1 && (
          <section className="cp-screen cp-entry">
            <div className="cp-stamp">SECURITY CLEARANCE REQUIRED</div>
            <h2>CYBERPUNK<br /><span>REGISTRATION</span></h2>
            <p className="cp-date">/// 10 SEPTEMBER 2026 ///</p>
            <blockquote>
              "Enter the operation. Assemble your crew, clear payment
              credentials, and secure your place in the grid."
            </blockquote>

            <div className="cp-event-grid">
              {Object.entries(EVENT_DATABASE).map(([key, event]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => chooseEvent(key)}
                  className={`cp-event-card ${
                    selectedEvent === key ? "selected" : ""
                  }`}
                >
                  <span className="cp-event-icon">{event.icon}</span>
                  <span>{event.name}</span>
                  <small>{event.shortDescription}</small>
                </button>
              ))}
            </div>

            <button className="cp-primary" onClick={next}>
              SELECT EVENT DOSSIER →
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="cp-screen">
            <div className="cp-section-kicker">STEP 02 // CREW CONFIGURATION</div>
            <h2>CHOOSE YOUR <span>CREW SIZE</span></h2>
            <p className="cp-muted">
              Select the number of operatives entering the operation.
            </p>

            <div className="cp-team-grid">
              {Object.entries(TEAM_SIZE_DATABASE).map(([key, item]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => chooseTeamSize(key)}
                  className={`cp-team-card ${
                    selectedTeamSize === key ? "selected" : ""
                  }`}
                >
                  <b>{item.label}</b>
                  <span>{item.count} operative{item.count > 1 ? "s" : ""}</span>
                  <strong>₹{item.amount}</strong>
                </button>
              ))}
            </div>

            <div className="cp-actions">
              <button className="cp-secondary" onClick={back}>← BACK</button>
              <button className="cp-primary" onClick={next}>NEXT →</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="cp-screen">
            <div className="cp-section-kicker">STEP 03 // OPERATIVE DOSSIER</div>
            <h2>ENTER <span>PARTICIPANT DETAILS</span></h2>

            <label className="cp-field">
              <span>TEAM / CREW CODENAME</span>
              <input
                value={form.teamName}
                onChange={(e) => updateForm("teamName", e.target.value)}
                placeholder="Optional crew name"
              />
            </label>

            <div className="cp-participants">
              {form.participants.map((participant, index) => (
                <div className="cp-participant" key={index}>
                  <div className="cp-participant-title">
                    <b>OPERATIVE 0{index + 1}</b>
                    <span>{index === 0 ? "TEAM LEADER" : "CREW MEMBER"}</span>
                  </div>

                  <div className="cp-form-grid">
                    <Field label="FULL NAME" value={participant.fullName}
                      onChange={(v) => updateParticipant(index, "fullName", v)} />
                    <Field label="EMAIL" type="email" value={participant.email}
                      onChange={(v) => updateParticipant(index, "email", v)} />
                    <Field label="PHONE" type="tel" value={participant.phone}
                      onChange={(v) => updateParticipant(index, "phone", v)} />
                    <Field label="COLLEGE" value={participant.college}
                      onChange={(v) => updateParticipant(index, "college", v)} />
                    <SelectField label="BRANCH" value={participant.branch}
                      options={BRANCH_OPTIONS}
                      onChange={(v) => updateParticipant(index, "branch", v)} />
                    <SelectField label="YEAR" value={participant.year}
                      options={YEAR_OPTIONS}
                      onChange={(v) => updateParticipant(index, "year", v)} />
                    <Field label="ROLL NO." value={participant.rollNo}
                      onChange={(v) => updateParticipant(index, "rollNo", v)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="cp-actions">
              <button className="cp-secondary" onClick={back}>← BACK</button>
              <button className="cp-primary" onClick={next}>PROCEED TO PAYMENT →</button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="cp-screen cp-payment">
            <div className="cp-section-kicker">STEP 04 // PAYMENT CLEARANCE</div>
            <h2>CLEAR THE <span>HEIST FUND</span></h2>

            <div className="cp-payment-layout">
              <div>
                <div className="cp-payment-meta">
                  <span>{EVENT_DATABASE[selectedEvent].name}</span>
                  <span>{teamConfig.label}</span>
                  <strong>₹{amount}</strong>
                </div>

                <div className="cp-qr-wrap">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
                      teamConfig.upi
                    )}`}
                    alt="Payment QR"
                  />
                </div>
                <p className="cp-upi">{teamConfig.upi}</p>
                <p className="cp-muted">Scan with any UPI application.</p>
              </div>

              <div className="cp-payment-form">
                <label className="cp-field">
                  <span>TRANSACTION ID / UTR</span>
                  <input
                    value={form.transactionId}
                    onChange={(e) =>
                      updateForm("transactionId", e.target.value)
                    }
                    placeholder="Enter payment reference"
                  />
                </label>

                <label className="cp-upload">
                  <span>PAYMENT SCREENSHOT</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateForm("paymentScreenshot", e.target.files?.[0] || null)
                    }
                  />
                </label>

                {form.paymentScreenshot && (
                  <div className="cp-file-ok">
                    ✓ {form.paymentScreenshot.name}
                  </div>
                )}
              </div>
            </div>

            <div className="cp-actions">
              <button className="cp-secondary" onClick={back}>← BACK</button>
              <button className="cp-primary" onClick={next}>REVIEW DOSSIER →</button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="cp-screen">
            <div className="cp-section-kicker">STEP 05 // FINAL REVIEW</div>
            <h2>VERIFY <span>YOUR DOSSIER</span></h2>

            <div className="cp-review">
              <ReviewRow label="EVENT" value={EVENT_DATABASE[selectedEvent].name} />
              <ReviewRow label="CREW SIZE" value={teamConfig.label} />
              <ReviewRow label="OPERATIVES" value={String(participantCount)} />
              <ReviewRow label="TOTAL" value={`₹${amount}`} />
              <ReviewRow label="TRANSACTION" value={form.transactionId} />
            </div>

            <div className="cp-review-members">
              {form.participants.map((p, i) => (
                <div key={i}>
                  <b>0{i + 1} — {p.fullName}</b>
                  <span>{p.college} · {p.branch} · {p.year}</span>
                </div>
              ))}
            </div>

            <div className="cp-actions">
              <button className="cp-secondary" onClick={back}>← EDIT</button>
              <button
                className="cp-primary"
                onClick={submitRegistration}
                disabled={submitting}
              >
                {submitting ? "TRANSMITTING..." : "CONFIRM REGISTRATION →"}
              </button>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="cp-screen cp-success">
            <div className="cp-success-icon">✓</div>
            <div className="cp-stamp">TRANSMISSION RECEIVED</div>
            <h2>HEIST <span>AUTHORIZED</span></h2>
            <p>Your registration dossier has been transmitted successfully.</p>

            <div className="cp-reference">
              <small>OPERATION REFERENCE</small>
              <strong>{referenceCode}</strong>
            </div>

            <button className="cp-primary" onClick={reset}>
              REGISTER ANOTHER CREW →
            </button>
          </section>
        )}
      </main>

      <footer className="cp-reg-footer">
        CYBERPUNK 2026 // AUTHORIZED REGISTRATION TERMINAL
      </footer>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="cp-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="cp-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">SELECT {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="cp-review-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default Registration;
