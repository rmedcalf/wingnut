<template>
    <div>
        <div class="columns">
            <div class="column">
                <a class="button is-primary" @click.prevent="open" v-if="status == null || status == 'open'">Open Trade</a>
                <a class="button is-primary" @click.prevent="adjust" v-if="status == 'open'">Adjustment</a>
                <a class="button is-primary" @click.prevent="roll" v-if="status == 'open'">Roll</a>
                <a class="button is-primary" @click.prevent="close" v-if="status == 'open'">Close</a>
            </div>
        </div>
        <div class="columns">
            <!-- <div class="column is-one-quarter">
                Profit: <span :class="{ profit: profit >= 0, loss: profit < 0 }">{{ profit | money }}</span>
            </div> -->
            <div class="column is-one-quarter">
                <input class="input is-small" type="text" placeholder="Symbol" v-model="symbol" />
            </div>
            <div class="column is-one-quarter">
                <input class="input is-small" type="text" placeholder="IV Rank" v-model="ivRank" />
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-quarter">
                <div class="field">
                    <div class="control">
                        <div class="select is-small">
                            <select v-model="strategy">
                                <option :value="null">-Strategy-</option>
                                <option value="Iron Condor">Iron Condor</option>
                                <option value="Iron Butterfly">Iron Butterfly</option>
                                <option value="Strangle">Strangle</option>
                                <option value="Straddle">Straddle</option>
                                <option value="Long Call">Long Call</option>
                                <option value="Long Put">Long Put</option>
                                <option value="Call Debit Spread">Call Debit Spread</option>
                                <option value="Put Debit Spread">Put Debit Spread</option>
                                <option value="Put Calendar Spread">Put Calendar Spread</option>
                                <option value="Call Credit Spread">Call Credit Spread</option>
                                <option value="Put Credit Spread">Put Credit Spread</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Symbol</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Action</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="transaction in transactions" :key="transaction.$id">
                            <td>{{ transaction.date }}</td>
                            <td>{{ transaction.symbol }}..{{ transaction.type }}</td>
                            <td>{{ transaction.description }}</td>
                            <td>{{ transaction.value }}</td>
                            <td>{{ transaction.action }}</td>
                            <td><a href="#" @click.prevent="remove(transaction)">Remove</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <textarea class="textarea" v-model="note" placeholder="Trade Notes"></textarea>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                Profit: <span :class="{ profit: profit >= 0, loss: profit < 0 }">{{ profit | money }}</span>
            </div>
        </div>
        <div class="columns" v-if="status == 'closed'">
            <div class="column is-one-fifth">
                <a class="button is-primary" @click.prevent="save">Save Position</a>
            </div>
            <div class="column is-one-fifth">
                <a class="button is-warning" @click.prevent="cancel">Cancel</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Transaction } from '../../lib/transaction';
import { Position } from '../../lib/position';
import * as _ from 'lodash'
import * as moment from 'moment';
import { Action } from '../../lib/enums';

@Component
export default class NewPosition extends Vue {
    @Prop() selected!: Transaction[];
    status : string | null = null;
    transactions: Transaction[] = [];
    note: string | null = null;
    profit: number = 0;
    ivRank: number | null = null;
    strategy: string | null = null;
    symbol: string | null = null;
    position: Position = new Position();
    startDate: Date = new Date();
    endDate: Date = new Date();
    expiration: Date | null = null;

    @Watch('status') onStatusChange(value: string) {
        if(value != 'closed') {
            this.profit = 0;
        }
    }

    open() : void {
        this.symbol = this.selected[0].symbol;
        this.profit = 0;
        this.addAction(Action.Opening);
        this.status = 'open';
        this.startDate = this.getDateForTransactionType(Action.Opening);
    }

    private getDateForTransactionType(action : Action) : Date {
        let transaction = this.transactions.find(tx => tx.status == action);
        if(transaction ) {
            return transaction.date;
        }
        return new Date();
    }

    private saveImportedTransactionIds() {
        let lsKey = 'importedTransactions';
        let current = JSON.parse(localStorage.getItem(lsKey) || '[]');
        let ids = this.transactions.map(t => t.$id);
        let set = new Set(current.concat(ids));
        localStorage.setItem(lsKey, JSON.stringify(Array.from(set)));
    }

    save() : void {
        this.position.transactions = this.transactions;
        this.position.strategy = this.strategy;
        this.position.symbol = this.symbol;
        this.position.profit = this.profit;
        this.position.notes = this.note;
        this.position.originalCost = 0;
        this.position.totalCost = 0;

        this.transactions.forEach(transaction => {
            if(transaction.status == Action.Opening) {
                this.position.originalCost += transaction.value;
            }
            else if(transaction.status == Action.Rolling || transaction.status == Action.Adjustment) {
                this.position.totalCost += transaction.value;
            }
            else if(transaction.status == Action.Closing) {
                this.position.finalValue += transaction.value;
            }
        });

        this.position.totalCost += this.position.originalCost;
        let start = moment(this.startDate);
        let end = moment(this.endDate);

        this.position.daysInTrade = end.diff(start, 'days') + 1;
        this.position.startDate = this.startDate;
        this.position.endDate = this.endDate;

        this.position.save();
        this.saveImportedTransactionIds();        
        this.resetFields();
    }

    cancel() {
        this.transactions.forEach(transaction => {
            this.remove(transaction);
        });
        this.resetFields();
    }

    remove(transaction: Transaction) : void {
        this.transactions = this.transactions.filter(t => t.$id != transaction.$id);
        this.$emit('restore', transaction);
        this.status = 'open';
        if(!this.transactions.length) {
            this.status = null;
        }
    }

    adjust() : void {
        this.addAction(Action.Adjustment);
    }
    
    roll() : void {
        this.addAction(Action.Rolling);
    }
    
    close() : void {
        this.addAction(Action.Closing);
        this.status = 'closed';
        this.transactions.forEach(transaction => {
            this.profit += transaction.value;
        });
        this.endDate = this.getDateForTransactionType(Action.Closing);
    }

    private resetFields() {
        this.status = null;
        this.symbol = null;
        this.strategy = null;
        this.ivRank = null;
        this.note = null;
        this.profit = 0;
        this.startDate = new Date();
        this.endDate = new Date();
        this.position = new Position();
    }

    private addAction(action: Action) : void {
        let tx = [...this.selected];
        this.setStatus(tx, action);
        this.transactions = this.transactions.concat(tx);
        this.$emit('added', this.selected);
    }

    private setStatus(tx: Transaction[], status: Action) : void {
        tx.forEach(transaction => {
            transaction.status = status;
        });
    }

}
</script>

<style scoped>
    .profit {
        color: green;
    }
    .loss { 
        color: red;
    }
</style>