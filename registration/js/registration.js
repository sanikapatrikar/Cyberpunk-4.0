/* ==========================================================================
   CYBERPUNK × CINEMATIC HEIST REGISTRATION SYSTEM
   Frontend Controller & Business Logic
   ========================================================================== */

// --- EVENT DATABASE & PRICING RULES (From Reference Repo) ---
const EVENT_DATABASE = {
  'hackers': {
    code: 'CYB-EVT-01',
    name: 'Hacker’s Heist',
    subtitle: 'Capture The Flag Edition',
    icon: '🔐',
    desc: 'Offensive security & CTF heist. Crack encrypted payloads, exploit logic flaws, and exfiltrate target data under deadline pressure.',
    pricing: { 1: 80, 2: 140, 3: 180, 4: 200 },
    allowedSizes: [1, 2, 3, 4],
    whatsapp: 'https://chat.whatsapp.com/JK7PSA0NostIXx6hekCII9'
  },
  'detectyx': {
    code: 'CYB-EVT-02',
    name: 'DetectyX',
    subtitle: 'Sherlock Cyberspace',
    icon: '🕵',
    desc: 'Digital forensics & cyber investigation. Reconstruct digital crime scenes, trace malicious IP logs, and unmask rogue operatives.',
    pricing: { 1: 70, 2: 100, 3: 130 },
    allowedSizes: [1, 2, 3],
    whatsapp: 'https://chat.whatsapp.com/HT91rCKRnnV7sO3T8qrWa3'
  },
  'web3': {
    code: 'CYB-EVT-03',
    name: 'Web3 Hackathon',
    subtitle: 'Decentralized Heist',
    icon: '🌐',
    desc: 'Smart contract & decentralized protocol build. Design tamper-proof dApps, zero-knowledge proofs, and Web3 security tooling.',
    pricing: { 2: 150, 3: 200, 4: 250, 5: 250 },
    allowedSizes: [2, 3, 4, 5],
    whatsapp: 'https://chat.whatsapp.com/Hn0Y56aM9kCKGey496ymTL'
  },
  'violent': {
    code: 'CYB-EVT-04',
    name: 'Nagpur’s Got Violent',
    subtitle: 'Cyber Warfare Arena',
    icon: '🎭',
    desc: 'High-octane cyber warfare simulation. Real-time red vs blue tactical defense battle testing speed, strategy, and teamwork.',
    pricing: { 1: 50, 2: 100, 3: 150, 4: 200 },
    allowedSizes: [1, 2, 3, 4],
    whatsapp: 'https://chat.whatsapp.com/BorHgehQ5tx2yOei5WAGvt'
  }
};

const BRANCH_OPTIONS = [
  'CSE(CYBERSECURITY)',
  'CSE(DATASCIENCE)',
  'Cse/CE',
  'IT',
  'IoT',
  'Mechanical',
  'Civil',
  'Electronics',
  'Electrical',
  'AI',
  'Robotics&AI',
  'CSBS',
  'B.Voc',
  'Others'
];

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// --- GOOGLE APPS SCRIPT WEB APP URL ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxzC4-tb2v8yr0cwJi9UtaEF7-SkdrtM6t4Gbq6q3-QyNAyhVUkLFQS-XYmTiUqr3c_/exec";

// --- APPLICATION STATE ---
let currentStep = 1;
let selectedEventKey = null;
let selectedTeamSize = null;
let registrationFormData = {};
let computedTotalAmount = 0;

// --- DOM ELEMENTS CACHE ---
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initEventListeners();
  renderEventCards();
  renderTeamSizeCards();
  updateStepView(1);
});

// --- CLOCK CONTROLLER ---
function initClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;
  const update = () => {
    const now = new Date();
    clockEl.textContent = now.toTimeString().split(' ')[0] + ' UTC+5.30';
  };
  update();
  setInterval(update, 1000);
}

// --- NAVIGATION & STAGE CONTROLLER ---
function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > 7) return;
  
  // Validate progression requirements
  if (stepNumber > 2 && !selectedEventKey) {
    alert('SEC_WARN: Please select an Event Dossier first.');
    return;
  }
  if (stepNumber > 3 && !selectedTeamSize) {
    alert('SEC_WARN: Please select a Team Size configuration.');
    return;
  }
  if (stepNumber > 4 && currentStep === 4 && !validateParticipantForm()) {
    return;
  }
  if (stepNumber > 5 && currentStep === 5 && !validatePaymentSection()) {
    return;
  }

  // Generate dynamic content when entering specific stages
  if (stepNumber === 4 && currentStep !== 4) {
    buildParticipantFormFields();
  } else if (stepNumber === 5) {
    calculatePriceAndPaymentSummary();
  } else if (stepNumber === 6) {
    buildReviewDossierSummary();
  }

  currentStep = stepNumber;
  updateStepView(currentStep);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepView(step) {
  // Update stage section visibility
  document.querySelectorAll('.stage-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const activeSec = document.getElementById(`stage${step}`);
  if (activeSec) activeSec.classList.add('active');

  // Update progress bar nodes
  document.querySelectorAll('.step-node').forEach(node => {
    const nodeStep = parseInt(node.dataset.step);
    node.classList.remove('active', 'completed');
    if (nodeStep === step) {
      node.classList.add('active');
    } else if (nodeStep < step) {
      node.classList.add('completed');
    }
  });

  // Update progress track fill percentage
  const fill = document.getElementById('progressFill');
  if (fill) {
    const percent = Math.min(100, Math.max(0, ((step - 1) / 5) * 100));
    fill.style.width = `${percent}%`;
  }
}

// --- 02. EVENT CARDS CONTROLLER ---
function renderEventCards() {
  const container = document.getElementById('eventsGridContainer');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(EVENT_DATABASE).forEach(key => {
    const ev = EVENT_DATABASE[key];
    const card = document.createElement('div');
    card.className = `event-dossier-card ${selectedEventKey === key ? 'selected' : ''}`;
    card.dataset.key = key;

    const minPrice = Math.min(...Object.values(ev.pricing));

    card.innerHTML = `
      <div>
        <div class="event-icon">${ev.icon}</div>
        <div class="event-code">${ev.code}</div>
        <div class="event-name">${ev.name}</div>
        <div class="event-desc">${ev.desc}</div>
      </div>
      <div class="event-footer">
        <span class="event-fee-tag">From ₹${minPrice}</span>
        <span class="event-team-range">${ev.allowedSizes.length > 1 ? `${ev.allowedSizes[0]}-${ev.allowedSizes[ev.allowedSizes.length - 1]} Members` : 'Solo Event'}</span>
      </div>
    `;

    card.addEventListener('click', () => selectEvent(key));
    container.appendChild(card);
  });
}

function selectEvent(key) {
  selectedEventKey = key;
  renderEventCards();
  updateTeamSizeAvailability();
  
  // Enable Next button in Stage 2
  const btn = document.getElementById('btnStage2Next');
  if (btn) btn.disabled = false;
}

// --- 03. TEAM SIZE CONTROLLER ---
function renderTeamSizeCards() {
  const container = document.getElementById('teamSizeCardsContainer');
  if (!container) return;
  container.innerHTML = '';

  const sizes = [
    { size: 1, label: 'Solo (1 Member)' },
    { size: 2, label: 'Duo (2 Members)' },
    { size: 3, label: 'Trio (3 Members)' },
    { size: 4, label: 'Squad (4 Members)' },
    { size: 5, label: 'Team of Five (5)' }
  ];

  sizes.forEach(item => {
    const card = document.createElement('div');
    card.className = 'team-card-option';
    card.dataset.size = item.size;
    card.id = `teamCard${item.size}`;

    card.innerHTML = `
      <div class="team-size-number">0${item.size}</div>
      <div class="team-size-label">${item.label}</div>
    `;

    card.addEventListener('click', () => selectTeamSize(item.size));
    container.appendChild(card);
  });

  updateTeamSizeAvailability();
}

function updateTeamSizeAvailability() {
  if (!selectedEventKey) return;
  const ev = EVENT_DATABASE[selectedEventKey];

  [1, 2, 3, 4, 5].forEach(size => {
    const card = document.getElementById(`teamCard${size}`);
    if (!card) return;

    const isAllowed = ev.allowedSizes.includes(size);
    if (isAllowed) {
      card.classList.remove('disabled');
    } else {
      card.classList.add('disabled');
      if (selectedTeamSize === size) {
        selectedTeamSize = null;
        card.classList.remove('selected');
        const btn = document.getElementById('btnStage3Next');
        if (btn) btn.disabled = true;
      }
    }
  });
}

function selectTeamSize(size) {
  if (!selectedEventKey) return;
  const ev = EVENT_DATABASE[selectedEventKey];
  if (!ev.allowedSizes.includes(size)) return;

  selectedTeamSize = size;

  document.querySelectorAll('.team-card-option').forEach(card => {
    card.classList.remove('selected');
  });
  const selectedCard = document.getElementById(`teamCard${size}`);
  if (selectedCard) selectedCard.classList.add('selected');

  // Enable Next button in Stage 3
  const btn = document.getElementById('btnStage3Next');
  if (btn) btn.disabled = false;
}

// --- 04. DYNAMIC PARTICIPANT FORM GENERATOR ---
function buildParticipantFormFields() {
  const container = document.getElementById('dynamicMembersContainer');
  if (!container || !selectedTeamSize) return;

  container.innerHTML = '';

  // Team Name Field
  const teamNameCard = document.createElement('div');
  teamNameCard.className = 'form-group-card';
  teamNameCard.innerHTML = `
    <div class="form-group-header">
      <div class="form-group-title">🛡️ Team Identity</div>
      <span class="classified-stamp">REQUIRED</span>
    </div>
    <div class="input-field-wrapper full-width">
      <label class="field-label">Team Designation / Name <span class="req">*</span></label>
      <input type="text" id="inputTeamName" class="cyber-input" placeholder="e.g. CYBER_SHADOWS_X" required value="${registrationFormData.teamName || ''}">
      <span class="field-error-msg" id="errTeamName">Team name is required.</span>
    </div>
  `;
  container.appendChild(teamNameCard);

  // Dynamic Member Cards
  for (let i = 1; i <= selectedTeamSize; i++) {
    const memData = registrationFormData[`member_${i}`] || {};
    const memberCard = document.createElement('div');
    memberCard.className = 'form-group-card';
    memberCard.innerHTML = `
      <div class="form-group-header">
        <div class="form-group-title">👤 Participant 0${i} ${i === 1 ? '(Team Leader)' : ''}</div>
        <span class="op-badge">MEMBER #${i}</span>
      </div>
      <div class="fields-row">
        <div class="input-field-wrapper">
          <label class="field-label">Full Name <span class="req">*</span></label>
          <input type="text" id="inputFullName_${i}" class="cyber-input" placeholder="Operative full name" required value="${memData.fullName || ''}">
          <span class="field-error-msg" id="errFullName_${i}">Full name required.</span>
        </div>
        <div class="input-field-wrapper">
          <label class="field-label">Email Address <span class="req">*</span></label>
          <input type="email" id="inputEmail_${i}" class="cyber-input" placeholder="operative@domain.com" required value="${memData.email || ''}">
          <span class="field-error-msg" id="errEmail_${i}">Valid email required.</span>
        </div>
        <div class="input-field-wrapper">
          <label class="field-label">Phone Number <span class="req">*</span></label>
          <input type="tel" id="inputPhone_${i}" class="cyber-input" placeholder="10-digit mobile number" maxlength="10" required value="${memData.phone || ''}">
          <span class="field-error-msg" id="errPhone_${i}">10-digit phone required.</span>
        </div>
        <div class="input-field-wrapper">
          <label class="field-label">College Name <span class="req">*</span></label>
          <input type="text" id="inputCollege_${i}" class="cyber-input" placeholder="Institution / College" required value="${memData.college || ''}">
          <span class="field-error-msg" id="errCollege_${i}">College name required.</span>
        </div>
        <div class="input-field-wrapper">
          <label class="field-label">Branch <span class="req">*</span></label>
          <select id="inputBranch_${i}" class="cyber-select" required>
            <option value="">Select Branch</option>
            ${BRANCH_OPTIONS.map(b => `<option value="${b}" ${memData.branch === b ? 'selected' : ''}>${b}</option>`).join('')}
          </select>
          <span class="field-error-msg" id="errBranch_${i}">Select a branch.</span>
        </div>
        <div class="input-field-wrapper">
          <label class="field-label">Academic Year <span class="req">*</span></label>
          <select id="inputYear_${i}" class="cyber-select" required>
            <option value="">Select Year</option>
            ${YEAR_OPTIONS.map(y => `<option value="${y}" ${memData.year === y ? 'selected' : ''}>${y}</option>`).join('')}
          </select>
          <span class="field-error-msg" id="errYear_${i}">Select year.</span>
        </div>
        <div class="input-field-wrapper">
          <label class="field-label">Roll Number <span class="req">*</span></label>
          <input type="text" id="inputRoll_${i}" class="cyber-input" placeholder="Roll / PRN Number" required value="${memData.roll || ''}">
          <span class="field-error-msg" id="errRoll_${i}">Roll number required.</span>
        </div>
      </div>
    `;
    container.appendChild(memberCard);
  }
}

// --- PARTICIPANT FORM VALIDATION ---
function validateParticipantForm() {
  let isValid = true;

  // Validate Team Name
  const teamNameInput = document.getElementById('inputTeamName');
  const errTeamName = document.getElementById('errTeamName');
  if (teamNameInput && !teamNameInput.value.trim()) {
    teamNameInput.classList.add('invalid');
    if (errTeamName) errTeamName.classList.add('visible');
    isValid = false;
  } else if (teamNameInput) {
    teamNameInput.classList.remove('invalid');
    if (errTeamName) errTeamName.classList.remove('visible');
    registrationFormData.teamName = teamNameInput.value.trim();
  }

  // Validate Members
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  for (let i = 1; i <= selectedTeamSize; i++) {
    const fullNameEl = document.getElementById(`inputFullName_${i}`);
    const emailEl = document.getElementById(`inputEmail_${i}`);
    const phoneEl = document.getElementById(`inputPhone_${i}`);
    const collegeEl = document.getElementById(`inputCollege_${i}`);
    const branchEl = document.getElementById(`inputBranch_${i}`);
    const yearEl = document.getElementById(`inputYear_${i}`);
    const rollEl = document.getElementById(`inputRoll_${i}`);

    const checkField = (el, errId, condition) => {
      const errEl = document.getElementById(errId);
      if (!el || !condition) {
        if (el) el.classList.add('invalid');
        if (errEl) errEl.classList.add('visible');
        isValid = false;
      } else {
        if (el) el.classList.remove('invalid');
        if (errEl) errEl.classList.remove('visible');
      }
    };

    checkField(fullNameEl, `errFullName_${i}`, fullNameEl && fullNameEl.value.trim().length > 0);
    checkField(emailEl, `errEmail_${i}`, emailEl && emailRegex.test(emailEl.value.trim()));
    checkField(phoneEl, `errPhone_${i}`, phoneEl && phoneRegex.test(phoneEl.value.trim()));
    checkField(collegeEl, `errCollege_${i}`, collegeEl && collegeEl.value.trim().length > 0);
    checkField(branchEl, `errBranch_${i}`, branchEl && branchEl.value !== '');
    checkField(yearEl, `errYear_${i}`, yearEl && yearEl.value !== '');
    checkField(rollEl, `errRoll_${i}`, rollEl && rollEl.value.trim().length > 0);

    if (isValid) {
      registrationFormData[`member_${i}`] = {
        fullName: fullNameEl.value.trim(),
        email: emailEl.value.trim(),
        phone: phoneEl.value.trim(),
        college: collegeEl.value.trim(),
        branch: branchEl.value,
        year: yearEl.value,
        roll: rollEl.value.trim()
      };
    }
  }

  return isValid;
}

// --- 05. DYNAMIC PRICE & DYNAMIC UPI QR GENERATOR ---
function calculatePriceAndPaymentSummary() {
  if (!selectedEventKey || !selectedTeamSize) return;
  const ev = EVENT_DATABASE[selectedEventKey];
  computedTotalAmount = ev.pricing[selectedTeamSize] || 0;

  // Render price summary table
  const summaryEl = document.getElementById('paymentSummaryTable');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <tr>
        <td class="label-col">Target Operation:</td>
        <td class="val-col">${ev.name}</td>
      </tr>
      <tr>
        <td class="label-col">Operation Code:</td>
        <td class="val-col">${ev.code}</td>
      </tr>
      <tr>
        <td class="label-col">Squad Configuration:</td>
        <td class="val-col">${selectedTeamSize === 1 ? 'Solo Operative' : `Team of ${selectedTeamSize}`}</td>
      </tr>
      <tr>
        <td class="label-col">Team Name:</td>
        <td class="val-col">${registrationFormData.teamName || 'N/A'}</td>
      </tr>
      <tr>
        <td class="label-col">Calculated Amount:</td>
        <td class="val-col" style="color: var(--amber-warn); font-weight: 700;">₹${computedTotalAmount}</td>
      </tr>
    `;
  }

  const totalEl = document.getElementById('computedTotalDisplay');
  if (totalEl) {
    totalEl.textContent = `₹${computedTotalAmount}`;
  }

  // Construct UPI payment URL with pre-filled calculated amount
  const upiUrl = `upi://pay?pa=8856813968@ptaxis&pn=Cyberpunk2K25&am=${computedTotalAmount}&cu=INR`;

  // Dynamically generate QR code encoding the exact calculated amount
  const qrImg = document.getElementById('paymentQrCodeImage');
  if (qrImg) {
    const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
    qrImg.src = dynamicQrUrl;
    qrImg.onerror = () => {
      qrImg.src = 'assets/QR.jpeg'; // Fallback to local static QR image if offline
    };
  }

  // Update instruction & mobile direct pay deep link
  const upiInstruction = document.getElementById('upiLinkInstruction');
  if (upiInstruction) {
    upiInstruction.innerHTML = `
      <div style="margin-bottom: 6px; color: var(--text-main); font-size: 0.85rem;">
        Scan with Google Pay / PhonePe / Paytm / BHIM
      </div>
      <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-primary); margin-bottom: 10px;">
        Pre-filled scan amount: <strong style="color: var(--amber-warn);">₹${computedTotalAmount}</strong>
      </div>
      <a href="${upiUrl}" class="mobile-upi-btn">
        ⚡ TAP TO PAY ₹${computedTotalAmount} DIRECTLY VIA UPI APP
      </a>
    `;
  }
}

function validatePaymentSection() {
  let isValid = true;

  const txInput = document.getElementById('inputTxId');
  const errTx = document.getElementById('errTxId');
  if (!txInput || !txInput.value.trim() || txInput.value.trim().length < 5) {
    if (txInput) txInput.classList.add('invalid');
    if (errTx) errTx.classList.add('visible');
    isValid = false;
  } else {
    if (txInput) txInput.classList.remove('invalid');
    if (errTx) errTx.classList.remove('visible');
    registrationFormData.txId = txInput.value.trim();
  }

  const fileInput = document.getElementById('inputPaymentScreenshot');
  const errFile = document.getElementById('errScreenshot');
  if (!fileInput || fileInput.files.length === 0) {
    if (fileInput) fileInput.classList.add('invalid');
    if (errFile) errFile.classList.add('visible');
    isValid = false;
  } else {
    if (fileInput) fileInput.classList.remove('invalid');
    if (errFile) errFile.classList.remove('visible');
    registrationFormData.screenshotFile = fileInput.files[0];
  }

  return isValid;
}

// --- 06. FINAL REVIEW DOSSIER CONTROLLER ---
function buildReviewDossierSummary() {
  const container = document.getElementById('reviewDossierContainer');
  if (!container || !selectedEventKey || !selectedTeamSize) return;

  const ev = EVENT_DATABASE[selectedEventKey];

  let membersHtml = '';
  for (let i = 1; i <= selectedTeamSize; i++) {
    const m = registrationFormData[`member_${i}`] || {};
    membersHtml += `
      <div style="margin-top: 8px; padding-left: 10px; border-left: 2px solid var(--cyan-primary);">
        <strong style="color: #fff;">Member 0${i}:</strong> ${m.fullName || 'N/A'} | ${m.email || ''} | ${m.phone || ''} <br>
        <span style="color: var(--text-muted); font-size: 0.8rem;">${m.college || ''} (${m.branch || ''}, ${m.year || ''}, Roll: ${m.roll || ''})</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="review-section-block">
      <div class="review-header-flex">
        <span class="review-subhead">01. OPERATION & TEAM</span>
        <button class="edit-step-btn" onclick="goToStep(2)">EDIT</button>
      </div>
      <div class="review-data-grid">
        <div>
          <div class="data-item-label">SELECTED EVENT</div>
          <div class="data-item-val">${ev.name} (${ev.code})</div>
        </div>
        <div>
          <div class="data-item-label">TEAM NAME</div>
          <div class="data-item-val">${registrationFormData.teamName || 'N/A'}</div>
        </div>
        <div>
          <div class="data-item-label">TEAM SIZE</div>
          <div class="data-item-val">${selectedTeamSize} Participant(s)</div>
        </div>
      </div>
    </div>

    <div class="review-section-block">
      <div class="review-header-flex">
        <span class="review-subhead">02. PARTICIPANT DOSSIERS</span>
        <button class="edit-step-btn" onclick="goToStep(4)">EDIT</button>
      </div>
      ${membersHtml}
    </div>

    <div class="review-section-block">
      <div class="review-header-flex">
        <span class="review-subhead">03. PAYMENT CLEARANCE</span>
        <button class="edit-step-btn" onclick="goToStep(5)">EDIT</button>
      </div>
      <div class="review-data-grid">
        <div>
          <div class="data-item-label">TOTAL AMOUNT PAID</div>
          <div class="data-item-val" style="color: var(--green-status);">₹${computedTotalAmount}</div>
        </div>
        <div>
          <div class="data-item-label">TRANSACTION ID</div>
          <div class="data-item-val" style="color: var(--cyan-primary);">${registrationFormData.txId || 'N/A'}</div>
        </div>
        <div>
          <div class="data-item-label">PAYMENT PROOF</div>
          <div class="data-item-val">${registrationFormData.screenshotFile ? registrationFormData.screenshotFile.name : 'Uploaded'}</div>
        </div>
      </div>
    </div>
  `;
}

// --- GOOGLE APPS SCRIPT SUBMISSION ---
async function submitRegistration(registrationData) {
    console.log('[FRONTEND SUBMIT] Sending registration:', registrationData);

    try {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "YOUR_WEB_APP_URL_HERE") {
            throw new Error('Google Apps Script Web App URL is not configured.');
        }

        // Convert payment screenshot to Base64 for Google Apps Script
const screenshotFile = registrationFormData.screenshotFile;

if (screenshotFile) {
    const screenshotBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read payment screenshot.'));
        };

        reader.readAsDataURL(screenshotFile);
    });

    registrationData.screenshotBase64 = screenshotBase64;
    registrationData.screenshotFileName = screenshotFile.name;
    registrationData.screenshotMimeType = screenshotFile.type;
}

        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(registrationData)
        });

        console.log('[FRONTEND SUBMIT] Registration sent successfully.');

        // Generate registration reference code
        const randomHex = Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0')
            .toUpperCase();

        const refCode = `CYB-2026-${randomHex}`;

        // Display reference code
        const refCodeEl = document.getElementById('successRefCode');

        if (refCodeEl) {
            refCodeEl.textContent = refCode;
        }

        // Display WhatsApp group link
        const ev = EVENT_DATABASE[selectedEventKey];
        const waContainer = document.getElementById('whatsappGroupLinkContainer');

        if (waContainer && ev && ev.whatsapp) {
            waContainer.innerHTML = `
                <div class="whatsapp-community-card">
                    <div style="font-family: var(--font-heading); font-size: 1.1rem; color: #fff; margin-bottom: 6px;">
                        JOIN ${ev.name.toUpperCase()} OPERATIVE GROUP
                    </div>

                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        Connect with team mentors, receive mission schedules, and access live announcements.
                    </p>

                    <a href="${ev.whatsapp}"
                       target="_blank"
                       rel="noopener"
                       class="whatsapp-btn">
                        <span>JOIN OFFICIAL WHATSAPP GROUP</span>
                    </a>
                </div>
            `;
        }

        // Go to success page
        goToStep(7);

    } catch (err) {
        console.error('[FRONTEND SUBMIT] Submission failed:', err);

        alert(
            'SUBMISSION FAILED: ' +
            err.message +
            '\n\nPlease check your internet connection and try again.'
        );

    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }
}

// --- EVENT LISTENERS INITIALIZATION ---
function initEventListeners() {
  // Entry Start Button
  const btnStart = document.getElementById('btnStartRegistration');
  if (btnStart) btnStart.addEventListener('click', () => goToStep(2));

  // Navigation Buttons
  const btnS2Next = document.getElementById('btnStage2Next');
  if (btnS2Next) btnS2Next.addEventListener('click', () => goToStep(3));

  const btnS3Back = document.getElementById('btnStage3Back');
  if (btnS3Back) btnS3Back.addEventListener('click', () => goToStep(2));

  const btnS3Next = document.getElementById('btnStage3Next');
  if (btnS3Next) btnS3Next.addEventListener('click', () => goToStep(4));

  const btnS4Back = document.getElementById('btnStage4Back');
  if (btnS4Back) btnS4Back.addEventListener('click', () => goToStep(3));

  const btnS4Next = document.getElementById('btnStage4Next');
  if (btnS4Next) btnS4Next.addEventListener('click', () => goToStep(5));

  const btnS5Back = document.getElementById('btnStage5Back');
  if (btnS5Back) btnS5Back.addEventListener('click', () => goToStep(4));

  const btnS5Next = document.getElementById('btnStage5Next');
  if (btnS5Next) btnS5Next.addEventListener('click', () => goToStep(6));

  const btnS6Back = document.getElementById('btnStage6Back');
  if (btnS6Back) btnS6Back.addEventListener('click', () => goToStep(5));

  // Final Submit Button
  const btnConfirmSubmit = document.getElementById('btnConfirmRegistration');
  if (btnConfirmSubmit) {
    btnConfirmSubmit.addEventListener('click', () => {
      const fullPayload = {
        event: EVENT_DATABASE[selectedEventKey],
        teamSize: selectedTeamSize,
        totalAmount: computedTotalAmount,
        formData: registrationFormData,
        timestamp: new Date().toISOString()
      };
      submitRegistration(fullPayload);
    });
  }
}
