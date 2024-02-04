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
const Logger_1 = __importDefault(require("./Logger"));
const SocketServer_1 = __importDefault(require("./SocketServer"));
class uGame {
    constructor() {
        this.initialized = false;
    }
    Start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.initialized)
                yield this.Initialize();
            this.MainLogger.INFO(`Starting uGame.`);
            yield this.SocketServer.Start();
            this.MainLogger.INFO(`Started uGame.`);
            return this;
        });
    }
    Stop(ExitCode = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return process.exit(ExitCode);
        });
    }
    Initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.MainLogger = new Logger_1.default(true);
            this.DebugLogger = new Logger_1.default(true, undefined, "DEBUG");
            this.DebugLogger.DEBUG(`Initializing uGame.`);
            yield this.CheckIntegrity();
            const Package = require('../../package.json');
            this.name = Package.name || "unknown";
            this.version = Package.version || "unknown";
            this.hostOS = process.env.OS || "unknown";
            this.SocketServer = yield new SocketServer_1.default(this).Initialize();
            this.initialized = true;
            this.DebugLogger.DEBUG(`Initialized uGame.`);
            return this;
        });
    }
    CheckIntegrity() {
        return __awaiter(this, void 0, void 0, function* () {
            let SQLReady = true;
            let safe = true;
            if (!process.env.MYSQL_DB) {
                this.MainLogger.ERROR('Missing environnement variable "MYSQL_DB"');
                SQLReady = false;
            }
            if (!process.env.MYSQL_PASSWD) {
                this.MainLogger.ERROR('Missing environnement variable "MYSQL_PASSWD"');
                SQLReady = false;
            }
            if (!process.env.JWT_SECRET) {
                this.MainLogger.ERROR('Missing environnement variable "JWT_SECRET.');
                safe = false;
            }
            if (!process.env.MYSQL_HOST) {
                this.MainLogger.ERROR('Missing environnement variable "MYSQL_HOST"using default "127.0.0.1"');
            }
            if (!process.env.MYSQL_USER) {
                this.MainLogger.WARN('Missing environnement variable "MYSQL_USER", using default "ugame"');
            }
            if (!process.env.MYSQL_PORT) {
                this.MainLogger.WARN('Missing environnement variable "MYSQL_PORT", using default "3306".');
            }
            if (!process.env.BASE_URL) {
                this.MainLogger.WARN('Missing environnement variable "BASE_URL", using default "http://localhost".');
            }
            if (!process.env.SOCKET_PORT) {
                this.MainLogger.WARN('Missing environnement variable "SOCKET_PORT", using default "669".');
            }
            if (!SQLReady || !safe) {
                return this.Stop(1);
            }
        });
    }
}
exports.default = uGame;
