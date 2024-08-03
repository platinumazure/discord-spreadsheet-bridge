import express from "express"
import { GoogleSheetsProvider } from "./lib/providers/googleSheets/googleSheetsProvider.js";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/check/google-sheets/:discordHandle', async (req, res) => {
    const discordHandle = req.params.discordHandle;

    const googleSheetsProvider = new GoogleSheetsProvider();
    const isPresent = await googleSheetsProvider.isDiscordHandlePresent(discordHandle);

    res.send("Discord handle is present: " + isPresent);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});