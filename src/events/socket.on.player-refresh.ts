import { uGameServer } from "../types/ugame-server";

export default async function playerRefresh(socket: uGameServer.Socket, ClientClient: typeof socket.Client.BroadcastVersion) {
    const Client = socket.uGame.SocketServer.ConnectedClientsByUsername.get(ClientClient.username);
    if (!socket.Client.Character || !Client || !Client.Character || !ClientClient.Character)return;

    let MovementVerify = socket.uGame.SocketServer.AntiCheat.MovementVerify(Client, ClientClient);
    if (MovementVerify)return socket.Client.Refresh();

    Client.Character.position.set(ClientClient.Character.position);
    Client.Character.velocity.set(ClientClient.Character.Velocity);
}