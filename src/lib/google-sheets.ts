import { google } from "googleapis";

type SheetBookingRow = {
  id: string;
  date: string;
  program: string;
  timeSlot: string;
  groupSize: string;
  equipment: string;
  level: string;
  ageGroup: string;
  liftPassPayment: string;
  name: string;
  phone: string;
  price: string;
  status: string;
  requestNote: string;
  createdAt: string;
};

const SHEET_TAB = "예약";
const HEADER_ROW = [
  "예약ID",
  "예약일",
  "프로그램",
  "시간대",
  "인원",
  "장비",
  "레벨",
  "연령대",
  "패찰 결제",
  "이름",
  "연락처",
  "금액",
  "상태",
  "요청사항",
  "신청일시",
];

function getCredentials() {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!email || !privateKey || !spreadsheetId) return null;
  return { email, privateKey, spreadsheetId };
}

async function getSheetsClient(email: string, privateKey: string) {
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function ensureHeaderRow(
  sheets: Awaited<ReturnType<typeof getSheetsClient>>,
  spreadsheetId: string
) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_TAB}!A1:O1`,
  });
  if (!res.data.values || res.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADER_ROW] },
    });
  }
}

/** Best-effort: appends a row for a new booking. Silently no-ops if Google Sheets env vars aren't configured. */
export async function appendBookingRow(booking: SheetBookingRow): Promise<void> {
  const credentials = getCredentials();
  if (!credentials) {
    console.warn(
      "[google-sheets] GOOGLE_SHEETS_* env vars not set — skipping sheet sync"
    );
    return;
  }

  const sheets = await getSheetsClient(credentials.email, credentials.privateKey);
  await ensureHeaderRow(sheets, credentials.spreadsheetId);

  await sheets.spreadsheets.values.append({
    spreadsheetId: credentials.spreadsheetId,
    range: `${SHEET_TAB}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          booking.id,
          booking.date,
          booking.program,
          booking.timeSlot,
          booking.groupSize,
          booking.equipment,
          booking.level,
          booking.ageGroup,
          booking.liftPassPayment,
          booking.name,
          booking.phone,
          booking.price,
          booking.status,
          booking.requestNote,
          booking.createdAt,
        ],
      ],
    },
  });
}

export function getSpreadsheetUrl(): string | null {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  return id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : null;
}
