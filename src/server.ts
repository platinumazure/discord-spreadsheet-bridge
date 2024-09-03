import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import minimist from 'minimist';

import { GoogleSheetsProvider } from './lib/providers/googleSheets/googleSheetsProvider.js';
import { SQLiteProvider } from './lib/database/sqlite3.js';

// Parse command-line arguments
const args = minimist(process.argv.slice(2));
const port = args.port || 3000; // Default to 3000 if not provided

const app = express();
app.use(bodyParser.json());

// Define interfaces for request bodies
interface CreateServerRequest {
  discordServerId: string;
  discordServerName: string;
}

interface UpdateServerRequest {
  discordServerName: string;
}

interface CreateSpreadsheetCheckConfigRequest {
  configName: string;
  spreadsheetId: string;
  sheetName: string;
  fullSheetRange: string;
  discordHandleColumn: string;
}

// Define interfaces for response bodies
interface ServerResponse {
  id: string;
  name: string;
}

interface SpreadsheetCheckConfigResponse {
  configName: string;
  isDiscordHandlePresent: boolean;
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

// Get Discord server information by Discord server ID
app.get(
  '/servers/:discordServerId',
  async (req: Request, res: Response<ServerResponse>) => {
    const discordServerId = req.params.discordServerId;

    const sqliteProvider = new SQLiteProvider();
    const server =
      await sqliteProvider.getDiscordServer(discordServerId);

    const response: ServerResponse = {
      id: server.serverId,
      name: server.serverName,
    };

    res.send(response);
  },
);

app.post(
  '/servers',
  async (req: Request, res: Response<ServerResponse>) => {
    console.log('Request body:', req.body); // Check if this logs the correct body
    const discordServerId = req.body.discordServerId;
    const discordServerName = req.body.discordServerName;

    const sqliteProvider = new SQLiteProvider();
    const createdServer = await sqliteProvider.insertDiscordServer(
      discordServerId,
      discordServerName,
    );

    const createdServerResponse: ServerResponse = {
      id: createdServer.serverId,
      name: createdServer.serverName,
    };

    res.send(createdServerResponse);
  },
);

app.get(
  '/check/google-sheets/:discordHandle',
  async (req: Request, res: Response) => {
    const discordHandle = req.params.discordHandle;

    const googleSheetsProvider = new GoogleSheetsProvider();
    const isPresent =
      await googleSheetsProvider.isDiscordHandlePresent(discordHandle);

    res.send('Discord handle is present: ' + isPresent);
  },
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
