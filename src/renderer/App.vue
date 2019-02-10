<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import { ipcRenderer } from 'electron'
  import { Transaction } from '../lib/transaction'

  export default {
    name: 'wingnut',
    created() {
      ipcRenderer.on('csv-read', async(event : any, items: Array<Transaction>) => {
        await Transaction.insert(items);
      });
    }
  }
</script>

<style>
  /* CSS */
</style>
