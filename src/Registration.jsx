import React, { useEffect, useMemo, useState } from "react";
import { Terminal, Fingerprint, Cpu, Zap, ArrowRight, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import "./Registration.css";
import { playHeistClickSound } from "./utils/audio";
import {
  EVENT_DATABASE,
  TEAM_SIZE_DATABASE,
  BRANCH_OPTIONS,
  YEAR_OPTIONS,
  getTeamSizeConfig,
  getEventConfig,
  getEventPrice,
  getEventWhatsAppLink,
  getPaymentUpi,
} from "./registrationData";
import { GOOGLE_SCRIPT_URL } from "./googleScriptConfig";

const EVENT_ICONS = {
  HEIST: Terminal,
  DETECTYX: Fingerprint,
  WEB3: Cpu,
  NGV: Zap,
};

const PROGRESS_STEPS = [
  { step: 1, label: "EVENT" },
  { step: 2, label: "TEAM" },
  { step: 3, label: "DETAILS" },
  { step: 4, label: "PAYMENT" },
];

const createParticipant = () => ({
  fullName: "",
  email: "",
  phone: "",
  college: "",
  branch: "",
  year: "",
});

const createEmptyForm = () => ({
  teamName: "",
  participants: [],
  transactionId: "",
  paymentScreenshot: null,
});

function Registration() {
  const getInitialEvent = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const evt = params.get("event");
      return evt && EVENT_DATABASE[evt] ? evt : "";
    } catch (error) {
      return "";
    }
  };

  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(getInitialEvent);
  const [selectedTeamSize, setSelectedTeamSize] = useState("");
  const [form, setForm] = useState(createEmptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const evt = params.get("event");
    if (evt && EVENT_DATABASE[evt]) {
      setSelectedEvent(evt);
    }
  }, []);

  const teamConfig = useMemo(() => getTeamSizeConfig(selectedTeamSize), [selectedTeamSize]);
  const eventConfig = useMemo(() => getEventConfig(selectedEvent), [selectedEvent]);
  const amount = useMemo(() => getEventPrice(selectedEvent), [selectedEvent]);
  const participantCount = teamConfig?.count ?? 0;

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateParticipant = (index, key, value) => {
    setForm((prev) => {
      const participants = [...(prev.participants || [])];
      participants[index] = {
        ...(participants[index] || createParticipant()),
        [key]: value,
      };
      return { ...prev, participants };
    });
  };

  const chooseEvent = (key) => {
    playHeistClickSound();
    setSelectedEvent(key);
    setError("");
  };

  const chooseTeamSize = (key) => {
    playHeistClickSound();
    setSelectedTeamSize(key);
    setError("");

    const config = getTeamSizeConfig(key);
    if (!config) return;

    setForm((prev) => {
      const existing = [...(prev.participants || [])];
      const nextParticipants = Array.from({ length: config.count }, (_, index) => existing[index] || createParticipant());
      return { ...prev, participants: nextParticipants };
    });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim());

  const validatePhone = (phone) => {
    const cleaned = (phone || "").replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const validateParticipants = () => {
    if (!selectedTeamSize) return "Select a crew size to continue.";

    for (let i = 0; i < participantCount; i += 1) {
      const participant = form.participants[i] || createParticipant();

      if (!participant.fullName?.trim()) return `Enter the full name of operative ${i + 1}.`;
      if (!validateEmail(participant.email)) return `Enter a valid email for operative ${i + 1}.`;
      if (!validatePhone(participant.phone)) return `Enter a valid phone number for operative ${i + 1}.`;
      if (!participant.college?.trim()) return `Enter the college of operative ${i + 1}.`;
      if (!participant.branch) return `Select the branch of operative ${i + 1}.`;
      if (!participant.year) return `Select the year of operative ${i + 1}.`;
    }

    return "";
  };

  const next = () => {
    setError("");

    if (step === 1 && !selectedEvent) {
      setError("Select an event dossier to continue.");
      return;
    }

    if (step === 2 && !selectedTeamSize) {
      setError("Select a crew size to continue.");
      return;
    }

    if (step === 3) {
      const participantError = validateParticipants();
      if (participantError) {
        setError(participantError);
        return;
      }
    }

    if (step === 4) {
      if (!form.transactionId.trim()) {
        setError("Enter the transaction ID / UTR.");
        return;
      }
      if (!form.paymentScreenshot) {
        setError("Upload the payment screenshot.");
        return;
      }
    }

    setStep((current) => Math.min(4, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Payment screenshot is missing."));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).includes(",") ? String(reader.result).split(",")[1] : String(reader.result));
      reader.onerror = () => reject(new Error("Unable to read payment screenshot."));
      reader.readAsDataURL(file);
    });

  const submitRegistration = async () => {
    setSubmitting(true);
    setError("");

    try {
      const summary = form.participants.slice(0, participantCount).map((member) => ({
        fullName: member.fullName.trim(),
        email: member.email.trim(),
        phone: member.phone.trim(),
        college: member.college.trim(),
        branch: member.branch,
        year: member.year,
      }));

      const payload = {
        eventKey: selectedEvent,
        eventName: EVENT_DATABASE[selectedEvent]?.name || "",
        teamName: form.teamName.trim(),
        teamSizeKey: selectedTeamSize,
        teamSize: teamConfig?.label || "",
        participantCount,
        totalAmount: amount,
        participants: summary,
        transactionId: form.transactionId.trim(),
        timestamp: new Date().toISOString(),
      };

      if (form.paymentScreenshot) {
        payload.screenshotBase64 = await toBase64(form.paymentScreenshot);
        payload.screenshotFileName = form.paymentScreenshot.name;
        payload.screenshotMimeType = form.paymentScreenshot.type;
      }

      if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          mode: "no-cors",
          body: JSON.stringify(payload),
        });
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    playHeistClickSound();
    setStep(1);
    setSelectedEvent(getInitialEvent());
    setSelectedTeamSize("");
    setForm(createEmptyForm());
    setError("");
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedEventInfo = eventConfig || EVENT_DATABASE.HEIST;

  return (
    <div className="cp-registration">
      <header className="cp-reg-header">
        <div>
          <div className="cp-operation">OPERATION // CYBERPUNK 2026</div>
          <h1>
            CYBERPUNK <span>REGISTRATION</span>
          </h1>
        </div>
        <div className="cp-system">
          <i /> SYSTEM ONLINE
        </div>
      </header>

      <div className="cp-progress">
        {PROGRESS_STEPS.map((item) => (
          <div key={item.label} className={`cp-progress-item ${step >= item.step ? "active" : ""}`}>
            <b>{String(item.step).padStart(2, "0")}</b>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <main className="cp-terminal">
        <div className="cp-terminal-top">
          <span>◆ TERMINAL // ACCESS_LEVEL_04</span>
          <strong>SECRET // EYES ONLY</strong>
        </div>

        {error && <div className="cp-error">⚠ {error}</div>}

        {isSubmitted ? (
          <section className="cp-screen cp-entry">
            <div className="cp-stamp">CLEARANCE GRANTED</div>
            <h2>
              REGISTRATION<br />
              <span>SUCCESS</span>
            </h2>
            <p className="cp-date">Your team has been recorded for {selectedEventInfo.name}.</p>
            <div className="cp-panel" style={{ marginTop: "24px" }}>
              <div className="cp-panel-row">
                <span>Event</span>
                <strong>{selectedEventInfo.name}</strong>
              </div>
              <div className="cp-panel-row">
                <span>Team</span>
                <strong>{teamConfig?.label || ""}</strong>
              </div>
              <div className="cp-panel-row">
                <span>Amount</span>
                <strong>₹{amount}</strong>
              </div>
            </div>
            <button className="cp-btn cp-btn-primary" onClick={reset} style={{ marginTop: "24px" }}>
              REGISTER ANOTHER TEAM <ArrowRight size={18} />
            </button>
          </section>
        ) : (
          <>
            {step === 1 && (
              <section className="cp-screen cp-entry">
                <div className="cp-stamp">SECURITY CLEARANCE REQUIRED</div>
                <h2>
                  CYBERPUNK
                  <br />
                  <span>REGISTRATION</span>
                </h2>
                <p className="cp-date">/// 10 SEPTEMBER 2026 ///</p>

                <div className="cp-event-grid">
                  {Object.entries(EVENT_DATABASE).map(([key, event]) => {
                    const Icon = EVENT_ICONS[key] || Terminal;
                    const isSelected = selectedEvent === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        className={`cp-event-card ${isSelected ? "active" : ""}`}
                        onClick={() => chooseEvent(key)}
                      >
                        <div className="cp-event-topline">
                          <span>{event.name}</span>
                          <Icon size={18} />
                        </div>
                        <p>{event.shortDescription}</p>
                        <div className="cp-event-foot">
                          <strong>₹{event.price}</strong>
                          <small>{teamConfig?.label || "Team"}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="cp-actions">
                  <button type="button" className="cp-btn cp-btn-primary" onClick={next} disabled={!selectedEvent}>
                    NEXT <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="cp-screen cp-entry">
                <div className="cp-stamp">TEAM CONFIGURATION</div>
                <h2>
                  SELECT<br />
                  <span>Crew Size</span>
                </h2>

                <div className="cp-team-grid">
                  {Object.entries(TEAM_SIZE_DATABASE).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      className={`cp-team-card ${selectedTeamSize === key ? "active" : ""}`}
                      onClick={() => chooseTeamSize(key)}
                    >
                      <strong>{config.label}</strong>
                      <span>{config.description}</span>
                    </button>
                  ))}
                </div>

                <div className="cp-form-group" style={{ marginTop: "24px" }}>
                  <label>Team Name</label>
                  <input
                    value={form.teamName}
                    onChange={(event) => updateForm("teamName", event.target.value)}
                    placeholder="e.g. Red Team 7"
                  />
                </div>

                <div className="cp-actions split">
                  <button type="button" className="cp-btn" onClick={back}>
                    <ArrowLeft size={18} /> BACK
                  </button>
                  <button type="button" className="cp-btn cp-btn-primary" onClick={next} disabled={!selectedTeamSize}>
                    NEXT <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="cp-screen cp-entry">
                <div className="cp-stamp">OPERATIVE MATRIX</div>
                <h2>
                  REGISTER<br />
                  <span>Participants</span>
                </h2>

                {Array.from({ length: participantCount }, (_, index) => (
                  <div key={index} className="cp-participant-card" style={{ marginBottom: "18px" }}>
                    <div className="cp-card-title">Operative {index + 1}</div>
                    <div className="cp-input-grid">
                      <div className="cp-form-group">
                        <label>Full Name</label>
                        <input
                          value={form.participants[index]?.fullName || ""}
                          onChange={(event) => updateParticipant(index, "fullName", event.target.value)}
                          placeholder="Sergio Marquina"
                        />
                      </div>
                      <div className="cp-form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={form.participants[index]?.email || ""}
                          onChange={(event) => updateParticipant(index, "email", event.target.value)}
                          placeholder="name@email.com"
                        />
                      </div>
                      <div className="cp-form-group">
                        <label>Phone</label>
                        <input
                          value={form.participants[index]?.phone || ""}
                          onChange={(event) => updateParticipant(index, "phone", event.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="cp-form-group">
                        <label>College</label>
                        <input
                          value={form.participants[index]?.college || ""}
                          onChange={(event) => updateParticipant(index, "college", event.target.value)}
                          placeholder="College / University"
                        />
                      </div>
                      <div className="cp-form-group">
                        <label>Branch</label>
                        <select
                          value={form.participants[index]?.branch || ""}
                          onChange={(event) => updateParticipant(index, "branch", event.target.value)}
                        >
                          <option value="">Select branch</option>
                          {BRANCH_OPTIONS.map((branch) => (
                            <option key={branch} value={branch}>{branch}</option>
                          ))}
                        </select>
                      </div>
                      <div className="cp-form-group">
                        <label>Year</label>
                        <select
                          value={form.participants[index]?.year || ""}
                          onChange={(event) => updateParticipant(index, "year", event.target.value)}
                        >
                          <option value="">Select year</option>
                          {YEAR_OPTIONS.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="cp-actions split">
                  <button type="button" className="cp-btn" onClick={back}>
                    <ArrowLeft size={18} /> BACK
                  </button>
                  <button type="button" className="cp-btn cp-btn-primary" onClick={next}>
                    NEXT <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="cp-screen cp-entry">
                <div className="cp-stamp">PAYMENT CLEARANCE</div>
                <h2>
                  FINALIZE<br />
                  <span>Transaction</span>
                </h2>

                <div className="cp-panel" style={{ marginBottom: "20px" }}>
                  <div className="cp-panel-row">
                    <span>Event</span>
                    <strong>{selectedEventInfo.name}</strong>
                  </div>
                  <div className="cp-panel-row">
                    <span>Team Size</span>
                    <strong>{teamConfig?.label || ""}</strong>
                  </div>
                  <div className="cp-panel-row">
                    <span>Amount</span>
                    <strong>₹{amount}</strong>
                  </div>
                  <div className="cp-panel-row">
                    <span>UPI</span>
                    <strong>{getPaymentUpi(amount)}</strong>
                  </div>
                </div>

                <div className="cp-form-group">
                  <label>Transaction ID / UTR</label>
                  <input
                    value={form.transactionId}
                    onChange={(event) => updateForm("transactionId", event.target.value)}
                    placeholder="Tx ID / UTR"
                  />
                </div>

                <div className="cp-form-group">
                  <label>Payment Screenshot</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => updateForm("paymentScreenshot", event.target.files?.[0] || null)}
                  />
                  {form.paymentScreenshot && <small>Selected: {form.paymentScreenshot.name}</small>}
                </div>

                <div className="cp-actions split">
                  <button type="button" className="cp-btn" onClick={back}>
                    <ArrowLeft size={18} /> BACK
                  </button>
                  <button type="button" className="cp-btn cp-btn-primary" onClick={submitRegistration} disabled={submitting}>
                    {submitting ? "TRANSMITTING..." : <>CONFIRM <Send size={18} /></>}
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Registration;
