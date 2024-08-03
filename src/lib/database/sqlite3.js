import { Sequelize } from 'sequelize';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


import { DiscordServerModel } from '../models/discordServerModel.js';
import { SpreadsheetCheckConfigModel } from '../models/spreadsheetCheckConfigModel.js';

const __filename = fileURLToPath(import.meta.url);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(path.dirname(__filename), '../../../local_db.sqlite')
});

const DiscordServer = sequelize.define('DiscordServer', {
    serverId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    serverName: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

const SpreadsheetCheckConfig = sequelize.define('SpreadsheetCheckConfig', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    configName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    spreadsheetId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sheetName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fullSheetRange: {
        type: Sequelize.STRING,
        allowNull: false
    },
    discordHandleColumn: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

// Add any associations or additional configuration here
DiscordServer.hasMany(SpreadsheetCheckConfig, { foreignKey: 'serverId' });

sequelize.sync();

export class SQLiteProvider {
    async getDiscordServer(serverId) {
        const dbObject = await DiscordServer.findOne({ where: { serverId } });
        return new DiscordServerModel(dbObject.serverId, dbObject.serverName);
    }

    async insertDiscordServer(serverId, serverName) {
        const dbObject = await DiscordServer.create({ serverId, serverName });
        return new DiscordServerModel(dbObject.serverId, dbObject.serverName);
    }

    async updateDiscordServer(serverId, serverName) {
        const dbObject = await DiscordServer.update({ serverName }, { where: { serverId } });
        return new DiscordServerModel(dbObject.serverId, dbObject.serverName);
    }

    async deleteDiscordServer(serverId) {
        return await DiscordServer.destroy({ where: { serverId } });
    }

    async getSpreadsheetCheckConfigs(serverId) {
        const dbObjects = await SpreadsheetCheckConfig.findAll({ where: { serverId } });
        return dbObjects.map(dbObject => new SpreadsheetCheckConfigModel(dbObject.configName, dbObject.spreadsheetId, dbObject.sheetName, dbObject.fullSheetRange, dbObject.discordHandleColumn));
    }

    async insertSpreadsheetCheckConfig(configName, spreadsheetId, sheetName, fullSheetRange, discordHandleColumn, serverId) {
        const dbObject = await SpreadsheetCheckConfig.create({ configName, spreadsheetId, sheetName, fullSheetRange, discordHandleColumn, serverId });
        return new SpreadsheetCheckConfigModel(dbObject.configName, dbObject.spreadsheetId, dbObject.sheetName, dbObject.fullSheetRange, dbObject.discordHandleColumn);
    }
}