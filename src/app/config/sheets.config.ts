import { environment } from '../../environments/environment';

export const SHEETS_CONFIG = {
  spreadsheetId: environment.sheetsSpreadsheetId,
  apiKey: environment.sheetsApiKey,
  gasWebAppUrl: environment.gasWebAppUrl,
  ranges: {
    guestList: 'GuestList!A:J',
    log: 'Log!A:F',
  },
  guestListColumns: {
    fullName: 0,           // A
    guest1Name: 1,         // B
    guest2Name: 2,         // C
    rsvpRaw: 3,            // D
    rsvpTotal: 4,          // E
    rsvpBeefCount: 5,      // F
    rsvpFishCount: 6,      // G
    rsvpSubmittedAt: 7,    // H
    rsvpSubmittedBy: 8,    // I
  },
  logColumns: {
    id: 0,
    name: 1,
    event: 2,
    count: 3,
    createdAt: 4,
  },
} as const;
