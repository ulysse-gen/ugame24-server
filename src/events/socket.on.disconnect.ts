import { uGameServer } from "../types/ugame-server";

export default async function disconnect(socket: uGameServer.Socket) {
    if (!socket.Client)return;
    socket.uGame.MainLogger.INFO(`${socket.Client.pseudo}(${socket.Client.username}) disconnected from the server.`);
    socket.broadcast.emit('player-leave', socket.Client.username);
    socket.Client.disconnecting = true;
    /*setTimeout(() => {
        if (socket.Client.disconnecting) {
            socket.uGame.MainLogger.INFO(`${socket.Client.pseudo}(${socket.Client.username}) session expired.`);
            socket.uGame.SocketServer.ConnectedClients.delete(socket.Client.id);
        }
    }, 10000)*/
    return;
    /*utils.log(`${client.username}(${client.connection.ip}) disconnected from the server.`, `PLAYER`);
    alertBox(socket.broadcast, 0, `${client.player.pseudo} a quitté la partie.`, -1);
    socket.broadcast.emit('playerLeft', client.player);
    connectedClients[client.id].disconnecting = true;
    var content = { client: client }
    var newId = await utils.makeId(50, 'logs');
    await utils.sqlReq(`INSERT INTO logs (id, type, ip, content) VALUES ('${newId}', 'playerDisconnected', '${client.connection.ip}', '${JSON.stringify(content)}')`);
    setTimeout(async () => {
      if (connectedClients[client.id].disconnecting){
        utils.log(`${client.username}(${client.connection.ip}) session expired.`, `PLAYER`);
        delete connectedClients[client.id];
      }
    }, 10);*/
}