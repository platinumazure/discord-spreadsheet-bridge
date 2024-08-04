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

// Get Discord server information by Discord server ID
app.get('/servers/:discordServerId', async (req, res) => {
  const discordServerId = req.params.discordServerId;

  const sqliteProvider = new SQLiteProvider();
  const server = await sqliteProvider.getDiscordServer(discordServerId);

  res.send(server);
});

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

app.get('/check/google-sheets/:discordHandle', async (req, res) => {
  const discordHandle = req.params.discordHandle;

  const googleSheetsProvider = new GoogleSheetsProvider();
  const isPresent =
    await googleSheetsProvider.isDiscordHandlePresent(discordHandle);

  res.send('Discord handle is present: ' + isPresent);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
