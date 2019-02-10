<template>
    <div>
        <div class="columns">
            <div class="column">
                <input type="date" v-model="expiration" placeholder="Expiration" />
                <a href="#" @click.prevent="reset">Reset</a>
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
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Transaction } from '../../lib/transaction'

@Component
export default class Importer extends Vue {
    expiration: string | null = null;
    transactions: Transaction[] = [];
    selected: Transaction[] = [];

    async created() {
        this.transactions = await Transaction.GetAll();
    }

    filterBySymbol() {

    }
}
</script>

<style scoped>

</style>