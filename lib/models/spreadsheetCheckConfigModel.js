export class SpreadsheetCheckConfigModel {
    constructor(
        discordServerId,
        configName,
        spreadsheetId,
        sheetName,
        fullSheetRange,
        discordHandleColumn,
    ) {
        this.discordServerId = discordServerId;
        this.configName = configName;
        this.spreadsheetId = spreadsheetId;
        this.sheetName = sheetName;
        this.fullSheetRange = fullSheetRange;
        this.discordHandleColumn = discordHandleColumn;
    }
}