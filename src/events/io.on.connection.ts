import uGame from "../classes/uGame";
import jwt from "jsonwebtoken";
import { uGameServer } from "../types/ugame-server";
import Client from "../classes/Client";
import _ from "lodash";

export default async function(uGame: uGame, socket: uGameServer.Socket) {
    socket.uGame = uGame;
    socket.Kick = (Reason: string) => {
        socket.emit(`kick-reason`, Reason);
        socket.disconnect();
    }
    
    if (!socket.handshake.auth || !socket.handshake.auth.token || !socket.handshake.auth.token.startsWith("Bearer "))return socket.Kick(`Missing token.`);

    try {
        let Decoded = jwt.verify((socket.handshake.auth.token as string).substring(7), process.env.JWT_SECRET as string) as uGameServer.JwtPayload;
        let FetchedClient = await new Client(uGame, socket).LoadUserFromUsername(Decoded.username);
        if (!FetchedClient)return socket.Kick(`Invalid token.`); //Non existing user
        socket.Client = FetchedClient;
    } catch(e) {
        return socket.Kick(`Invalid token.`); //Non existing user
    }

    await uGame.SocketServer.AttachClientEvents(socket);



    

    if (!uGame.SocketServer.ConnectedClients.get(socket.Client.id)){
        uGame.MainLogger.INFO(`${socket.Client.pseudo}(${socket.Client.username}) connected to the server.`);
        uGame.SocketServer.ConnectedClients.set(socket.Client.id, socket.Client);
        socket.emit('welcome', socket.Client.ClientVersion);
    } else {
        let client = uGame.SocketServer.ConnectedClients.get(socket.Client.id) as Client;
        delete client.disconnecting;
        client.Socket = socket;
        uGame.MainLogger.INFO(`${socket.Client.pseudo}(${socket.Client.username}) reconnected to the server.`);
        socket.emit('welcome-back', socket.Client.ClientVersion);
    }

    socket.broadcast.emit('player-join', socket.Client.BroadcastVersion);
    socket.emit('players-online', Array.from(uGame.SocketServer.ConnectedClients.values()).filter(client => client.id != socket.Client.id).map(client => client.BroadcastVersion));
    if (!socket.Client.Character)socket.emit('no-character', true);

    
    return true;
}