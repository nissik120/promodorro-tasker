const { app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const Store = require('../db/store.js');

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);

const store = new Store({
  configName: 'user-preferences',
  defaults:{
    userValues:{
      name: 'Tasker User',
      resetTime: getDatePlusAdd(1),
      startTime: Date.now(),
      sessionDuration: 25,
      pauseDuration: 5,
    },
  }
});

const db = new Store({
  configName: 'user-tasklist',
  defaults:{
    tasklist: [],
  }
});

const isMac = process.platform === 'darwin';
let mainWindow;

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createMainWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    icon: 'src/tasker-view.ico',
    resizable: false,
    autoHideMenuBar:true,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  var splashWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    alwaysOnTop: true
  });
  
  splashWindow.loadFile(path.join(__dirname, 'loading.html'))
  splashWindow.center();
  setTimeout(function(){
    splashWindow.close();
    mainWindow.center();
    mainWindow.show();
  }, 5000);
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

function getDatePlusAdd(days){
  var result = new Date();
  return result.setDate( result.getDate() + days);
}

app.whenReady().then(()=>{

  let currentTasklist = db.get('tasklist');
  let currentUserValues = store.get('userValues');

  //console.log(db.path);

  createMainWindow();

  ipcMain.on('set-user-values', function (e, newUserValues){
    store.set('userValues', newUserValues);
  });

  ipcMain.on('set-item', function (e, item){
    let newList = [...currentTasklist, item];
    db.set('tasklist', newList);
  });

  ipcMain.handle('get/taskItem', async (item)=>{
    let newList = [...currentTasklist, item];
    db.set('tasklist', newList);
    console.log('Hey');
    return true;
  });

  ipcMain.handle('get/taskList', async ()=>{
    let tasklist = currentTasklist;
    return tasklist;
  });

  ipcMain.handle('get/userValues', async ()=>{
    let userValues = currentUserValues;
    return userValues;
  });

  ipcMain.handle('reload/window', async ()=>{
    BrowserWindow.getFocusedWindow().reload();
  });

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