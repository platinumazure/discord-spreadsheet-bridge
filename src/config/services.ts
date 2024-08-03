export interface SpreadsheetService {
    name: string;
    apiKey: string;
}

export const googleSheetsService: SpreadsheetService = {
    name: "Google Sheets",
    apiKey: process.env.GOOGLE_SHEETS_API_KEY!,
};