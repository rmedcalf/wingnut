import { app, BrowserWindow, Menu, dialog } from 'electron'
import { Transaction } from '../lib/transaction'
import { CSVFile } from '../lib/db';
const path = require('path');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    resizable: true
  })

  mainWindow.maximize();

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  let menu = Menu.buildFromTemplate(getMenuTemplate());
  Menu.setApplicationMenu(menu);
}

function getMenuTemplate() {
  let template = [{
    label: '&File',
    submenu: [
      { label: 'Positions', click: () => { mainWindow.webContents.send('navigate', 'dashboard'); } },
      { label: 'Import File', click: () => { click_importFile(); } },
      { label: 'Continue Import', click: () => { mainWindow.webContents.send('navigate', 'importer'); } },
      { label: 'Toggle Developer Tools', click: (item, focusedWindow) => { focusedWindow.toggleDevTools(); } },
      { label: 'Reload Window', accelerator: 'Ctrl+R', click:(item, f) => { f.reload(); } },
      { label: '&Quit', accelerator: 'Ctrl+W', click: () => { app.quit(); } }
    ]
  }];
  return template;
}

function click_importFile() {
  dialog.showOpenDialog({ title: 'Open CSV', properties: ['openFile'] }, async (filePaths) => {
    if(filePaths && filePaths.length) {
      let filePath = filePaths[0];
      const csvReader = require('csvtojson');
      const data = await csvReader().fromFile(filePath);
      let mapped = data.filter(d => d.Type == 'Trade').map(d => {
        let t = new Transaction();
        t.readFromCsv(d);
        t.fromFile = path.basename(filePath);
        return t;
      });
      let file = new CSVFile(filePath, 'tastyworks', mapped);
      mainWindow.webContents.send('csv-read', file);
    }
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
