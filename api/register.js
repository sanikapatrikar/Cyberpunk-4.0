import { google } from "googleapis";
import { Readable } from "node:stream";

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
let cachedDriveAuth;
let cachedDrive;

function requiredEnv(name) {
  const value = process.env[name];

  if (!value || !String(value).trim()) {
    throw new Error(`Missing server environment variable: ${name}`);
  }

  return String(value).trim();
}

/* =========================================================
   GOOGLE SHEETS AUTHENTICATION
   Uses Base64 encoded service-account JSON.
   ========================================================= */

function getAuth() {
  if (!cachedAuth) {
    const encoded = requiredEnv(
      "GOOGLE_SERVICE_ACCOUNT_JSON_B64"
    );

    let credentials;

    try {
      const jsonText = Buffer.from(
        encoded,
        "base64"
      ).toString("utf8");

      credentials = JSON.parse(jsonText);
    } catch (error) {
      console.error(
        "Service account JSON decode error:",
        error
      );

      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_JSON_B64 is invalid."
      );
    }

    if (!credentials.client_email) {
      throw new Error(
        "Service-account JSON is missing client_email."
      );
    }

    if (!credentials.private_key) {
      throw new Error(
        "Service-account JSON is missing private_key."
      );
    }

    cachedAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },

      // Service account is used ONLY for Sheets.
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });
  }

  return cachedAuth;
}

/* =========================================================
   GOOGLE SHEETS
   ========================================================= */

function getSheets() {
  if (!cachedSheets) {
    cachedSheets = google.sheets({
      version: "v4",
      auth: getAuth(),
    });
  }

  return cachedSheets;
}

/* =========================================================
   GOOGLE DRIVE AUTHENTICATION
   Uses personal Gmail OAuth 2.0.
   ========================================================= */

function getDriveAuth() {
  if (!cachedDriveAuth) {
    const clientId = requiredEnv(
      "GOOGLE_DRIVE_CLIENT_ID"
    );

    const clientSecret = requiredEnv(
      "GOOGLE_DRIVE_CLIENT_SECRET"
    );

    const refreshToken = requiredEnv(
      "GOOGLE_DRIVE_REFRESH_TOKEN"
    );

    cachedDriveAuth = new google.auth.OAuth2(
      clientId,
      clientSecret
    );

    cachedDriveAuth.setCredentials({
      refresh_token: refreshToken,
    });
  }

  return cachedDriveAuth;
}

/* =========================================================
   GOOGLE DRIVE
   ========================================================= */

function getDrive() {
  if (!cachedDrive) {
    cachedDrive = google.drive({
      version: "v3",
      auth: getDriveAuth(),
    });
  }

  return cachedDrive;
}

/* =========================================================
   RESPONSE HELPER
   ========================================================= */

function json(res, status, body) {
  res
    .status(status)
    .setHeader("Cache-Control", "no-store")
    .json(body);
}

/* =========================================================
   UTR NORMALIZATION
   ========================================================= */

function normalizeUtr(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/* =========================================================
   PAYLOAD VALIDATION
   ========================================================= */

function validatePayload(data) {
  const transactionId = String(
    data.transactionId || ""
  ).trim();

  if (
    !/^[A-Za-z0-9]{12,35}$/.test(
      transactionId
    )
  ) {
    throw new Error(
      "Transaction ID / UTR must contain 12 to 35 letters or numbers."
    );
  }

  const eventName = String(
    data.eventName || ""
  ).trim();

  if (!EVENT_SHEETS[eventName]) {
    throw new Error(
      `Invalid event name: ${eventName}`
    );
  }

  const participants = Array.isArray(
    data.participants
  )
    ? data.participants
    : [];

  if (participants.length === 0) {
    throw new Error(
      "No participant information received."
    );
  }

  if (
    !String(data.teamName || "").trim()
  ) {
    throw new Error(
      "Team / crew codename is required."
    );
  }

  const screenshot = String(
    data.screenshotBase64 || ""
  );

  if (!screenshot) {
    throw new Error(
      "Payment screenshot is required."
    );
  }

  /*
   * Vercel serverless request limit is approximately 4.5 MB.
   * Keep some safety margin for the JSON request itself.
   */
  if (screenshot.length > 3_500_000) {
    throw new Error(
      "Payment screenshot is too large. Please upload a smaller file."
    );
  }

  return {
    transactionId,
    eventName,
    participants,
  };
}

/* =========================================================
   CHECK DUPLICATE UTR
   Checks all four event sheets in one batch request.
   ========================================================= */

async function isDuplicateUtr(
  spreadsheetId,
  transactionId
) {
  const ranges = Object.values(
    EVENT_SHEETS
  ).map(
    (sheetName) =>
      `'${sheetName.replace(
        /'/g,
        "''"
      )}'!N2:N`
  );

  const response =
    await getSheets().spreadsheets.values.batchGet(
      {
        spreadsheetId,
        ranges,
        majorDimension: "COLUMNS",
        valueRenderOption:
          "UNFORMATTED_VALUE",
      }
    );

  const wanted =
    normalizeUtr(transactionId);

  return (
    response.data.valueRanges || []
  ).some((range) =>
    (range.values?.[0] || []).some(
      (value) =>
        normalizeUtr(value) === wanted
    )
  );
}

/* =========================================================
   UPLOAD PAYMENT SCREENSHOT TO GOOGLE DRIVE
   Uses personal Gmail OAuth.
   ========================================================= */

async function uploadScreenshot(
  data,
  eventName,
  transactionId
) {
  const drive = getDrive();

  const folderId = requiredEnv(
    "GOOGLE_DRIVE_FOLDER_ID"
  );

  const mimeType = String(
    data.screenshotMimeType ||
      "image/jpeg"
  );

  const originalName = String(
    data.screenshotFileName ||
      `payment-${Date.now()}`
  )
    .replace(
      /[\\/:*?"<>|]/g,
      "_"
    )
    .slice(0, 120);

  const safeEvent = eventName.replace(
    /[^a-zA-Z0-9_-]+/g,
    "-"
  );

  const fileName =
    `${safeEvent}-${transactionId}-${originalName}`;

  /*
   * Remove a possible data URL prefix if the frontend
   * sends something like:
   *
   * data:image/jpeg;base64,/9j/4AAQ...
   */

  let base64Data = String(
    data.screenshotBase64 || ""
  ).trim();

  if (base64Data.includes(",")) {
    base64Data =
      base64Data.split(",").pop();
  }

  const buffer = Buffer.from(
    base64Data,
    "base64"
  );

  if (!buffer.length) {
    throw new Error(
      "Payment screenshot could not be decoded."
    );
  }

  /*
   * Google Drive expects a readable stream.
   *
   * IMPORTANT:
   * Do NOT pass the Buffer directly.
   *
   * Readable.from(buffer) fixes:
   *
   * part.body.pipe is not a function
   */

  const created =
    await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },

      media: {
        mimeType,
        body: Readable.from(buffer),
      },

      fields: "id,webViewLink",
    });

  const fileId =
    created.data.id;

  if (!fileId) {
    throw new Error(
      "Google Drive did not return a file ID."
    );
  }

  const webViewLink =
    created.data.webViewLink ||
    `https://drive.google.com/file/d/${fileId}/view`;

  /*
   * Try to make the uploaded screenshot
   * publicly viewable.
   *
   * If Google blocks public sharing,
   * registration will still continue.
   */

  try {
    await drive.permissions.create({
      fileId,

      requestBody: {
        type: "anyone",
        role: "reader",
      },
    });
  } catch (permissionError) {
    console.warn(
      "Drive public-sharing permission was not applied:",
      permissionError?.message ||
        permissionError
    );
  }

  return {
    fileId,
    webViewLink,
  };
}

/* =========================================================
   BUILD SHEET ROWS
   ========================================================= */

function buildRows(
  data,
  eventName,
  screenshotUrl
) {
  const timestamp =
    new Date().toISOString();

  const participantCount =
    data.participants.length;

  const eventCode =
    EVENT_CODES[data.eventKey] ||
    String(data.eventCode || "");

  return data.participants.map(
    (participant, index) => [
      timestamp,

      eventName,

      eventCode,

      data.teamSize || "",

      participantCount,

      Number(data.totalAmount || 0),

      String(
        data.teamName || ""
      ),

      String(
        participant.fullName || ""
      ),

      String(
        participant.email || ""
      ),

      String(
        participant.phone || ""
      ),

      String(
        participant.college || ""
      ),

      String(
        participant.branch || ""
      ),

      String(
        participant.year || ""
      ),

      // UTR only on first participant row
      index === 0
        ? String(
            data.transactionId || ""
          ).trim()
        : "",

      // Screenshot only on first participant row
      index === 0
        ? screenshotUrl
        : "",
    ]
  );
}

/* =========================================================
   APPEND REGISTRATION TO GOOGLE SHEET
   ========================================================= */

async function appendRegistration(
  spreadsheetId,
  sheetName,
  rows
) {
  const result =
    await getSheets().spreadsheets.values.append(
      {
        spreadsheetId,

        range:
          `'${sheetName.replace(
            /'/g,
            "''"
          )}'!A:O`,

        valueInputOption: "RAW",

        insertDataOption:
          "INSERT_ROWS",

        includeValuesInResponse:
          false,

        resource: {
          values: rows,
        },
      }
    );

  if (
    !result.data.updates
      ?.updatedRange
  ) {
    throw new Error(
      "Google Sheets did not confirm the registration write."
    );
  }

  return (
    result.data.updates
      .updatedRange
  );
}

/* =========================================================
   DELETE SCREENSHOT IF SHEET SAVE FAILS
   ========================================================= */

async function deleteScreenshot(
  fileId
) {
  if (!fileId) return;

  try {
    await getDrive().files.delete({
      fileId,
    });
  } catch (cleanupError) {
    console.warn(
      "Could not remove orphaned screenshot:",
      cleanupError?.message ||
        cleanupError
    );
  }
}

/* =========================================================
   MAIN VERCEL API HANDLER
   ========================================================= */

export default async function handler(
  req,
  res
) {
  if (req.method !== "POST") {
    res.setHeader(
      "Allow",
      "POST"
    );

    return json(res, 405, {
      success: false,
      error: "Method not allowed.",
    });
  }

  let uploadedFileId = null;

  try {
    const data =
      req.body || {};

    const {
      transactionId,
      eventName,
      participants,
    } = validatePayload(data);

    const spreadsheetId =
      requiredEnv(
        "GOOGLE_SPREADSHEET_ID"
      );

    const sheetName =
      EVENT_SHEETS[eventName];

    /* -----------------------------------------
       CHECK DUPLICATE TRANSACTION ID
       ----------------------------------------- */

    const duplicate =
      await isDuplicateUtr(
        spreadsheetId,
        transactionId
      );

    if (duplicate) {
      return json(res, 409, {
        success: false,
        duplicate: true,

        error:
          "Transaction ID / UTR already used. Please enter a different transaction ID.",
      });
    }

    /* -----------------------------------------
       UPLOAD SCREENSHOT
       ----------------------------------------- */

    const screenshot =
      await uploadScreenshot(
        data,
        eventName,
        transactionId
      );

    uploadedFileId =
      screenshot.fileId;

    /* -----------------------------------------
       BUILD SHEET ROWS
       ----------------------------------------- */

    const rows =
      buildRows(
        data,
        eventName,
        screenshot.webViewLink
      );

    /* -----------------------------------------
       SAVE TO GOOGLE SHEETS
       ----------------------------------------- */

    const updatedRange =
      await appendRegistration(
        spreadsheetId,
        sheetName,
        rows
      );

    /* -----------------------------------------
       SUCCESS
       ----------------------------------------- */

    return json(res, 200, {
      success: true,

      message:
        "Registration saved successfully.",

      event: eventName,

      sheet: sheetName,

      participantCount:
        participants.length,

      range: updatedRange,
    });

  } catch (error) {

    /*
     * If Drive upload succeeded but Sheet write
     * failed, remove the uploaded screenshot.
     */

    await deleteScreenshot(
      uploadedFileId
    );

    console.error(
      "Registration API error:",
      error
    );

    return json(res, 500, {
      success: false,

      error:
        error?.message ||
        "Registration could not be saved.",
    });
  }
}