import { google } from 'googleapis';
import { googleSheetsService } from '../../../config/services.js';
import { SpreadsheetProvider } from '../spreadsheetProvider.js';

const API_KEY = googleSheetsService.apiKey;

// TODO: Load these from a database :-)
const SPREADSHEET_ID = '1bWM1DgKSwd_vHJlItXoxt_gKYdUfTeDr_kNEqQXxl9A';
const FULL_SHEET_RANGE = 'Sheet1!$A$2:C';
const DISCORD_HANDLE_COLUMN = 2;

export class GoogleSheetsProvider implements SpreadsheetProvider {
  constructor(
    private spreadsheetId: string = SPREADSHEET_ID,
    private fullSheetRange: string = FULL_SHEET_RANGE,
    private discordHandleColumn: number = DISCORD_HANDLE_COLUMN,
  ) {}

  async isDiscordHandlePresent(discordHandle: string): Promise<boolean> {
    // Authenticate to Google API with apiKey
    const sheets = google.sheets({ version: 'v4', auth: API_KEY });

    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: this.fullSheetRange,
      })
      .then((res) => {
        const rows = res.data.values;
        if (rows?.length) {
          resolve(rows.some((row) => row[this.discordHandleColumn] === discordHandle));
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
};