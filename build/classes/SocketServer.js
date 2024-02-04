"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const promises_1 = __importDefault(require("fs/promises"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Client_1 = __importDefault(require("./Client"));
class SocketServer {
    constructor(uGame) {
        this.uGame = uGame;
    }
    Initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.uGame.DebugLogger.DEBUG(`Initializing Socket Server.`);
            this.ExpressAPP = (0, express_1.default)();
            this.HTTPServer = (0, http_1.createServer)(this.ExpressAPP);
            this.IOServer = new socket_io_1.Server(this.HTTPServer, {
                cors: {
                    origin: process.env.BASE_URL || "http://localhost",
                    credentials: true
                }
            });
            yield this.AttachEvents();
            this.ExpressAPP.get('/', function (req, res) {
                res.send(`Im a teapot.`);
            });
            this.uGame.DebugLogger.DEBUG(`Initialized Socket Server.`);
            return this;
        });
    }
    Start() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                this.HTTPServer.listen(process.env.SOCKET_PORT || 669, () => {
                    this.uGame.MainLogger.INFO(`Socket Server started on ${process.env.BASE_URL || "http://localhost"}:${process.env.SOCKET_PORT || 669}.`);
                    res(true);
                });
            });
        });
    }
    AttachEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            this.uGame.DebugLogger.DEBUG(`Attaching events.`);
            let EventsFiles = yield promises_1.default.readdir(__dirname + "/../events");
            let IOEvents = EventsFiles.filter(FileName => FileName.split(".")[0] == "io");
            this.ClientEvents = EventsFiles.filter(FileName => FileName.split(".")[0] == "socket");
            IOEvents.forEach(((Event) => {
                this.uGame.DebugLogger.DEBUG(`Attached IO event ${Event.split(".")[2]}.`);
                this.IOServer.on(Event.split(".")[2], (socket) => require(__dirname + "/../events/" + Event).default(this, socket));
            }).bind(this));
            return true;
        });
    }
    SetupMiddleware() {
        return __awaiter(this, void 0, void 0, function* () {
            this.IOServer.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Socket Middleware.`);
                socket.Kick = (Reason) => {
                    socket.emit(`kick-reason`, Reason);
                    return socket.disconnect();
                };
                try {
                    let Decoded = jsonwebtoken_1.default.verify(socket.handshake.auth.token.substring(7), process.env.JWT_SECRET);
                    let FetchedClient = yield new Client_1.default(this.uGame, socket).LoadUserFromUsername(Decoded.username);
                    if (!FetchedClient)
                        return socket.Kick(`Invalid token.`); //Non existing user
                    socket.Client = FetchedClient;
                }
                catch (e) {
                    return socket.Kick(`Invalid token.`); //Non existing user
                }
                this.ClientEvents.forEach(Event => {
                    this.uGame.DebugLogger.DEBUG(`Attached IO event ${Event.split(".")[2]}.`);
                    socket.on(Event.split(".")[2], require(__dirname + "/../events/" + Event).default);
                });
                next();
            }));
        });
    }
}
exports.default = SocketServer;
