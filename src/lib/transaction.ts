import Dexie from 'dexie'
import { DatabaseFactory } from './db';
import { Action } from './enums';

export class Transaction {
    action: string;
    $date: string;
    date: Date;
    strike: number;
    symbol: string;
    value: number;
    expiration: string;
    $symbol: string;
    $id: string;
    description: string;
    type: string;
    qty: number;
    raw: any;
    status: Action | null = null;
    selected: boolean = false;
    fromFile: string = '';

    constructor() {
        this.action = '';
        this.$date = '';
        this.date = new Date();
        this.strike = 0;
        this.symbol = '';
        this.value =  0;
        this.expiration = '';
        this.$symbol = '';
        this.$id = '';
        this.description = '';
        this.type = '';
        this.qty = 0;
    }

    readFromCsv(data: any): void {
        this.action = data.Action;
        this.$date = data.Date;
        this.date = new Date(data.Date);
        this.strike = parseFloat(data['Strike Price']);
        this.symbol = data['Underlying Symbol'];
        this.value = parseFloat(data.Value);
        this.type = data['Call or Put'];
        this.expiration = data['Expiration Date'];
        this.$symbol = data.Symbol;
        this.$id = `${data.Symbol}${data.Date}`;
        this.description = data.Description;
        this.qty = data.Quantity;
        this.raw = data;
    }

    static async insert(transactions: Transaction[]) : Promise<void> {
        let db = DatabaseFactory.getInstance();
        await db.table('transactions').bulkAdd(transactions);
    }

    static async GetAll() : Promise<Transaction[]> {
        let db = DatabaseFactory.getInstance();
        let data = await db.table('transactions').toCollection().reverse().sortBy('date');
        return <Array<Transaction>>data;
    }

    static async Filter(filter: {(tx: Transaction): boolean}) : Promise<Transaction[]> {
        let db = DatabaseFactory.getInstance();
        let data = await db.table('transactions').filter(filter).reverse().sortBy('date');
        return data as Transaction[];
    }
}