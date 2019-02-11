import { Transaction } from "./transaction";
import { Status } from "./enums";
import { DatabaseFactory } from "./db";

export class Position {
    symbol: string | null = null;
    strategy: string | null = null;
    transactions: Transaction[] = [];
    status: Status = Status.New;
    notes: string | null = null;
    originalCost: number = 0;
    totalCost : number = 0;
    finalValue: number = 0;
    startDate: Date | null = null;
    endDate: Date | null = null;
    daysInTrade: number = 0;
    profit: number = 0;

    async save() {
        let db = DatabaseFactory.getInstance();
        await db.table('positions').add(this);
    }
}