import { uGameServer } from "../types/ugame-server";

export default async function playerRefresh(socket: uGameServer.Socket, SpellNo: 0 | 1 | 2) {
    let SpellExecution = await socket.Client.Character?.ExecuteSpell(SpellNo);
    return;
}