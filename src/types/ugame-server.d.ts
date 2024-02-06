import { Socket as SocketIOSocket } from "socket.io";
import Client from "../classes/Client";
import SocketServer from "../classes/SocketServer";
import uGame from "../classes/uGame";

export namespace uGameServer {
    interface Server {
        name: string
    }

    interface JwtPayload {
        username: string,
        iat: number,
        exp: number
    }

    interface Socket extends SocketIOSocket {
        Client: Client;
        Kick: Function;
        uGame: uGame;
        SocketServer: SocketServer;
    }

    interface SocketMiddleware extends SocketIOSockett<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
        Client: Client;
        Kick: Function;
    }

    interface AntiCheatData {
        XSS: {
            Bypass: boolean;
            TempBypass: boolean;
            Warned: number;
        };
        Speed: {
            Bypass: boolean;
            TempBypass: boolean;
            Warned: number;
        }
    }

    type LogType = string | "INFO" | "WARN" | "ERROR" | "DEBUG";
    type LogContent = string;
}