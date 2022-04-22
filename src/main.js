const { app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const Store = require('electron-store');

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);

const store = new Store();

const isMac = process.platform === 'darwin';
let mainWindow;
let prefsWindow;
var itemList;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createMainWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

function createPreferenceWindow(){
  prefsWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }    
  });

  // and load the index.html of the app.
  prefsWindow.loadFile(path.join(__dirname, 'prefs.html'));

  prefsWindow.on('close', function(){
    prefsWindow = null;
  });

}

function createEditWindow(){
  editWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }    
  });

  // and load the index.html of the app.
  editWindow.loadFile(path.join(__dirname, 'editor.html'));

  editWindow.on('close', function(){
    editWindow = null;
  });

}

//Create menu template
const mainMenuTemplate =[
  {
    label: 'File',
    submenu: [
      {
        label: 'Preferences',
        click(){
          createPreferenceWindow();
        }
      },
      {
        label: 'Edit',
        click(){
          createEditWindow();
        }
      },
      isMac ? {role: 'close'} : {role: 'quit'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
];

if(isMac){
  mainMenuTemplate.unshift({});
}

//add dev tools if not in prod
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: isMac?'Command+I':'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {role: 'reload'}
    ]
  });
}

app.whenReady().then(()=>{

  createMainWindow();

  ipcMain.on('set-item', function (e, item){
    mainWindow.webContents.send('get-item', item);
    this.editWindow.close();
  });

  getSetData('set-name', 'get-name');
  getSetData('set-reset', 'get-reset');
  getSetData('set-session', 'get-session');
  getSetData('set-pause', 'get-pause');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function getSetData(tagSet, tagGet){
  ipcMain.on(tagSet, function (e, item){
    //const webContents = e.sender;
    //const win = BrowserWindow.fromWebContents(webContents);
    //win.setItem(item);
    mainWindow.webContents.send(tagGet, item);
  });
}

function getStoreData(tagGet, item){
  ipcMain.handle(tagSet, function (e, item){
      return item ? store.get(item): ""
  });
}
