const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load service account key from environment variable
const key = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY);

// Configure JWT auth client
const auth = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/spreadsheets.readonly"]
);

const sheets = google.sheets({ version: "v4", auth });

// Your spreadsheet ID and range
const SPREADSHEET_ID = "1gKaETZIb0rAZ9dzI3caIBKEoorakiDhqUKJzUKHbovA"; // from your sheet URL
const RANGE = "MAP DATA!A1:F477"; // adjust as needed

async function fetchSheet() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const data = res.data.values || [];

    // Ensure folder exists
    const folder = "data";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    // Write JSON file
    fs.writeFileSync(path.join(folder, "2025.json"), JSON.stringify(data, null, 2));

    console.log(`✅ Fetched ${data.length} rows and saved to data/2025.json`);
  } catch (err) {
    console.error("❌ Error fetching sheet:", err);
    process.exit(1);
  }
}

fetchSheet();
