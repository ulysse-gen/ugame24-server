import uGame from "./uGame";
import { uGameServer } from "../types/ugame-server";
import { query } from "../utilities/db";
import { RowDataPacket } from "mysql2";
import _ from "lodash";
import Character from "./Character";

export default class Client {
    public uGame: uGame;
    public Socket: uGameServer.Socket;

    public id!: number;
    public username!: string;
    public role!: string;
    public pseudo!: boolean;

    public disconnecting?: boolean;

    public Character?: Character;

    public AntiCheatData: uGameServer.AntiCheatData;
    constructor(uGame: uGame, Socket: uGameServer.Socket) {
        this.uGame = uGame;
        this.Socket = Socket;

        this.AntiCheatData = {
            XSS: {
                Bypass: false,
                TempBypass: false,
                Warned: 0
            },
            Speed: {
                Bypass: false,
                TempBypass: false,
                Warned: 0
            }
        }
    }

    get ClientVersion() {
        return _.mapValues(_.omit(this, ["uGame", "Socket", "id", "AntiCheatData", "disconnecting"]), (el: any) => (el.ClientVersion) ? el.ClientVersion : el)
    }

    get BroadcastVersion() {
        return _.mapValues(_.omit(this.ClientVersion, ["role", "id"]), (el: any) => (el.BroadcastVersion) ? el.BroadcastVersion : (el.ClientVersion) ? el.ClientVersion : el)
    }

    async LoadUserFromUsername(username: string) {
        this.username = username;
        let DBData = await query(`SELECT users.*, users_characters.characterId AS characterId FROM users JOIN users_characters ON (users_characters.userId = users.id) WHERE username=?`, [this.username]) as RowDataPacket[];
        if (DBData.length == 0)return;

        this.id = DBData[0].id;
        this.role = DBData[0].role;
        this.pseudo = DBData[0].pseudo;

        if (DBData[0].characterId)this.Character = await new Character(this).LoadFromId(DBData[0].characterId);

        return this;
    }

    async Kick(KickMessage: string = "You have been kicked.") {
        this.Socket.Kick(KickMessage);
    }

    async Ban(BanMessage: string = "You have been banned.") {
        this.Socket.Kick(BanMessage);
    }
}