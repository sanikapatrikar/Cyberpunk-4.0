# CYBERPUNK 2026 // Registration Terminal (React + Vite)

This is the converted React + Vite edition of the **CYBERPUNK 2026 Registration Terminal**, preserving 100% of the original secret operation cyberpunk UI design system, animations, dynamic team size logic, payment QR clearance HUD, dossier review, WhatsApp group routing, and responsive layout.

---

## 📁 React Project Structure

```
registration-react/
├── index.html                  # HTML template with fonts and metadata
├── package.json                # React & Vite dependencies
├── vite.config.js              # Vite configuration
├── GoogleAppsScript.gs         # Backend Apps Script for Google Sheets & Drive
├── public/
│   └── assets/
│       └── QR.jpeg             # Static payment QR code fallback
└── src/
    ├── main.jsx                # Application root entry point
    ├── App.jsx                 # Main state hub & step stage controller
    ├── assets/
    │   └── QR.jpeg             # Imported asset image
    ├── config/
    │   └── googleScriptConfig.js # GOOGLE_SCRIPT_URL configuration constant
    ├── constants/
    │   └── eventData.js        # EVENT_DATABASE, BRANCH_OPTIONS, YEAR_OPTIONS
    ├── styles/
    │   └── index.css           # Complete Cyberpunk Heist visual design system
    └── components/
        ├── Header.jsx          # HUD header with live UTC+5.30 clock & status dot
        ├── ProgressBar.jsx     # Step nodes & animated progress track
        ├── Stage1Entry.jsx     # Stage 01 Hero banner & Start button
        ├── Stage2EventSelection.jsx # Stage 02 Event dossier card grid
        ├── Stage3TeamSize.jsx  # Stage 03 Dynamic team size configuration
        ├── Stage4ParticipantDetails.jsx # Stage 04 Dynamic operative dossier forms
        ├── Stage5PaymentClearance.jsx # Stage 05 Payment summary, QR & TxID upload
        ├── Stage6FinalReview.jsx # Stage 06 Full review panel with stage edit triggers
        └── Stage7Success.jsx   # Stage 07 Mission Accepted & WhatsApp group routing
```

---

## 🚀 Quick Start (Running Locally)

### 1. Install Dependencies

Open your terminal inside `registration-react`:

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit the local URL shown in your terminal (e.g. `http://localhost:5173`).

### 3. Build for Production

```bash
npm run build
```

This creates an optimized, static production bundle in `dist/` ready to host anywhere (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

---

## 📊 Google Sheets & Google Apps Script Setup Guide

Follow these steps to connect your registration form to a Google Sheet and upload payment screenshots to Google Drive:

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com).
2. Create a new Spreadsheet and name it **"CYBERPUNK 2026 Registrations"**.

### Step 2: Open Google Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**.
2. Erase any code inside `Code.gs`.
3. Copy the entire contents of [`GoogleAppsScript.gs`](./GoogleAppsScript.gs) and paste it into `Code.gs`.
4. Click **Save** (💾 icon).

### Step 3: Deploy as Web App
1. Click the **Deploy** button (top right) → **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in details:
   - **Description**: `Cyberpunk Registration Backend`
   - **Execute as**: `Me (your account)`
   - **Who has access**: `Anyone` *(Crucial for frontend submissions)*
4. Click **Deploy**.
5. Click **Authorize access**, choose your Google account, click **Advanced** → **Go to Cyberpunk Registration Backend (unsafe)**, and click **Allow**.
6. Copy the **Web App URL** provided (it ends with `/exec`).

### Step 4: Connect Web App URL to React Application
1. Open [`src/config/googleScriptConfig.js`](./src/config/googleScriptConfig.js).
2. Paste your copied Web App URL into `GOOGLE_SCRIPT_URL`:
   ```javascript
   export const GOOGLE_SCRIPT_URL = "YOUR_COPIED_WEB_APP_URL_HERE";
   ```
3. Save the file.

---

## ⚡ Form Submission Flow

1. User selects Event → Team Size → Fills Operatives → Scans Payment QR → Enters TxID + Uploads Screenshot.
2. React encodes payment screenshot to Base64 data string.
3. React sends JSON payload to `GOOGLE_SCRIPT_URL` via `fetch` POST.
4. Google Apps Script receives request:
   - Stores payment screenshot as image file in Google Drive folder (`CYBERPUNK_2026_PAYMENT_SCREENSHOTS`).
   - Appends registration details + screenshot link to Google Sheet (`Registrations`).
5. React receives response, generates temporary reference code (`CYB-2026-XXXXX`), and displays event WhatsApp group link on Stage 7.
