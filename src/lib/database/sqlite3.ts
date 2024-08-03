import { Sequelize, DataTypes } from 'sequelize';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    DiscordServerModel,
    SpreadsheetCheckConfigModel
} from '../models.js';

const __filename = fileURLToPath(import.meta.url);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(path.dirname(__filename), '../../../local_db.sqlite'),
  logging: false
});

const DiscordServer = sequelize.define('DiscordServer', {
    serverId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    serverName: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

const SpreadsheetCheckConfig = sequelize.define('SpreadsheetCheckConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    configName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    spreadsheetId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sheetName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullSheetRange: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discordHandleColumn: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

// Add any associations or additional configuration here
DiscordServer.hasMany(SpreadsheetCheckConfig, { foreignKey: 'serverId' });

sequelize.sync();

export class SQLiteProvider {
    async getDiscordServer(serverId: string): Promise<DiscordServerModel> {
        const dbObject = await DiscordServer.findOne({ where: { serverId } });
        return {
            serverId: dbObject?.dataValues.serverId,
            serverName: dbObject?.dataValues.serverName
        };
    }

    async insertDiscordServer(serverId: string, serverName: string): Promise<DiscordServerModel> {
        const dbObject = await DiscordServer.create({ serverId, serverName });
        return {
            serverId: dbObject?.dataValues.serverId,
            serverName: dbObject?.dataValues.serverName
        };
    }

    async updateDiscordServer(serverId: string, serverName: string): Promise<boolean> {
        const [affectedCount] = await DiscordServer.update({ serverName }, { where: { serverId } });
        return affectedCount > 0;
    }

    async deleteDiscordServer(serverId: string): Promise<boolean> {
        const deletedCount = await DiscordServer.destroy({ where: { serverId } });
        return deletedCount > 0;
    }

    async getSpreadsheetCheckConfigs(serverId: string) {
        const dbObjects = await SpreadsheetCheckConfig.findAll({ where: { serverId } });
        return dbObjects.map(dbObject => ({
            configName: dbObject.dataValues.configName,
            spreadsheetId: dbObject.dataValues.spreadsheetId,
            sheetName: dbObject.dataValues.sheetName,
            fullSheetRange: dbObject.dataValues.fullSheetRange,
            discordHandleColumn: dbObject.dataValues.discordHandleColumn
        }));
    }

    async insertSpreadsheetCheckConfig(configName: string, spreadsheetId: string, sheetName: string, fullSheetRange: string, discordHandleColumn: string, serverId: string) {
        const dbObject = await SpreadsheetCheckConfig.create({ configName, spreadsheetId, sheetName, fullSheetRange, discordHandleColumn, serverId });
        return {
            configName: dbObject.dataValues.configName,
            spreadsheetId: dbObject.dataValues.spreadsheetId,
            sheetName: dbObject.dataValues.sheetName,
            fullSheetRange: dbObject.dataValues.fullSheetRange,
            discordHandleColumn: dbObject.dataValues.discordHandleColumn
        };
    }
}