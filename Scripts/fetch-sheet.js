const { google } = require("googleapis");
const fs = require("fs");

async function readSheet() {
  // Load service account credentials from environment variable
  const creds = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY);

  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = "1gKaETZIb0rAZ9dzI3caIBKEoorakiDhqUKJzUKHbovA"; // from your sheet URL
  const range = "MAP DATA!A1:F477"; // adjust as needed

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  // Save as JSON
  fs.writeFileSync("data/data.json", JSON.stringify(res.data.values, null, 2));


  console.log("✅ Data saved to data.json");
}

readSheet().catch(console.error);
