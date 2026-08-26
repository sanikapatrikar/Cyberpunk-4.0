# CYBERPUNK 2026 // Registration Terminal (Frontend Only)

An original **CYBERPUNK × CINEMATIC HEIST** standalone registration web application for the CYBERPUNK 2026 event. Designed with a secret operation terminal aesthetic featuring dark obsidian panels, deep crimson accents, HUD status indicators, dynamic team size logic, live price calculation, QR payment clearance, final dossier review, and event-specific WhatsApp group routing.

---

## 🚀 Quick Start (Running Locally)

Since this project is built using pure **HTML, CSS, and Vanilla JavaScript**, no build steps or Node dependencies are required.

### Method 1: Direct File Access
Simply open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local HTTP Server (Optional)
If using VS Code, use the **Live Server** extension, or run:
```bash
# Using Python
python -m http.server 8000

# Using Node npx
npx serve .
```
Then visit `http://localhost:8000`.

---

## 📁 Project Structure

```
registration/
│
├── index.html            # Main multi-stage registration terminal application
├── css/
│   └── style.css         # Complete Cyberpunk Heist visual design system
├── js/
│   └── registration.js   # Dynamic event database, pricing matrix, form generator & submission logic
├── assets/
│   └── QR.jpeg           # Official UPI Payment QR Code image
└── README.md             # Project documentation and backend integration guide
```

---

## 🔑 Key Locations

1. **Payment QR Code Image**: Located at [`assets/QR.jpeg`](file:///c:/Users/SANIKA/Desktop/registration/assets/QR.jpeg). Displayed in Stage 05 (Payment Clearance HUD).
2. **Registration & Pricing Logic**: Located in [`js/registration.js`](file:///c:/Users/SANIKA/Desktop/registration/js/registration.js). Contains:
   - `EVENT_DATABASE`: Defines event details, fees per team size, and WhatsApp group links.
   - `selectEvent()` & `selectTeamSize()`: Handles team size availability filtering.
   - `buildParticipantFormFields()`: Generates dynamic form inputs based on selected team size.
   - `calculatePriceAndPaymentSummary()`: Dynamically calculates total registration fee.

---

## ⚠️ Important Backend Notice

> **STATUS**: **FRONTEND ONLY DEVELOPMENT PHASE**
> 
> **Google Apps Script & Google Sheets integration is NOT implemented yet.**
> 
> Currently, submitting a registration validates inputs locally, produces a temporary reference code (`CYB-2026-XXXXX`), routes the user to the relevant WhatsApp group, and displays the frontend success screen. No HTTP requests or external API calls are made.

---

## 🔄 Function to Replace for Google Apps Script Integration (Steps 2 & 3)

The submission handler is cleanly isolated inside [`js/registration.js`](file:///c:/Users/SANIKA/Desktop/registration/js/registration.js):

```javascript
async function submitRegistration(registrationData) {
  // Currently handles frontend validation & local success state.
  // In Step 3, replace this with Google Apps Script Web App fetch POST request.
}
```

### Steps to Connect Google Apps Script (Future Step 2 & 3):
1. **Google Apps Script (`Code.gs`)**:
   - Create a script linked to a Google Sheet.
   - Implement `doPost(e)` to receive registration data and payment screenshot file.
   - Deploy as Web App ("Execute as: Me", "Who has access: Anyone").
2. **Frontend Wiring**:
   - Replace `submitRegistration(registrationData)` in `js/registration.js` with:
     ```javascript
     const APPS_SCRIPT_URL = "YOUR_DEPLOYED_WEB_APP_URL";
     const response = await fetch(APPS_SCRIPT_URL, {
       method: "POST",
       body: new URLSearchParams(payload)
     });
     ```
