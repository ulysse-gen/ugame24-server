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
    public kicked?: boolean;

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
        this.kicked = true;
        return this.Socket.Kick(KickMessage);
    }

    async Ban(BanMessage: string = "You have been banned.") {
        return this.Socket.Kick(BanMessage);
    }

    async Refresh(Client: Client = this) {
        return this.Socket.emit('self-refresh', Client.ClientVersion);
    }

    async Join() {
        this.uGame.MainLogger.INFO(`${this.pseudo}(${this.username}) connected to the server.`);
        this.uGame.SocketServer.ConnectedClients.set(this.id, this);
        this.Socket.emit('welcome', this.ClientVersion);
        this.Socket.broadcast.emit('player-join', this.BroadcastVersion);
        this.Socket.emit('players-online', Array.from(this.uGame.SocketServer.ConnectedClients.values()).filter(client => client.id != this.id).map(client => client.BroadcastVersion));
        if (!this.Character)this.Socket.emit('no-character', true);
    }

    async ReJoin(socket: uGameServer.Socket){
        this.uGame.MainLogger.INFO(`${this.pseudo}(${this.username}) reconnected to the server.`);
        delete this.disconnecting;
        this.Socket = socket;
        this.Socket.emit('welcome-back', this.ClientVersion);
        this.Socket.broadcast.emit('player-join', this.BroadcastVersion);
        this.Socket.emit('players-online', Array.from(this.uGame.SocketServer.ConnectedClients.values()).filter(client => client.id != this.id && !client.disconnecting).map(client => client.BroadcastVersion));
        if (!this.Character)this.Socket.emit('no-character', true);
    }

    async Leave(){
        this.uGame.MainLogger.INFO(`${this.pseudo}(${this.username}) disconnected from the server.`);
        this.Socket.broadcast.emit('player-leave', this.username);

        if (this.kicked){
            this.uGame.SocketServer.ConnectedClients.delete(this.id);
            return;
        }
        
        this.disconnecting = true;
        setTimeout((async () => {
            if (this.uGame.SocketServer.ConnectedClients.has(this.id) || !this.disconnecting)return;
            this.uGame.MainLogger.INFO(`${this.pseudo}(${this.username}) session expired.`);
            this.uGame.SocketServer.ConnectedClients.delete(this.id);
        }).bind(this), 10000);
        return true;
    }
}