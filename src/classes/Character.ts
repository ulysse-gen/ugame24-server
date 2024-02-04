import { RowDataPacket } from "mysql2";
import { query } from "../utilities/db";
import Client from "./Client";
import uGame from "./uGame";
import _ from "lodash";
import Spell from "./Spell";
import Vector2D from "./Vector2D";

export default class Character {
    public uGame: uGame;
    public Client: Client;

    public id!: string;

    public money!: number;
    public mana!: number;
    public life!: number;

    public maxMana!: number;
    public maxLife!: number;

    public imgUrl!: number;

    public Spell1?: Spell;
    public Spell2?: Spell;
    public Spell3?: Spell;

    public position: Vector2D;
    public size: Vector2D;
    constructor(Client: Client) {
        this.Client = Client;
        this.uGame = Client.uGame;

        this.position = new Vector2D(0, 0);
        this.size = new Vector2D(0, 0);
    }

    get ClientVersion() {
        return _.mapValues(_.omit(this, ["uGame", "Client", "id", "maxMana", "maxLife"]), (el: any) => (el.ClientVersion) ? el.ClientVersion : el)
    }

    get BroadcastVersion() {
        return _.mapValues(_.omit(this.ClientVersion, ["money", "mana", "life", "Spell1", "Spell2", "Spell3"]), (el: any) => (el.BroadcastVersion) ? el.BroadcastVersion : (el.ClientVersion) ? el.ClientVersion : el)
    }

    async LoadFromId(id: string) {
        this.id = id;
        let DBData = await query(`SELECT * FROM characters WHERE id=?`, [this.id]) as RowDataPacket[];
        if (DBData.length == 0)return;

        this.id = DBData[0].id;
        this.money = DBData[0].money;
        this.mana = DBData[0].mana;
        this.life = DBData[0].life;
        this.maxMana = DBData[0].maxMana;
        this.maxLife = DBData[0].maxLife;
        this.imgUrl = DBData[0].imgUrl;
        this.size.set({x: DBData[0].width, y: DBData[0].height});

        if (DBData[0].spell1)this.Spell1 = await new Spell(this).LoadFromId(DBData[0].spell1);
        if (DBData[0].spell2)this.Spell2 = await new Spell(this).LoadFromId(DBData[0].spell2);
        if (DBData[0].spell3)this.Spell3 = await new Spell(this).LoadFromId(DBData[0].spell3);

        return this;
    }

    async ExecuteSpell(Spell: number) {
        switch (Spell) {
            case 0:
                return this.Spell1?.Execute();

            case 1:
                return this.Spell2?.Execute();

            case 2:
                return this.Spell3?.Execute();
        
            default:
                return;
        }
    }
}