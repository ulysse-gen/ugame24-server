import { uGameServer } from "../types/ugame-server";

export default async function disconnect(socket: uGameServer.Socket) {
    if (!socket.Client)return;
    socket.Client.Leave();
    return;
}