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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Client_1 = __importDefault(require("../classes/Client"));
function default_1(uGame, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!socket.handshake.auth || !socket.handshake.auth.token || !socket.handshake.auth.token.startsWith("Bearer "))
            return socket.disconnect();
        try {
            let Decoded = jsonwebtoken_1.default.verify(socket.handshake.auth.token.substring(7), process.env.JWT_SECRET);
            let FetchedClient = yield new Client_1.default(uGame, socket).LoadUserFromUsername(Decoded.username);
            if (!FetchedClient)
                return socket.Kick(`Invalid token.`); //Non existing user
            socket.Client = FetchedClient;
        }
        catch (e) {
            return socket.Kick(`Invalid token.`); //Non existing user
        }
        console.log(`New socket connection: ${socket.id} on ${socket.handshake.address}. Username: ${socket.Client.pseudo}`);
        socket.emit('welcome', socket.Client.ClientVersion);
        socket.broadcast.emit('player-join', socket.Client.BroadcastVersion);
        if (!socket.Client.Character)
            socket.emit('no-character', true);
        return true;
    });
}
exports.default = default_1;
