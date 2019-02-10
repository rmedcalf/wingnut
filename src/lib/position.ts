import { Transaction } from "./transaction";
import { Status } from "./enums";

export class Position {
    strategy: string;
    transactions: Array<Transaction>;
    status: Status;
    notes: string;
    
    constructor() {
        this.notes = '';
        this.status = Status.New;
        this.strategy = '';
        this.transactions = new Array<Transaction>();   
    }

    addTransaction(transaction: Transaction) : void {
        this.transactions.push(transaction);
    }
}