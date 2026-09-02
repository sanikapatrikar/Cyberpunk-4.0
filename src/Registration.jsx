import React, { useMemo, useState, useEffect } from "react";
import { Terminal, Fingerprint, Cpu, Zap, ArrowRight, ArrowLeft } from "lucide-react";
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

const EVENT_TEAM_RULES = {
  HEIST: { min: 2, max: 4 },
  DETECTYX: { min: 2, max: 4 },
  WEB3: { min: 3, max: 5 },
  NGV: { min: 2, max: 3 },
};

const getAvailableTeamSizes = (eventKey) => {
  const rule = EVENT_TEAM_RULES[eventKey];
  if (!rule) return Object.entries(TEAM_SIZE_DATABASE);

  const sizes = Object.entries(TEAM_SIZE_DATABASE).filter(
    ([, item]) =>
      Number(item?.count) >= rule.min &&
      Number(item?.count) <= rule.max
  );

  if (eventKey === "WEB3" && rule.max >= 5) {
    const hasFive = sizes.some(([, item]) => Number(item?.count) === 5);

    if (!hasFive) {
      const four = Object.entries(TEAM_SIZE_DATABASE).find(
        ([, item]) => Number(item?.count) === 4
      );

      if (four) {
        const [, item] = four;
        sizes.push([
          "WEB3_FIVE",
          {
            ...item,
            count: 5,
            label: "5 Members",
            description: "5 operatives",
          },
        ]);
      }
    }
  }

  return sizes;
};

const getSelectedTeamSizeConfig = (key) => {
  if (key === "WEB3_FIVE") {
    const four = Object.values(TEAM_SIZE_DATABASE).find(
      (item) => Number(item?.count) === 4
    );
    return four
      ? { ...four, count: 5, label: "5 Members", description: "5 operatives" }
      : null;
  }

  return getTeamSizeConfig(key);
};


const PROGRESS_STEPS = [
  { step: 1, label: "EVENT" },
  { step: 2, label: "DOSSIER" },
  { step: 3, label: "PAYMENT" },
  { step: 4, label: "REVIEW" },
  { step: 5, label: "CLEAR" },
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
  participants: [
    createParticipant(),
    createParticipant(),
    createParticipant(),
    createParticipant(),
    createParticipant(),
  ],
  transactionId: "",
  paymentScreenshot: null,
});

function Registration() {
  const getInitialEvent = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const evt = params.get("event");
      if (evt && EVENT_DATABASE[evt]) {
        return evt;
      }
    } catch (e) {}
    return "";
  };

  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(getInitialEvent);
  const [selectedTeamSize, setSelectedTeamSize] = useState("");
  const [form, setForm] = useState(createEmptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Cinematic terminal initialization states
  const [isInitializing, setIsInitializing] = useState(true);
  const [initStep, setInitStep] = useState(0);
  const [stageTransitionText, setStageTransitionText] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const evt = params.get("event");
    if (evt && EVENT_DATABASE[evt]) {
      setSelectedEvent(evt);
    }

    // Cinematic terminal initialization sequence (~4.6s total)
    const t1 = setTimeout(() => setInitStep(1), 800);
    const t2 = setTimeout(() => setInitStep(2), 1600);
    const t3 = setTimeout(() => setInitStep(3), 2500);
    const t4 = setTimeout(() => setInitStep(4), 3400);
    const t5 = setTimeout(() => {
      setIsInitializing(false);
    }, 4600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const teamConfig = useMemo(
    () => getSelectedTeamSizeConfig(selectedTeamSize),
    [selectedTeamSize]
  );

  const eventConfig = useMemo(
    () => getEventConfig(selectedEvent),
    [selectedEvent]
  );

  // SINGLE SOURCE OF TRUTH: Price is determined exclusively by selected event
  const amount = useMemo(
    () => getEventPrice(selectedEvent),
    [selectedEvent]
  );

  const participantCount = teamConfig?.count ?? 0;

  /* --------------------------------
    FORM HELPERS
  -------------------------------- */

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateParticipant = (index, key, value) => {
    setForm((prev) => {
      const participants = [...prev.participants];

      participants[index] = {
        ...(participants[index] || createParticipant()),
        [key]: value,
      };

      return {
        ...prev,
        participants,
      };
    });
  };

  /* --------------------------------
    EVENT SELECTION
  -------------------------------- */

  const chooseEvent = (key) => {
    playHeistClickSound();
    setSelectedEvent(key);
    setSelectedTeamSize("");
    setError("");
  };

  /* --------------------------------
    TEAM SIZE SELECTION (Dropdown)
  -------------------------------- */

  const chooseTeamSize = (key) => {
    playHeistClickSound();
    setSelectedTeamSize(key);

    if (!key) {
      setError("");
      return;
    }

    const config = getSelectedTeamSizeConfig(key);
    if (!config) {
      setError("Invalid team configuration.");
      return;
    }

    setForm((prev) => {
      const currentParticipants = [...prev.participants];
      while (currentParticipants.length < config.count) {
        currentParticipants.push(createParticipant());
      }
      return {
        ...prev,
        participants: currentParticipants,
      };
    });

    setError("");
  };

  /* --------------------------------
    VALIDATION
  -------------------------------- */

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const validateParticipants = () => {
    if (!selectedTeamSize || participantCount === 0) {
      return "Select a crew size to continue.";
    }

    const count = participantCount;
    for (let i = 0; i < count; i++) {
      const participant = form.participants[i] || createParticipant();

      if (!participant.fullName?.trim()) {
        return `Enter the full name of operative ${i + 1}.`;
      }

      if (!validateEmail(participant.email || "")) {
        return `Enter a valid email for operative ${i + 1}.`;
      }

      if (!validatePhone(participant.phone || "")) {
        return `Enter a valid phone number for operative ${i + 1}.`;
      }

      if (!participant.college?.trim()) {
        return `Enter the college of operative ${i + 1}.`;
      }

      if (!participant.branch) {
        return `Select the branch of operative ${i + 1}.`;
      }

      if (!participant.year) {
        return `Select the year of operative ${i + 1}.`;
      }
    }

    return "";
  };

  /* --------------------------------
    NEXT STEP
  -------------------------------- */

  const next = () => {
    setError("");

    if (step === 1) {
      if (!selectedEvent) {
        setError("Select an event dossier to continue.");
        return;
      }
    }

    if (step === 2) {
      if (!selectedTeamSize) {
        setError("Select a crew size to continue.");
        return;
      }

      if (!teamConfig) {
        setError("Invalid crew configuration.");
        return;
      }

      const allowedTeamSize = getAvailableTeamSizes(selectedEvent).some(
        ([key]) => key === selectedTeamSize
      );

      if (!allowedTeamSize) {
        setError("Selected crew size is not available for this event.");
        return;
      }

      if (!form.teamName.trim()) {
        setError("Enter a team / crew codename to continue.");
        return;
      }

      const participantError = validateParticipants();
      if (participantError) {
        setError(participantError);
        return;
      }
    }

    if (step === 3) {
      if (!form.transactionId.trim()) {
        setError("Enter the transaction ID / UTR.");
        return;
      }

      if (!form.paymentScreenshot) {
        setError("Upload the payment screenshot.");
        return;
      }
    }

    const stepMessages = {
      1: "TARGET ACQUIRED // ACCESSING OPERATIVE DOSSIER...",
      2: "OPERATIVE DOSSIER VERIFIED // ACCESSING PAYMENT...",
      3: "PAYMENT CREDENTIALS LOGGED // PREPARING REVIEW...",
    };

    const msg = stepMessages[step] || "UPDATING OPERATIVE DOSSIER...";
    setStageTransitionText(msg);
    playHeistClickSound();

    setTimeout(() => {
      setStageTransitionText("");
      setStep((currentStep) => Math.min(4, currentStep + 1));
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 350);
  };

  /* --------------------------------
    BACK
  -------------------------------- */

  const back = () => {
    setError("");
    playHeistClickSound();
    setStageTransitionText("RETURNING TO PREVIOUS STAGE...");

    setTimeout(() => {
      setStageTransitionText("");
      setStep((currentStep) => Math.max(1, currentStep - 1));
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 250);
  };

  /* --------------------------------
    FILE → BASE64
  -------------------------------- */

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Payment screenshot is missing."));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const result = String(reader.result);

        const base64 = result.includes(",")
          ? result.split(",")[1]
          : result;

        resolve(base64);
      };

      reader.onerror = () => {
        reject(
          new Error("Unable to read payment screenshot.")
        );
      };

      reader.readAsDataURL(file);
    });

  /* --------------------------------
    SUBMIT REGISTRATION
  -------------------------------- */

  const submitRegistration = async () => {
    setSubmitting(true);
    setError("");

    try {
      /* Check Google Apps Script URL */

      if (
        !GOOGLE_SCRIPT_URL ||
        GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")
      ) {
        throw new Error(
          "Google Sheet is not connected. Add your deployed Google Apps Script URL in googleScriptConfig.js."
        );
      }

      /* Final validation */

      if (!selectedEvent) {
        throw new Error("Event information is missing.");
      }

      if (!teamConfig) {
        throw new Error("Team configuration is missing.");
      }

      if (!form.teamName.trim()) {
        throw new Error("Team / crew codename is required.");
      }

      if (!form.transactionId.trim()) {
        throw new Error("Transaction ID / UTR is required.");
      }

      if (!form.paymentScreenshot) {
        throw new Error(
          "Payment screenshot is required."
        );
      }

      const participantError =
        validateParticipants();

      if (participantError) {
        throw new Error(participantError);
      }

      /* Convert screenshot */

      const screenshotBase64 =
        await toBase64(form.paymentScreenshot);

      /* --------------------------------
        CLEAN PARTICIPANT DATA (Only active operatives)
      -------------------------------- */

      const cleanParticipants =
        form.participants.slice(0, participantCount).map((participant) => ({
          fullName: participant.fullName.trim(),
          email: participant.email.trim(),
          phone: participant.phone
            .replace(/\s+/g, "")
            .trim(),
          college: participant.college.trim(),
          branch: participant.branch.trim(),
          year: participant.year.trim(),
        }));

      /* --------------------------------
        GOOGLE SHEETS PAYLOAD
      -------------------------------- */

      const payload = {
        eventKey: selectedEvent,
        eventName:
          EVENT_DATABASE[selectedEvent]?.name || "",
        teamSizeKey: selectedTeamSize,
        teamSize:
          teamConfig.label || "",
        participantCount,
        totalAmount: amount,
        teamName: form.teamName.trim(),
        participants: cleanParticipants,
        transactionId:
          form.transactionId.trim(),
        screenshotBase64,
        screenshotFileName:
          form.paymentScreenshot.name,
        screenshotMimeType:
          form.paymentScreenshot.type,
        timestamp:
          new Date().toISOString(),
      };

      console.log(
        "Sending registration:",
        payload
      );

      /* --------------------------------
        SEND TO GOOGLE APPS SCRIPT
      -------------------------------- */

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        setError(
          result.error || "Registration failed. Please check the transaction ID."
        );
        return;
      }

      /* --------------------------------
        SUCCESS
      -------------------------------- */

      setStep(5);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------------
    RESET
  -------------------------------- */

  const reset = () => {
    playHeistClickSound();
    setStep(1);
    setSelectedEvent("");
    setSelectedTeamSize("");
    setForm(createEmptyForm());
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* --------------------------------
    UI
  -------------------------------- */

  return (
    <div className="cp-registration">
      {/* Terminal Boot Sequence (First 4.6s) */}
      {isInitializing && (
        <div className="cp-init-overlay">
          <div className="cp-init-box">
            <div className="cp-init-header">
              <span className="cp-init-dot" />
              <span className="cp-init-title">// TERMINAL BOOT SEQUENCE</span>
            </div>
            <div className="cp-init-lines">
              <div className={`cp-init-line ${initStep >= 0 ? "active" : ""}`}>
                <span className="cp-init-prefix">&gt;</span> SYSTEM INITIALIZING...
              </div>
              <div className={`cp-init-line ${initStep >= 1 ? "active" : ""}`}>
                <span className="cp-init-prefix">&gt;</span> SECURE CHANNEL ESTABLISHED
              </div>
              <div className={`cp-init-line ${initStep >= 2 ? "active" : ""}`}>
                <span className="cp-init-prefix">&gt;</span> VERIFYING CREDENTIALS...
              </div>
              <div className={`cp-init-line ${initStep >= 3 ? "active" : ""}`}>
                <span className="cp-init-prefix">&gt;</span> DECODING PROTOCOLS...
              </div>
              <div className={`cp-init-line ${initStep >= 4 ? "active highlight" : ""}`}>
                <span className="cp-init-prefix">&gt;</span> ACCESS GRANTED [LEVEL_04]
              </div>
            </div>
            <div className="cp-init-progress-bar">
              <div
                className="cp-init-progress-fill"
                style={{ width: `${Math.min(100, (initStep + 1) * 20)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="cp-noise" />

      <div className="cp-red-glow cp-glow-one" />

      <div className="cp-red-glow cp-glow-two" />

      {/* HEADER */}

      <header className="cp-reg-header">
        <div>
          <div className="cp-operation">
            OPERATION // CYBERPUNK 2026
          </div>

          <h1>
            CYBERPUNK{" "}
            <span>REGISTRATION</span>
          </h1>
        </div>

        <div className="cp-system">
          <i /> SYSTEM ONLINE
        </div>
      </header>

      {/* PROGRESS */}

      <div className="cp-progress">
        {PROGRESS_STEPS.map((item) => (
          <div
            key={item.label}
            className={`cp-progress-item ${
              step >= item.step ? "active" : ""
            }`}
          >
            <b>
              {String(item.step).padStart(2, "0")}
            </b>

            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* TERMINAL */}

      <main className="cp-terminal">
        <div className="cp-terminal-top">
          <span>
            ◆ TERMINAL // ACCESS_LEVEL_04
          </span>

          <strong>
            SECRET // EYES ONLY
          </strong>
        </div>

        {/* Stage Transition HUD Banner */}
        {stageTransitionText && (
          <div className="cp-stage-transition-bar">
            <span className="cp-stage-transition-spinner" />
            <span className="cp-stage-transition-text">
              {stageTransitionText}
            </span>
          </div>
        )}

        {/* =====================================
            STEP 1: EVENT SELECTION
        ===================================== */}

        {step === 1 && (
          <section className="cp-screen cp-entry">
            <div className="cp-stamp">
              SECURITY CLEARANCE REQUIRED
            </div>

            <h2>
              CYBERPUNK
              <br />
              <span>REGISTRATION</span>
            </h2>

            <p className="cp-date">
              /// 10 SEPTEMBER 2026 ///
            </p>

            <blockquote>
              "Enter the operation. Assemble your
              crew, clear payment credentials, and
              secure your place in the grid."
            </blockquote>

            <div className="cp-event-grid">
              {Object.entries(
                EVENT_DATABASE
              ).map(([key, event]) => {
                const IconComp = EVENT_ICONS[key] || Terminal;
                const isSelected = selectedEvent === key;

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() =>
                      chooseEvent(key)
                    }
                    className={`cp-event-card ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                  >
                    {/* Targeting Precision Brackets on Selected Card */}
                    {isSelected && (
                      <>
                        <span className="cp-corner-bracket cp-tl" />
                        <span className="cp-corner-bracket cp-tr" />
                        <span className="cp-corner-bracket cp-bl" />
                        <span className="cp-corner-bracket cp-br" />
                        <div className="cp-target-scanner" />
                        <div className="cp-target-locked-badge">
                          <span className="cp-target-dot" /> TARGET LOCKED
                        </div>
                      </>
                    )}

                    <div className="cp-event-icon-wrap">
                      <IconComp size={22} strokeWidth={1.8} />
                    </div>

                    <span className="cp-event-card-title">
                      {event.name}
                    </span>

                    <small>
                      {event.shortDescription}
                    </small>

                    <div className="cp-event-card-fee">
                      ENTRY FEE: <strong>₹{event.price}</strong> / TEAM
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="cp-error">
                ⚠ {error}
              </div>
            )}

            <button
              className="cp-primary"
              onClick={next}
            >
              SELECT EVENT DOSSIER <ArrowRight size={18} className="cp-btn-icon" />
            </button>
          </section>
        )}

        {/* =====================================
            STEP 2: PARTICIPANT DETAILS (With Crew Size Dropdown)
        ===================================== */}

        {step === 2 && (
          <section className="cp-screen">
            <div className="cp-section-kicker">
              STEP 02 // OPERATIVE DOSSIER
            </div>

            <h2>
              ENTER{" "}
              <span>
                PARTICIPANT DETAILS
              </span>
            </h2>

            {/* EVENT & ENTRY FEE INFO BAR */}
            <div className="cp-dossier-info-bar">
              <div className="cp-dossier-meta-item">
                <span>EVENT DOSSIER</span>
                <strong>{eventConfig?.name || "SELECTED EVENT"}</strong>
              </div>
              <div className="cp-dossier-meta-item">
                <span>TOTAL ENTRY FEE</span>
                <strong className="cp-fee-highlight">₹{amount} / TEAM</strong>
              </div>
            </div>

            {/* CREW SIZE DROPDOWN & CODENAME */}
            <div className="cp-form-grid" style={{ marginTop: "24px" }}>
              <label className="cp-field">
                <span>CREW SIZE (REQUIRED)</span>

                <select
                  value={selectedTeamSize}
                  onChange={(e) =>
                    chooseTeamSize(e.target.value)
                  }
                  required
                  className="cp-crew-select"
                >
                  <option value="">
                    SELECT TEAM SIZE ▼
                  </option>
                  {getAvailableTeamSizes(selectedEvent).map(([key, item]) => (
                    <option
                      key={key}
                      value={key}
                    >
                      {item.label} ({item.description})
                    </option>
                  ))}
                </select>
              </label>

              <label className="cp-field">
                <span>
                  TEAM / CREW CODENAME
                </span>

                <input
                  type="text"
                  value={form.teamName}
                  onChange={(e) =>
                    updateForm(
                      "teamName",
                      e.target.value
                    )
                  }
                  placeholder="Enter crew codename"
                  maxLength={50}
                />
              </label>
            </div>

            {/* DYNAMIC PARTICIPANTS BASED ON SELECTED CREW SIZE */}
            {!selectedTeamSize || participantCount === 0 ? (
              <div className="cp-select-crew-prompt">
                <span className="cp-prompt-dot" />
                <span>SELECT A CREW SIZE ABOVE TO GENERATE OPERATIVE FORMS</span>
              </div>
            ) : (
              <div className="cp-participants">
                {form.participants.slice(0, participantCount).map(
                  (participant, index) => (
                    <div
                      className="cp-participant"
                      key={index}
                    >
                      <div className="cp-participant-title">
                        <b>
                          OPERATIVE{" "}
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </b>

                        <span>
                          {index === 0
                            ? "TEAM LEADER"
                            : "CREW MEMBER"}
                        </span>
                      </div>

                      <div className="cp-form-grid">
                        <Field
                          label="FULL NAME"
                          value={
                            participant.fullName
                          }
                          onChange={(value) =>
                            updateParticipant(
                              index,
                              "fullName",
                              value
                            )
                          }
                        />

                        <Field
                          label="EMAIL"
                          type="email"
                          value={
                            participant.email
                          }
                          onChange={(value) =>
                            updateParticipant(
                              index,
                              "email",
                              value
                            )
                          }
                        />

                        <Field
                          label="PHONE"
                          type="tel"
                          value={
                            participant.phone
                          }
                          onChange={(value) =>
                            updateParticipant(
                              index,
                              "phone",
                              value
                            )
                          }
                        />

                        <Field
                          label="COLLEGE"
                          value={
                            participant.college
                          }
                          onChange={(value) =>
                            updateParticipant(
                              index,
                              "college",
                              value
                            )
                          }
                        />

                        <SelectField
                          label="BRANCH"
                          value={
                            participant.branch
                          }
                          options={
                            BRANCH_OPTIONS
                          }
                          onChange={(value) =>
                            updateParticipant(
                              index,
                              "branch",
                              value
                            )
                          }
                        />

                        <SelectField
                          label="YEAR"
                          value={
                            participant.year
                          }
                          options={
                            YEAR_OPTIONS
                          }
                          onChange={(value) =>
                            updateParticipant(
                              index,
                              "year",
                              value
                            )
                          }
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {error && (
              <div className="cp-error">
                ⚠ {error}
              </div>
            )}

            <div className="cp-actions">
              <button
                className="cp-secondary"
                onClick={back}
              >
                ← BACK
              </button>

              <button
                className="cp-primary"
                onClick={next}
              >
                PROCEED TO PAYMENT →
              </button>
            </div>
          </section>
        )}

        {/* =====================================
            STEP 3: PAYMENT CLEARANCE
        ===================================== */}

        {step === 3 && (
          <section className="cp-screen cp-payment">
            <div className="cp-section-kicker">
              STEP 03 // PAYMENT CLEARANCE
            </div>

            <h2>
              CLEAR THE{" "}
              <span>HEIST FUND</span>
            </h2>

            <div className="cp-payment-layout">
              {/* PAYMENT DETAILS */}

              <div>
                <div className="cp-payment-meta">
                  <span>
                    {eventConfig?.name}
                  </span>

                  <span>
                    {teamConfig?.label} ({participantCount} Operative{participantCount > 1 ? "s" : ""})
                  </span>

                  <strong>
                    ₹{amount}
                  </strong>
                </div>

                <div className="cp-qr-wrap">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
                      getPaymentUpi(amount)
                    )}`}
                    alt="Payment QR"
                  />
                </div>

                <p className="cp-upi">
                  
                </p>

                <p className="cp-muted">
                  Scan with any UPI application.
                </p>
              </div>

              {/* PAYMENT FORM */}

              <div className="cp-payment-form">
                <label className="cp-field">
                  <span>
                    TRANSACTION ID / UTR
                  </span>

                  <input
                    type="text"
                    value={form.transactionId}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^A-Za-z0-9]/g, "")
                        .slice(0, 12);

                      setForm((prev) => ({
                        ...prev,
                        transactionId: value,
                      }));
                    }}
                    placeholder="Enter 12-character UTR / Transaction ID"
                    maxLength={12}
                    minLength={12}
                    required
                    pattern="[A-Za-z0-9]{12}"
                  />
                </label>

                <label className="cp-upload">
                  <span>
                    PAYMENT SCREENSHOT
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/pdf"
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0] ||
                        null;

                      if (!file) {
                        updateForm(
                          "paymentScreenshot",
                          null
                        );
                        return;
                      }

                      /* Maximum 5 MB */

                      if (
                        file.size >
                        5 * 1024 * 1024
                      ) {
                        setError(
                          "Payment screenshot must be smaller than 5 MB."
                        );

                        e.target.value = "";
                        return;
                      }

                      setError("");

                      updateForm(
                        "paymentScreenshot",
                        file
                      );
                    }}
                  />
                </label>

                {form.paymentScreenshot && (
                  <div className="cp-file-ok">
                    ✓{" "}
                    {
                      form
                        .paymentScreenshot
                        .name
                    }
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="cp-error">
                ⚠ {error}
              </div>
            )}

            <div className="cp-actions">
              <button
                className="cp-secondary"
                onClick={back}
              >
                ← BACK
              </button>

              <button
                className="cp-primary"
                onClick={next}
              >
                REVIEW DOSSIER →
              </button>
            </div>
          </section>
        )}

        {/* =====================================
            STEP 4: FINAL REVIEW
        ===================================== */}

        {step === 4 && (
          <section className="cp-screen">
            <div className="cp-section-kicker">
              STEP 04 // FINAL REVIEW
            </div>

            <h2>
              VERIFY{" "}
              <span>YOUR DOSSIER</span>
            </h2>

            <div className="cp-review">
              <ReviewRow
                label="EVENT"
                value={eventConfig?.name || "-"}
              />

              <ReviewRow
                label="CREW SIZE"
                value={`${teamConfig?.label || "-"} (${participantCount} Operative${participantCount > 1 ? "s" : ""})`}
              />

              {form.teamName && (
                <ReviewRow
                  label="CREW CODENAME"
                  value={form.teamName}
                />
              )}

              <ReviewRow
                label="TOTAL ENTRY FEE"
                value={`₹${amount}`}
              />

              <ReviewRow
                label="TRANSACTION / UTR"
                value={
                  form.transactionId
                }
              />
            </div>

            <div className="cp-review-members">
              {form.participants.slice(0, participantCount).map(
                (participant, index) => (
                  <div key={index}>
                    <b>
                      {String(
                        index + 1
                      ).padStart(2, "0")}{" "}
                      —{" "}
                      {
                        participant.fullName
                      }
                      {index === 0 && " [TEAM LEADER]"}
                    </b>

                    <span>
                      {
                        participant.college
                      }{" "}
                      ·{" "}
                      {
                        participant.branch
                      }{" "}
                      ·{" "}
                      {participant.year}
                    </span>
                  </div>
                )
              )}
            </div>

            {error && (
              <div className="cp-error">
                ⚠ {error}
              </div>
            )}

            <div className="cp-actions">
              <button
                className="cp-secondary"
                onClick={back}
                disabled={submitting}
              >
                ← EDIT
              </button>

              <button
                className="cp-primary"
                onClick={
                  submitRegistration
                }
                disabled={submitting}
              >
                {submitting
                  ? "TRANSMITTING..."
                  : "CONFIRM REGISTRATION →"}
              </button>
            </div>
          </section>
        )}

        {/* =====================================
            STEP 5: SUCCESS
        ===================================== */}

        {step === 5 && (
          <section className="cp-screen cp-success">
            <div className="cp-clearance-auth-box">
              <div className="cp-clearance-line">
                <span className="cp-clearance-prefix">&gt;</span> STATUS // AUTHENTICATING CLEARANCE...
              </div>
              <div className="cp-clearance-meter">
                <div className="cp-clearance-meter-fill" />
              </div>
              <div className="cp-clearance-granted">
                [████████████████ 100%] ACCESS GRANTED // OPERATION ACTIVE
              </div>
            </div>

            <div className="cp-success-icon">
              ✓
            </div>

            <div className="cp-stamp">
              TRANSMISSION RECEIVED // CLEARANCE LEVEL 04
            </div>

            <h2 className="cp-success-title">
              REGISTRATION <span>AUTHORIZED</span>
            </h2>

            <p className="cp-success-desc">
              Your registration dossier for <strong>{eventConfig?.name || "the operation"}</strong> has been
              transmitted successfully.
            </p>

            <p className="cp-success-muted">
              Your registration details have been logged to the secure registration database.
            </p>

            {/* EVENT-SPECIFIC WHATSAPP CREW CHANNEL */}
            <div className="cp-whatsapp-card">
              <div className="cp-whatsapp-header">
                <span className="cp-whatsapp-kicker">// OFFICIAL CREW CHANNEL</span>
                <h3 className="cp-whatsapp-title">JOIN THE CREW</h3>
                <p className="cp-whatsapp-desc">
                  Enter the secure crew channel for mission updates, announcements and event coordination.
                </p>
              </div>

              <a
                href={getEventWhatsAppLink(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-whatsapp-btn"
              >
                <WhatsAppIcon size={20} className="cp-whatsapp-icon" />
                <span>JOIN WHATSAPP CREW →</span>
              </a>
            </div>

            <button
              className="cp-secondary cp-reset-btn"
              onClick={reset}
            >
              REGISTER ANOTHER CREW →
            </button>
          </section>
        )}
      </main>

      {/* FOOTER */}

      <footer className="cp-reg-footer">
        CYBERPUNK 2026 // AUTHORIZED REGISTRATION
        TERMINAL
      </footer>
    </div>
  );
}

/* ==========================================
  WHATSAPP VECTOR ICON
========================================== */

function WhatsAppIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ==========================================
  TEXT / INPUT FIELD
========================================== */

function Field({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="cp-field">
      <span>{label}</span>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        required
      />
    </label>
  );
}

/* ==========================================
  SELECT FIELD
========================================== */

function SelectField({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label className="cp-field">
      <span>{label}</span>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        required
      >
        <option value="">
          SELECT {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ==========================================
  REVIEW ROW
========================================== */

function ReviewRow({
  label,
  value,
}) {
  return (
    <div className="cp-review-row">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

export default Registration;