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
const Spell_1 = __importDefault(require("./Spell"));
const Vector2D_1 = __importDefault(require("./Vector2D"));
class Character {
    constructor(Client) {
        this.Client = Client;
        this.uGame = Client.uGame;
        this.position = new Vector2D_1.default(0, 0);
    }
    get ClientVersion() {
        return lodash_1.default.mapValues(lodash_1.default.omit(this, ["uGame", "Client", "id"]), (el) => (el.ClientVersion) ? el.ClientVersion : el);
    }
    get BroadcastVersion() {
        return lodash_1.default.mapValues(lodash_1.default.omit(this.ClientVersion, ["money", "mana", "life", "maxMana", "maxLife", "Spell1", "Spell2", "Spell3"]), (el) => (el.BroadcastVersion) ? el.BroadcastVersion : (el.ClientVersion) ? el.ClientVersion : el);
    }
    LoadFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.id = id;
            let DBData = yield (0, db_1.query)(`SELECT * FROM characters WHERE id=?`, [this.id]);
            if (DBData.length == 0)
                return;
            this.id = DBData[0].id;
            this.money = DBData[0].money;
            this.mana = DBData[0].mana;
            this.life = DBData[0].life;
            this.maxMana = DBData[0].maxMana;
            this.maxLife = DBData[0].maxLife;
            this.imgUrl = DBData[0].imgUrl;
            if (DBData[0].spell1)
                this.Spell1 = yield new Spell_1.default(this).LoadFromId(DBData[0].spell1);
            if (DBData[0].spell2)
                this.Spell2 = yield new Spell_1.default(this).LoadFromId(DBData[0].spell2);
            if (DBData[0].spell3)
                this.Spell3 = yield new Spell_1.default(this).LoadFromId(DBData[0].spell3);
            return this;
        });
    }
}
exports.default = Character;
