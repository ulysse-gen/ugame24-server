import { RowDataPacket } from "mysql2";
import Character from "./Character";
import Client from "./Client";
import uGame from "./uGame";
import { query } from "../utilities/db";
import _ from "lodash";

export default class Spell {
    public uGame: uGame;
    public Character: Character;
    public Client: Client;

    public id!: string;

    public name!: string;
    public description!: string;
    public manaCost!: string;
    public imgUrl!: string;
    public cooldown!: number;

    private CoolingDown: boolean;
    constructor(Character: Character){
        this.uGame = Character.uGame;
        this.Character = Character;
        this.Client = Character.Client;

        this.CoolingDown = false;
    }

    get ClientVersion() {
        return _.mapValues(_.omit(this, ["uGame", "Client", "Character"]), (el: any) => (el.ClientVersion) ? el.ClientVersion : el)
    }

    async LoadFromId(id: string) {
        this.id = id;
        let DBData = await query(`SELECT * FROM spells WHERE id=?`, [this.id]) as RowDataPacket[];
        if (DBData.length == 0)return;

        this.id = DBData[0].id;
        this.name = DBData[0].name;
        this.description = DBData[0].description;
        this.manaCost = DBData[0].manaCost;
        this.imgUrl = DBData[0].imgUrl;
        this.cooldown = DBData[0].cooldown;

        return this;
    }

    async Execute() {
        if (this.CoolingDown)return false;
        this.CoolingDown = true;
        setTimeout(() => {
            this.CoolingDown = false;
        }, this.cooldown*1000);
        /*
        Spell here
        */
        return true;
    }
}