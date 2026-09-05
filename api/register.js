import { google } from "googleapis";

const HEADERS = [
  "Timestamp",
  "Event",
  "Event Code",
  "Team Size",
  "Participant Count",
  "Total Amount (INR)",
  "Team Name",
  "Name",
  "Emails",
  "Phone no",
  "College",
  "Branch",
  "YEAR",
  "UTR-TRN no",
  "Screenshot link",
];

const EVENT_SHEETS = {
  "Hacker's Heist": "Hacker's Heist",
  DetectYx: "DetectYx",
  "Web3 Hackathon": "Web3 Hackathon",
  "Campus Rush": "Campus Rush",
};

const EVENT_CODES = {
  HEIST: "HEIST",
  DETECTYX: "DETECTYX",
  WEB3: "WEB3",
  NGV: "NGV",
};

let cachedAuth;
let cachedSheets;
let cachedDrive;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server environment variable: ${name}`);
  return value;
}

function getAuth() {
  if (!cachedAuth) {
    cachedAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: requiredEnv("GOOGLE_CLIENT_EMAIL"),
        private_key: requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });
  }
  return cachedAuth;
}

function getSheets() {
  if (!cachedSheets) {
    cachedSheets = google.sheets({ version: "v4", auth: getAuth() });
  }
  return cachedSheets;
}

function getDrive() {
  if (!cachedDrive) {
    cachedDrive = google.drive({ version: "v3", auth: getAuth() });
  }
  return cachedDrive;
}

function normalizeUtr(value) {
  return String(value || "").trim().toLowerCase();
}

function json(res, status, body) {
  res.status(status).setHeader("Cache-Control", "no-store").json(body);
}

function validatePayload(data) {
  const transactionId = String(data.transactionId || "").trim();
  if (!/^[A-Za-z0-9]{12,35}$/.test(transactionId)) {
    throw new Error("Transaction ID / UTR must contain 12 to 35 letters or numbers.");
  }

  const eventName = String(data.eventName || "").trim();
  if (!EVENT_SHEETS[eventName]) throw new Error(`Invalid event name: ${eventName}`);

  const participants = Array.isArray(data.participants) ? data.participants : [];
  if (!participants.length) throw new Error("No participant information received.");

  if (!String(data.teamName || "").trim()) throw new Error("Team / crew codename is required.");

  const screenshot = String(data.screenshotBase64 || "");
  if (!screenshot) throw new Error("Payment screenshot is required.");

  // Vercel's documented function request limit is 4.5 MB.
  // Reject oversized encoded screenshots before attempting a Google upload.
  if (screenshot.length > 3_500_000) {
    throw new Error("Payment screenshot is too large. Please upload a smaller file.");
  }

  return { transactionId, eventName, participants };
}

async function isDuplicateUtr(spreadsheetId, transactionId) {
  const ranges = Object.values(EVENT_SHEETS).map(
    (sheetName) => `'${sheetName.replace(/'/g, "''")}'!N2:N`
  );

  const response = await getSheets().spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
    majorDimension: "COLUMNS",
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const wanted = normalizeUtr(transactionId);

  return (response.data.valueRanges || []).some((range) =>
    (range.values?.[0] || []).some((value) => normalizeUtr(value) === wanted)
  );
}

async function uploadScreenshot(data, eventName, transactionId) {
  const drive = getDrive();
  const folderId = requiredEnv("GOOGLE_DRIVE_FOLDER_ID");

  const mimeType = String(data.screenshotMimeType || "image/jpeg");
  const originalName = String(data.screenshotFileName || `payment-${Date.now()}`)
    .replace(/[\\/:*?"<>|]/g, "_")
    .slice(0, 120);

  const safeEvent = eventName.replace(/[^a-zA-Z0-9_-]+/g, "-");
  const fileName = `${safeEvent}-${transactionId}-${originalName}`;
  const buffer = Buffer.from(String(data.screenshotBase64), "base64");

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: buffer,
    },
    fields: "id,webViewLink",
  });

  const fileId = created.data.id;
  if (!fileId) throw new Error("Google Drive did not return a file ID.");

  let webViewLink = created.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

  // Keep the same behavior as the old Apps Script: try to make the link viewable.
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        type: "anyone",
        role: "reader",
      },
    });
  } catch (permissionError) {
    // Some Google Workspace domains disable public link sharing.
    // The registration itself can still be saved, so do not fail the registration here.
    console.warn("Drive public-sharing permission was not applied:", permissionError?.message || permissionError);
  }

  return { fileId, webViewLink };
}

function buildRows(data, eventName, screenshotUrl) {
  const timestamp = new Date();
  const participantCount = data.participants.length;
  const eventCode = EVENT_CODES[data.eventKey] || String(data.eventCode || "");

  return data.participants.map((participant, index) => [
    timestamp.toISOString(),
    eventName,
    eventCode,
    data.teamSize || "",
    participantCount,
    Number(data.totalAmount || 0),
    String(data.teamName || ""),
    String(participant.fullName || ""),
    String(participant.email || ""),
    String(participant.phone || ""),
    String(participant.college || ""),
    String(participant.branch || ""),
    String(participant.year || ""),
    index === 0 ? String(data.transactionId || "").trim() : "",
    index === 0 ? screenshotUrl : "",
  ]);
}

async function appendRegistration(spreadsheetId, sheetName, rows) {
  const result = await getSheets().spreadsheets.values.append({
    spreadsheetId,
    range: `'${sheetName.replace(/'/g, "''")}'!A:O`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    includeValuesInResponse: false,
    resource: { values: rows },
  });

  if (!result.data.updates?.updatedRange) {
    throw new Error("Google Sheets did not confirm the registration write.");
  }

  return result.data.updates.updatedRange;
}

async function deleteScreenshot(fileId) {
  if (!fileId) return;
  try {
    await getDrive().files.delete({ fileId });
  } catch (cleanupError) {
    console.warn("Could not remove orphaned screenshot:", cleanupError?.message || cleanupError);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { success: false, error: "Method not allowed." });
  }

  let uploadedFileId = null;

  try {
    const data = req.body || {};
    const { transactionId, eventName, participants } = validatePayload(data);
    const spreadsheetId = requiredEnv("GOOGLE_SPREADSHEET_ID");
    const sheetName = EVENT_SHEETS[eventName];

    // One batch read checks all four event sheets instead of four sequential reads.
    const duplicate = await isDuplicateUtr(spreadsheetId, transactionId);
    if (duplicate) {
      return json(res, 409, {
        success: false,
        duplicate: true,
        error: "Transaction ID / UTR already used. Please enter a different transaction ID.",
      });
    }

    // Upload first because the Sheet row should contain the final screenshot URL.
    const screenshot = await uploadScreenshot(data, eventName, transactionId);
    uploadedFileId = screenshot.fileId;

    const rows = buildRows(data, eventName, screenshot.webViewLink);
    const updatedRange = await appendRegistration(spreadsheetId, sheetName, rows);

    return json(res, 200, {
      success: true,
      message: "Registration saved successfully.",
      event: eventName,
      sheet: sheetName,
      participantCount: participants.length,
      range: updatedRange,
    });
  } catch (error) {
    await deleteScreenshot(uploadedFileId);
    console.error("Registration API error:", error);

    return json(res, 500, {
      success: false,
      error: error?.message || "Registration could not be saved.",
    });
  }
}
