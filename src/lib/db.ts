import Dexie from 'dexie';
import { Transaction } from './transaction';
const path = require('path');

export class DatabaseFactory {
    private static instance: Dexie;
    
    static getInstance() : Dexie {
        if(!DatabaseFactory.instance) {
            DatabaseFactory.instance = new Dexie('myDb');
            DatabaseFactory.instance.version(1).stores({
                transactions: '$id',
                positions: '++id',
                files: '++id, filename'
            });
        }

        return DatabaseFactory.instance;
    }
}

export class CSVFile {
    FilePath : string = '';
    FileName : string = '';
    Source : string = '';
    Transactions : Transaction[] = [];

    /**
     *
     */
    constructor(filePath : string, source: string, transactions: Transaction[]) {
        this.FilePath = filePath;
        this.Source = source;
        this.Transactions = transactions;
        this.FileName = path.basename(filePath);
    }
}