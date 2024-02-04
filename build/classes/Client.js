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
const db_1 = require("../utilities/db");
const lodash_1 = __importDefault(require("lodash"));
const Character_1 = __importDefault(require("./Character"));
class Client {
    constructor(uGame, Socket) {
        this.uGame = uGame;
        this.Socket = Socket;
    }
    get ClientVersion() {
        return lodash_1.default.mapValues(lodash_1.default.omit(this, ["uGame", "Socket", "id"]), (el) => (el.ClientVersion) ? el.ClientVersion : el);
    }
    get BroadcastVersion() {
        return lodash_1.default.mapValues(lodash_1.default.omit(this.ClientVersion, ["role", "id"]), (el) => (el.BroadcastVersion) ? el.BroadcastVersion : (el.ClientVersion) ? el.ClientVersion : el);
    }
    LoadUserFromUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            this.username = username;
            let DBData = yield (0, db_1.query)(`SELECT users.*, users_characters.characterId AS characterId FROM users JOIN users_characters ON (users_characters.userId = users.id) WHERE username=?`, [this.username]);
            if (DBData.length == 0)
                return;
            this.id = DBData[0].id;
            this.role = DBData[0].role;
            this.pseudo = DBData[0].pseudo;
            if (DBData[0].characterId)
                this.Character = yield new Character_1.default(this).LoadFromId(DBData[0].characterId);
            return this;
        });
    }
}
exports.default = Client;
