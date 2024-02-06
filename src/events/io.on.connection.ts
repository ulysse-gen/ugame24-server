import uGame from "../classes/uGame";
import jwt from "jsonwebtoken";
import { uGameServer } from "../types/ugame-server";
import Client from "../classes/Client";
import _ from "lodash";

export default async function(uGame: uGame, socket: uGameServer.Socket) {
    socket.uGame = uGame;
    socket.SocketServer = uGame.SocketServer;
    socket.Kick = (Reason: string) => {
        socket.emit(`kick-reason`, Reason);
        socket.disconnect();
    }
    
    if (!socket.handshake.auth || !socket.handshake.auth.token || !socket.handshake.auth.token.startsWith("Bearer "))return socket.Kick(`Missing token.`);

    try {
        let Decoded = jwt.verify((socket.handshake.auth.token as string).substring(7), process.env.JWT_SECRET as string) as uGameServer.JwtPayload;
        let FetchedClient = uGame.SocketServer.ConnectedClientsByUsername.get(Decoded.username) || await new Client(uGame, socket).LoadUserFromUsername(Decoded.username);
        if (!FetchedClient)return socket.Kick(`Invalid token.`); //Non existing user
        socket.Client = FetchedClient;
    } catch(e) {
        return socket.Kick(`Invalid token.`); //Non existing user
    }

    await uGame.SocketServer.AttachClientEvents(socket);

    if (uGame.SocketServer.ConnectedClients.has(socket.Client.id)){
        socket.Client.ReJoin(socket);
    } else {
        socket.Client.Join();
    }
    return true;
}