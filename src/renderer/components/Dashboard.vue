<template>
    <div>
        <div class="columns">
            <div class="column is-three-fifths">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Ticker</th>
                            <th>Strategy</th>
                            <th>Original Cost Basis</th>
                            <th>Total Cost Basis</th>
                            <th>Days in Trade</th>
                            <th>P/L</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="position in positions" :key="position.id">
                            <td>{{ position.symbol }}</td>
                            <td>{{ position.strategy }}</td>
                            <td>{{ position.originalCost }}</td>
                            <td>{{ position.totalCost }}</td>
                            <td>{{ position.daysInTrade }}</td>
                            <td>{{ position.profit | money }}</td>
                            <td><a href="#" @click.prevent="details">View Details</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="column is-two-fifths">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Position } from '../../lib/position';
import { DatabaseFactory } from '../../lib/db';

@Component
export default class Dashboard extends Vue {
    positions: Position[] = [];

    async created() {
        let db = DatabaseFactory.getInstance();
        let data = await db.table('positions').toArray();
        this.positions = data as Position[];
    }
}
</script>