import Client from "./Client";
import SocketServer from "./SocketServer";
import uGame from "./uGame";

export default class AntiCheat {
    private maxWarns: number;
    private maxKicks: number;
    private speedLimit: number;
    private XSSKeywords: Array<string>;

    public uGame: uGame;
    public SocketServer: SocketServer;
    constructor(SocketServer: SocketServer) {
        this.uGame = SocketServer.uGame;
        this.SocketServer = SocketServer;

        this.maxWarns = 15;
        this.maxKicks = 5;

        this.speedLimit = 9;

        this.XSSKeywords = ['<applet>', '<script>', '<style>', '<link>', '<iframe>', '<input>', '<form>', '<video>', '<body>', '<math>', '<picture>', '<img>', '<a>', '<svg>', '<map>', '<div>', '<frameset>', '<table>', '<comment>', '<head>', '<?php', '<embed>', '<object>'];
    }

    MovementVerify(Client: Client, ClientClient: typeof Client.BroadcastVersion) {
        if (!Client.Character)return false;
        const SpeedX = ClientClient.Character.position.x - Client.Character.position.x;
        const SpeedY = ClientClient.Character.position.y - Client.Character.position.y;
        if (Client.AntiCheatData.Speed.Bypass)return false;
        if (Client.AntiCheatData.Speed.TempBypass){
            Client.AntiCheatData.Speed.TempBypass = false;
            return false;
        }
        if (SpeedX >= this.speedLimit || SpeedX <= -this.speedLimit || SpeedY >= this.speedLimit || SpeedY <= -this.speedLimit){
            Client.AntiCheatData.Speed.Warned++;
            Client.AntiCheatData.Speed.TempBypass = true;
            console.log(`Player warned for speedhacking ${Client.AntiCheatData.Speed.Warned}`)
            setTimeout(async () => { if (Client)Client.AntiCheatData.Speed.Warned--; }, 1000);
            if (Client.AntiCheatData.Speed.Warned >= this.maxWarns){
                Client.AntiCheatData.Speed.Warned = 0;
                Client.uGame.MainLogger.WARN(`${Client.pseudo}(${Client.username}) has been kicked for Speedhacking.`);
                Client.Kick(`Speedhacking`);
            }
            return true;
        }
        return false;
    }

    ChatVerify(Client: Client, Chat: string) {
        let XSSTriggered = this.XSSKeywords.reduce((Accumulator: boolean, CheckWord: string) => Accumulator = Chat.includes(CheckWord), false);

        if (XSSTriggered) {
            Client.uGame.MainLogger.WARN(`${Client.pseudo}(${Client.username}) has been kicked for XSS Detection.`);
            Client.Kick("XSS Exploiting");
            return true;
        }

        return false;
    }
}