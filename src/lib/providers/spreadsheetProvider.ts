export interface SpreadsheetProvider {
  isDiscordHandlePresent(discordHandle: string): Promise<boolean>;
}
