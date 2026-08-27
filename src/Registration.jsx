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
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedTeamSize, setSelectedTeamSize] = useState("");
  const [form, setForm] = useState(createEmptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const teamConfig = useMemo(
    () => getTeamSizeConfig(selectedTeamSize),
    [selectedTeamSize]
  );

  const amount = teamConfig?.amount ?? 0;
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
        ...participants[index],
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
    setSelectedEvent(key);
    setError("");
  };

  /* --------------------------------
     TEAM SIZE
  -------------------------------- */

  const chooseTeamSize = (key) => {
    const config = getTeamSizeConfig(key);

    if (!config) {
      setError("Invalid team configuration.");
      return;
    }

    setSelectedTeamSize(key);

    setForm((prev) => ({
      ...prev,
      participants: Array.from(
        { length: config.count },
        (_, index) =>
          prev.participants[index] || createParticipant()
      ),
    }));

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
    for (let i = 0; i < form.participants.length; i++) {
      const participant = form.participants[i];

      if (!participant.fullName.trim()) {
        return `Enter the full name of operative ${i + 1}.`;
      }

      if (!validateEmail(participant.email)) {
        return `Enter a valid email for operative ${i + 1}.`;
      }

      if (!validatePhone(participant.phone)) {
        return `Enter a valid phone number for operative ${i + 1}.`;
      }

      if (!participant.college.trim()) {
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
        setError("Select a team configuration to continue.");
        return;
      }

      if (!teamConfig) {
        setError("Invalid team configuration.");
        return;
      }
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

    setStep((currentStep) => Math.min(5, currentStep + 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* --------------------------------
     BACK
  -------------------------------- */

  const back = () => {
    setError("");

    setStep((currentStep) =>
      Math.max(1, currentStep - 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
         CLEAN PARTICIPANT DATA

         Only real form values are sent.
         No random reference number.
         No roll number.
      -------------------------------- */

      const cleanParticipants =
        form.participants.map((participant) => ({
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

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type":
            "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      /* --------------------------------
         SUCCESS
      -------------------------------- */

      setStep(6);

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
        {[
          "ENTRY",
          "EVENT",
          "TEAM",
          "DOSSIER",
          "PAYMENT",
          "CLEAR",
        ].map((label, index) => {
          const number = index + 1;

          return (
            <div
              key={label}
              className={`cp-progress-item ${
                step >= number ? "active" : ""
              }`}
            >
              <b>
                {String(number).padStart(2, "0")}
              </b>

              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/* TERMINAL */}

      <main className="cp-terminal">
        <div className="cp-terminal-top">
          <span>
            ◆ TERMINAL // ACCESS_LEVEL_01
          </span>

          <strong>
            SECRET // EYES ONLY
          </strong>
        </div>

        {/* ERROR */}

        {error && (
          <div className="cp-error">
            ⚠ {error}
          </div>
        )}

        {/* =====================================
            STEP 1
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
              ).map(([key, event]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() =>
                    chooseEvent(key)
                  }
                  className={`cp-event-card ${
                    selectedEvent === key
                      ? "selected"
                      : ""
                  }`}
                >
                  <span className="cp-event-icon">
                    {event.icon}
                  </span>

                  <span>
                    {event.name}
                  </span>

                  <small>
                    {event.shortDescription}
                  </small>
                </button>
              ))}
            </div>

            <button
              className="cp-primary"
              onClick={next}
            >
              SELECT EVENT DOSSIER →
            </button>
          </section>
        )}

        {/* =====================================
            STEP 2
        ===================================== */}

        {step === 2 && (
          <section className="cp-screen">
            <div className="cp-section-kicker">
              STEP 02 // CREW CONFIGURATION
            </div>

            <h2>
              CHOOSE YOUR{" "}
              <span>CREW SIZE</span>
            </h2>

            <p className="cp-muted">
              Select the number of operatives
              entering the operation.
            </p>

            <div className="cp-team-grid">
              {Object.entries(
                TEAM_SIZE_DATABASE
              ).map(([key, item]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() =>
                    chooseTeamSize(key)
                  }
                  className={`cp-team-card ${
                    selectedTeamSize === key
                      ? "selected"
                      : ""
                  }`}
                >
                  <b>{item.label}</b>

                  <span>
                    {item.count} operative
                    {item.count > 1
                      ? "s"
                      : ""}
                  </span>

                  <strong>
                    ₹{item.amount}
                  </strong>
                </button>
              ))}
            </div>

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
                NEXT →
              </button>
            </div>
          </section>
        )}

        {/* =====================================
            STEP 3
        ===================================== */}

        {step === 3 && (
          <section className="cp-screen">
            <div className="cp-section-kicker">
              STEP 03 // OPERATIVE DOSSIER
            </div>

            <h2>
              ENTER{" "}
              <span>
                PARTICIPANT DETAILS
              </span>
            </h2>

            {/* TEAM NAME */}

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
                placeholder="Crew name"
                maxLength={50}
              />
            </label>

            {/* PARTICIPANTS */}

            <div className="cp-participants">
              {form.participants.map(
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
            STEP 4
        ===================================== */}

        {step === 4 && (
          <section className="cp-screen cp-payment">
            <div className="cp-section-kicker">
              STEP 04 // PAYMENT CLEARANCE
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
                    {
                      EVENT_DATABASE[
                        selectedEvent
                      ]?.name
                    }
                  </span>

                  <span>
                    {teamConfig?.label}
                  </span>

                  <strong>
                    ₹{amount}
                  </strong>
                </div>

                <div className="cp-qr-wrap">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
                      teamConfig?.upi || ""
                    )}`}
                    alt="Payment QR"
                  />
                </div>

                <p className="cp-upi">
                  {teamConfig?.upi}
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
                    value={
                      form.transactionId
                    }
                    onChange={(e) =>
                      updateForm(
                        "transactionId",
                        e.target.value
                      )
                    }
                    placeholder="Enter payment reference"
                    maxLength={50}
                  />
                </label>

                <label className="cp-upload">
                  <span>
                    PAYMENT SCREENSHOT
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
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
            STEP 5
        ===================================== */}

        {step === 5 && (
          <section className="cp-screen">
            <div className="cp-section-kicker">
              STEP 05 // FINAL REVIEW
            </div>

            <h2>
              VERIFY{" "}
              <span>YOUR DOSSIER</span>
            </h2>

            <div className="cp-review">
              <ReviewRow
                label="EVENT"
                value={
                  EVENT_DATABASE[
                    selectedEvent
                  ]?.name || "-"
                }
              />

              <ReviewRow
                label="CREW SIZE"
                value={
                  teamConfig?.label || "-"
                }
              />

              <ReviewRow
                label="OPERATIVES"
                value={String(
                  participantCount
                )}
              />

              <ReviewRow
                label="TOTAL"
                value={`₹${amount}`}
              />

              <ReviewRow
                label="TRANSACTION"
                value={
                  form.transactionId
                }
              />
            </div>

            <div className="cp-review-members">
              {form.participants.map(
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
            STEP 6 - SUCCESS
        ===================================== */}

        {step === 6 && (
          <section className="cp-screen cp-success">
            <div className="cp-success-icon">
              ✓
            </div>

            <div className="cp-stamp">
              TRANSMISSION RECEIVED
            </div>

            <h2>
              REGISTRATION{" "}
              <span>AUTHORIZED</span>
            </h2>

            <p>
              Your registration dossier has been
              transmitted successfully.
            </p>

            <p className="cp-muted">
              Your registration details have been
              sent to the registration database.
            </p>

            <button
              className="cp-primary"
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