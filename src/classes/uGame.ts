import Client from "./Client";
import Logger from "./Logger";
import SocketServer from "./SocketServer";

export default class uGame {
    private initialized: boolean;

    private name!: string;
    private version!: string;
    private hostOS!: string;

    public MainLogger!: Logger;
    public DebugLogger!: Logger;

    public SocketServer!: SocketServer;

    private TargetTPS: number;
    constructor() {
        this.initialized = false;

        this.TargetTPS = 50;
    }

    async Tick() {
        if (!this.initialized)return false;
        this.SocketServer.IOServer.emit('player-refresh', Array.from(this.SocketServer.ConnectedClients.values()).map(client=>client.BroadcastVersion));

        setTimeout(this.Tick.bind(this), 1000/this.TargetTPS);
    }

    async Start() {
        if (!this.initialized)await this.Initialize();
        this.MainLogger.INFO(`Starting uGame.`);
        await this.SocketServer.Start();
        this.MainLogger.INFO(`Started uGame.`);
        this.Tick();
        return this;
    }

    async Stop(ExitCode: 0 | 1 = 0) {
        return process.exit(ExitCode);
    }

    async Initialize() {
        this.MainLogger = new Logger(true);
        this.DebugLogger = new Logger(true, undefined, "DEBUG");

        this.DebugLogger.DEBUG(`Initializing uGame.`);

        await this.CheckIntegrity();

        const Package = require('../../package.json');
        this.name = Package.name || "unknown";
        this.version = Package.version || "unknown";
        this.hostOS = process.env.OS || "unknown";

        this.SocketServer = await new SocketServer(this).Initialize();
        
        this.initialized = true;
        this.DebugLogger.DEBUG(`Initialized uGame.`);
        return this;
    }

    async CheckIntegrity() {
        let SQLReady = true;
        let safe = true;

        if (!process.env.MYSQL_DB){
            this.MainLogger.ERROR('Missing environnement variable "MYSQL_DB"');
            SQLReady = false;
        }
        if (!process.env.MYSQL_PASSWD){
            this.MainLogger.ERROR('Missing environnement variable "MYSQL_PASSWD"');
            SQLReady = false;
        }

        if (!process.env.JWT_SECRET){
            this.MainLogger.ERROR('Missing environnement variable "JWT_SECRET.');
            safe = false;
        }
        
        
        if (!process.env.MYSQL_HOST){
            this.MainLogger.ERROR('Missing environnement variable "MYSQL_HOST"using default "127.0.0.1"')
        }
        if (!process.env.MYSQL_USER){
            this.MainLogger.WARN('Missing environnement variable "MYSQL_USER", using default "ugame"');
        }
        if (!process.env.MYSQL_PORT){
            this.MainLogger.WARN('Missing environnement variable "MYSQL_PORT", using default "3306".');
        }

        if (!process.env.BASE_URL){
            this.MainLogger.WARN('Missing environnement variable "BASE_URL", using default "http://localhost".');
        }

        if (!process.env.SOCKET_PORT){
            this.MainLogger.WARN('Missing environnement variable "SOCKET_PORT", using default "669".');
        }

        if (!SQLReady || !safe) {
            return this.Stop(1);
        }
    }
}