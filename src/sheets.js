import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

export async function addRow(row) {
  const sheets = google.sheets({
    version: "v4",
    auth
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row]
    }
  });
}

export async function getExistingIds() {
  const sheets = google.sheets({
    version: "v4",
    auth
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "H:H"
  });

  const rows = response.data.values || [];

  return new Set(
    rows
      .flat()
      .filter(id => id && id !== "ID")
  );
}

export async function getCompanyScores() {
  const sheets = google.sheets({
    version: "v4",
    auth
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "A:H"
  });

  const rows = response.data.values || [];

  const companyScores = new Map();

  for (const row of rows.slice(1)) {
    const date = row[0];
    const company = row[2];
    const score = Number(row[6]) || 0;

    if (!date || !company) continue;

    const key = `${date}-${company}`;

    if (
      !companyScores.has(key) ||
      score > companyScores.get(key)
    ) {
      companyScores.set(key, score);
    }
  }

  return companyScores;
}