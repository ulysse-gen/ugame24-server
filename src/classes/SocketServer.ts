import { Server as HTTPServer, createServer } from "http";
import uGame from "./uGame";
import express, {Express} from "express";
import { Server as IOServer, Socket } from "socket.io";
import fs from 'fs/promises';
import { readFileSync } from "fs";
import Client from "./Client";
import AntiCheat from "./AntiCheat";

export default class SocketServer {
    public uGame: uGame;

    private ExpressAPP!: Express;
    private HTTPServer!: HTTPServer;
    private IOServer!: IOServer;

    public AntiCheat: AntiCheat;

    private ClientEvents!: Array<String>;
    public ConnectedClients: Map<number, Client>;
    constructor(uGame: uGame) {
        this.uGame = uGame;
        this.ConnectedClients = new Map<number, Client>;

        this.AntiCheat = new AntiCheat(this);
    }

    get ConnectedClientsByUsername() {
        return Array.from(this.ConnectedClients.values()).reduce((Accumulator, Value) => 
            Accumulator.set(Value.username, Value),
            new Map<string, Client>,
        );
    }

    async Initialize() {
        this.uGame.DebugLogger.DEBUG(`Initializing Socket Server.`);
        this.ExpressAPP = express();
        this.HTTPServer = createServer(this.ExpressAPP);
        this.IOServer = new IOServer(this.HTTPServer, {
            cors: {
                origin: process.env.BASE_URL || "http://localhost",
                credentials: true
            }
        });

        await this.AttachEvents();

        this.ExpressAPP.get('/', function (req, res) {
            res.send(`Im a teapot.`);
        });
        this.uGame.DebugLogger.DEBUG(`Initialized Socket Server.`);
        return this;
    }

    async Start() {
        return new Promise((res, rej) => {
            this.HTTPServer.listen(process.env.SOCKET_PORT || 669, () => {
                this.uGame.MainLogger.INFO(`Socket Server started on port :${process.env.SOCKET_PORT || 669}`);
                res(true);
            })
        })
    }

    async AttachEvents() {
        this.uGame.DebugLogger.DEBUG(`Attaching events.`);
        let EventsFiles = await fs.readdir(__dirname + "/../events");
        let IOEvents = EventsFiles.filter(FileName => FileName.split(".")[0] == "io");
        this.ClientEvents = EventsFiles.filter(FileName => FileName.split(".")[0] == "socket");

        IOEvents.forEach(((Event: string) => {
            this.uGame.DebugLogger.DEBUG(`Attached IO event ${Event.split(".")[2]}.`);
            if (Event.split(".")[1] == "on")this.IOServer.on(Event.split(".")[2], (socket) => require(__dirname + "/../events/" + Event).default(this.uGame, socket));
            if (Event.split(".")[1] == "once")this.IOServer.once(Event.split(".")[2], (socket) => require(__dirname + "/../events/" + Event).default(this.uGame, socket));
        }).bind(this));

        return true;
    }

    async AttachClientEvents(socket: Socket){
        this.ClientEvents.forEach(Event => {
            this.uGame.DebugLogger.DEBUG(`Attached socket event ${Event.split(".")[2]}.`);
            if (Event.split(".")[1] == "on")socket.on(Event.split(".")[2], (data) => require(__dirname + "/../events/" + Event).default(socket, data));
            if (Event.split(".")[1] == "once")socket.once(Event.split(".")[2], (data) => require(__dirname + "/../events/" + Event).default(socket, data));
        });
        return;
    }
}