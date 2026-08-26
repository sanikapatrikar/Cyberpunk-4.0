/**
 * CYBERPUNK 2026 // Registration Backend Google Apps Script (Code.gs)
 * 
 * Instructions to Setup:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new Spreadsheet named "CYBERPUNK 2026 Registrations".
 * 2. Click Extension -> Apps Script.
 * 3. Replace all contents of Code.gs with this script.
 * 4. Click Deploy -> New deployment.
 * 5. Select type: "Web app".
 * 6. Set Description: "Cyberpunk Registration API".
 * 7. Set "Execute as": "Me".
 * 8. Set "Who has access": "Anyone".
 * 9. Click Deploy and Authorize Access.
 * 10. Copy the Web App URL and paste it in `src/config/googleScriptConfig.js`.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Registrations");

    // Create sheet if it does not exist
    if (!sheet) {
      sheet = ss.insertSheet("Registrations");
    }

    // Set header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Event Code",
        "Event Name",
        "Team Name",
        "Team Size",
        "Total Amount (₹)",
        "Transaction ID / UTR",
        "Leader Name",
        "Leader Email",
        "Leader Phone",
        "Leader College",
        "Leader Branch",
        "Leader Year",
        "Leader Roll No",
        "All Members Details (JSON)",
        "Payment Screenshot Drive Link"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0f121d").setFontColor("#00f0ff");
    }

    // Handle Payment Screenshot Upload to Google Drive
    var screenshotUrl = "N/A";
    if (data.screenshotBase64) {
      try {
        var folderName = "CYBERPUNK_2026_PAYMENT_SCREENSHOTS";
        var folders = DriveApp.getFoldersByName(folderName);
        var folder;
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(folderName);
          folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        }

        var decodedData = Utilities.base64Decode(data.screenshotBase64);
        var blob = Utilities.newBlob(
          decodedData,
          data.screenshotMimeType || "image/jpeg",
          (data.teamName || "Registration") + "_" + (data.txId || "Txn") + "_" + new Date().getTime() + ".jpg"
        );
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        screenshotUrl = file.getUrl();
      } catch (driveErr) {
        screenshotUrl = "Upload Error: " + driveErr.toString();
      }
    }

    // Extract Leader Details (Member 1)
    var leader = (data.members && data.members.length > 0) ? data.members[0] : {};

    // Format all members as readable text string
    var membersSummary = (data.members || []).map(function(m) {
      return "Member #" + m.memberNumber + ": " + m.fullName + " | " + m.email + " | " + m.phone + " | " + m.college + " (" + m.branch + ", " + m.year + ", Roll: " + m.roll + ")";
    }).join("\n");

    // Append registration row
    var newRow = [
      data.timestamp || new Date().toISOString(),
      data.eventCode || "",
      data.eventName || "",
      data.teamName || "",
      data.teamSize || "",
      data.totalAmount || "",
      data.txId || "",
      leader.fullName || "",
      leader.email || "",
      leader.phone || "",
      leader.college || "",
      leader.branch || "",
      leader.year || "",
      leader.roll || "",
      membersSummary,
      screenshotUrl
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registration recorded successfully",
      screenshotUrl: screenshotUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
