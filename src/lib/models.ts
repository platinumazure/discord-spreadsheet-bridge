export interface DiscordServerModel {
  serverId: string;
  serverName: string;
}

export interface SpreadsheetCheckConfigModel {
  discordServerId: string;
  configName: string;
  spreadsheetId: string;
  sheetName: string;
  fullSheetRange: string;
  discordHandleColumn: string;
}
