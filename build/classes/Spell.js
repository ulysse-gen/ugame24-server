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
class Spell {
    constructor(Character) {
        this.uGame = Character.uGame;
        this.Character = Character;
        this.Client = Character.Client;
    }
    get ClientVersion() {
        return lodash_1.default.mapValues(lodash_1.default.omit(this, ["uGame", "Client", "Character"]), (el) => (el.ClientVersion) ? el.ClientVersion : el);
    }
    LoadFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.id = id;
            let DBData = yield (0, db_1.query)(`SELECT * FROM spells WHERE id=?`, [this.id]);
            if (DBData.length == 0)
                return;
            this.id = DBData[0].id;
            this.name = DBData[0].name;
            this.description = DBData[0].description;
            this.manaCost = DBData[0].manaCost;
            this.imgUrl = DBData[0].imgUrl;
            return this;
        });
    }
}
exports.default = Spell;
