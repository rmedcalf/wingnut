import Dexie from 'dexie';

export class DatabaseFactory {
    private static instance: Dexie;
    
    static getInstance() : Dexie {
        if(!DatabaseFactory.instance) {
            DatabaseFactory.instance = new Dexie('myDb');
            DatabaseFactory.instance.version(1).stores({
                transactions: '$id'
            });
        }

        return DatabaseFactory.instance;
    }
}