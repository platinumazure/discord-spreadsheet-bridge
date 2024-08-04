import express from 'express';
import bodyParser from 'body-parser';

import { GoogleSheetsProvider } from './lib/providers/googleSheets/googleSheetsProvider.js';
import { SQLiteProvider } from './lib/database/sqlite3.js';

const app = express();
app.use(bodyParser.json());

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

/*** Discord Server APIs ***/

// Get Discord server information by Discord server ID
app.get('/servers/:discordServerId', async (req, res) => {
  const discordServerId = req.params.discordServerId;

  const sqliteProvider = new SQLiteProvider();
  const server = await sqliteProvider.getDiscordServer(discordServerId);

  res.send(server);
});

// Create Discord server information
app.post('/servers', async (req, res) => {
  const discordServerId = req.body.discordServerId;
  const discordServerName = req.body.discordServerName;

  const sqliteProvider = new SQLiteProvider();
  const createdServer = await sqliteProvider.insertDiscordServer(
    discordServerId,
    discordServerName,
  );

  res.send(createdServer);
});

// Update Discord server information
app.put('/servers/:discordServerId', async (req, res) => {
  const discordServerId = req.params.discordServerId;
  const discordServerName = req.body.discordServerName;

  const sqliteProvider = new SQLiteProvider();
  const updated = await sqliteProvider.updateDiscordServer(
    discordServerId,
    discordServerName,
  );

  res.send(updated);
});

// Delete Discord server information
app.delete('/servers/:discordServerId', async (req, res) => {
  const discordServerId = req.params.discordServerId;

  const sqliteProvider = new SQLiteProvider();
  const deleted =
    await sqliteProvider.deleteDiscordServer(discordServerId);

  res.send(deleted);
});

/*** Spreadsheet Check Config APIs ***/

// Get all spreadsheet check configurations by Discord server ID
app.get(
  '/servers/:discordServerId/spreadsheet-check-configs',
  async (req, res) => {
    const discordServerId = req.params.discordServerId;

    const sqliteProvider = new SQLiteProvider();
    const configs =
      await sqliteProvider.getSpreadsheetCheckConfigs(discordServerId);

    res.send(configs);
  },
);

// Create a spreadsheet check configuration
app.post(
  '/servers/:discordServerId/spreadsheet-check-configs',
  async (req, res) => {
    const discordServerId = req.params.discordServerId;
    const configName = req.body.configName;
    const spreadsheetId = req.body.spreadsheetId;
    const sheetName = req.body.sheetName;
    const fullSheetRange = req.body.fullSheetRange;
    const discordHandleColumn = req.body.discordHandleColumn;

    const sqliteProvider = new SQLiteProvider();
    const createdConfig =
      await sqliteProvider.insertSpreadsheetCheckConfig(
        configName,
        spreadsheetId,
        sheetName,
        fullSheetRange,
        discordHandleColumn,
        discordServerId,
      );

    res.send(createdConfig);
  },
);

/*** Run spreadsheet check APIs ***/

app.get(
  '/servers/:discordServerId/check/:discordHandle',
  async (req, res) => {
    const discordServerId = req.params.discordServerId;
    const discordHandle = req.params.discordHandle;

    const sqliteProvider = new SQLiteProvider();
    const configs =
      await sqliteProvider.getSpreadsheetCheckConfigs(discordServerId);

    Promise.all(
      configs.map(async (config) => {
        const googleSheetsProvider = new GoogleSheetsProvider(
          config.spreadsheetId,
          config.fullSheetRange,
          config.discordHandleColumn,
        );

        const isDiscordHandlePresent =
          await googleSheetsProvider.isDiscordHandlePresent(
            discordHandle,
          );

        return {
          configName: config.configName,
          isDiscordHandlePresent,
        };
      }),
    ).then((results) => {
      res.send(results);
    });
  },
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
