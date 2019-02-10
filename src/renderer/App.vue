<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { ipcRenderer } from 'electron'
  import { Transaction } from '../lib/transaction'

  export default Vue.extend({
    name: 'wingnut',
    created() {
      ipcRenderer.on('navigate', (event: any, navigateTo: string) => {
        this.$router.push(navigateTo);
      });

      ipcRenderer.on('csv-read', async(event : any, items: Array<Transaction>) => {
        await Transaction.insert(items);
        this.$router.push('importer');
      });
    }
  });
</script>

<style>
  /* CSS */
</style>
