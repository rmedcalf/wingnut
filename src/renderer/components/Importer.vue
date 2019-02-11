<template>
    <div>
        <div class="columns">
            <div class="column">
                <input type="date" v-model="expiration" placeholder="Expiration" />
                <input type="text" v-model="ticker" placeholder="Ticker" />
                <a href="#" @click.prevent="reset">Reset</a>
            </div>
            <div class="column">
                
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
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="transaction in transactions" :key="transaction.$id">
                            <td>{{ transaction.date }}</td>
                            <td><a href="#" @click.prevent="filterBySymbol(transaction.symbol)">{{ transaction.symbol }}</a>..{{ transaction.type }}</td>
                            <td>{{ transaction.description }}</td>
                            <td>{{ transaction.value }}</td>
                            <td>
                                <input type="checkbox" :value="transaction" v-model="selected" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="column">
                <new-position :selected="selected" @added="remove" @restore="restore" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Transaction } from '../../lib/transaction'
import NewPosition from './NewPosition.vue'
import * as _ from 'lodash'

@Component({
    components: { NewPosition }
})
export default class Importer extends Vue {
    expiration: string | null = null;
    ticker : string | null = null;
    transactions: Transaction[] = [];
    selected: Transaction[] = [];


    @Watch('ticker') onTickerChange(value : string) {
        this.transactions = this.transactions.filter(tx => tx.symbol.startsWith(value));
    }

    async created() {
        this.reset();
    }

    async filterBySymbol(symbol : string) {
        this.transactions = await Transaction.Filter((tx) => {
            return tx.symbol == symbol;
        });
    }

    async restore(transaction: Transaction) {
        this.transactions.push(transaction);
        this.transactions = _.sortBy(this.transactions, ['date', '$id']).reverse();
    }

    remove(transactions: Transaction[]) {
        _.pullAllBy(this.transactions, transactions, '$id');
        this.selected = [];
    }

    async reset() {
        this.transactions = await Transaction.GetAll();
    }
}
</script>

<style scoped>

</style>