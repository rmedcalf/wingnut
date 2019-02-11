<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { ipcRenderer } from 'electron'
  import { Transaction } from '../lib/transaction'
  import { CSVFile, DatabaseFactory } from '../lib/db';

  export default Vue.extend({
    name: 'wingnut',
    created() {
      ipcRenderer.on('navigate', (event: any, navigateTo: string) => {
        this.$router.push(navigateTo);
      });

      ipcRenderer.on('csv-read', async(event : any, file: CSVFile) => {
        let db = DatabaseFactory.getInstance();
        db.table('files').add({ filename: file.FileName, path: file.FilePath, source: file.Source });
        await Transaction.insert(file.Transactions);
        this.$router.push('importer');
      });
    }
  });
</script>

<style>
  /* CSS */
</style>
