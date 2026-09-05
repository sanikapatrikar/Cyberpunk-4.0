# Fast Registration API setup

## Files

- `api/register.js` — Vercel server-side API. It validates the registration, checks duplicate UTRs across all four event sheets with one batch read, uploads the screenshot to Google Drive, and appends all participant rows in one Sheets API call.
- `Registration(4).jsx` — updated frontend. It posts to `/api/register` and only shows CLEAR after the API confirms the Google Sheets append.
- `package.json` — adds `googleapis`.
- `.env.example` — required server environment variables.

## 1. Google Cloud

Create a Google Cloud project and enable:
- Google Sheets API
- Google Drive API

Create a service account and obtain its client email and private key.

## 2. Share the spreadsheet and screenshot folder

Share the existing registration spreadsheet with the service-account email as Editor.
Share the existing `Cyberpunk Registration Screenshots` Drive folder with the service-account email as Editor.

Do not put the service-account private key in React or in any VITE_/REACT_APP_ variable.

## 3. Vercel environment variables

Set these in Vercel for Production (and Preview if you want to test there):

- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`
- `GOOGLE_DRIVE_FOLDER_ID`

The private key must contain the normal PEM newlines. The API also accepts the common escaped `\\n` form.

## 4. Install

Run:

npm install

Then build:

npm run build

## 5. Deploy

Commit/push the project and deploy to Vercel. Vercel automatically exposes `api/register.js` as `/api/register`.

## 6. Test

Do one real test registration and verify all of these before using it for the event:

1. The correct event sheet gets rows.
2. Every participant is written.
3. UTR appears only on the first participant row.
4. Screenshot link appears on the first participant row.
5. Screenshot exists in the selected Drive folder.
6. Reusing the same UTR is rejected.
7. A failed Sheet write does not show the CLEAR/success screen.

## Important reliability note

The frontend never uses optimistic success. It changes to CLEAR only after Google Sheets confirms the append. This prevents the old failure mode where the browser could display success even though the backend had not saved the registration.

No remote system can mathematically guarantee persistence during a total network/provider outage. For strict exactly-once UTR uniqueness under simultaneous submissions, use a database with a unique constraint for the UTR as the authoritative registration store; Google Sheets can then remain the admin/reporting copy.
