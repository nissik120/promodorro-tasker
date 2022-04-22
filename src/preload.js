const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setItem: (item)=>ipcRenderer.send('set-item', item),
    getItem: (item)=>ipcRenderer.on('get-item', item)
});

contextBridge.exposeInMainWorld('taskerAPI',{
    setUsername: (username)=>ipcRenderer.send('set-name', username),
    getUsername: (username)=>ipcRenderer.on('get-name', username),
    setResetTime: (resetTime)=>ipcRenderer.send('set-reset',resetTime),
    getResetTime: (resetTime)=>ipcRenderer.on('get-reset', resetTime),
    setSessionDuration: (sessionTime)=>ipcRenderer.send('set-session', sessionTime),
    getSessionDuration: (sessionTime)=>ipcRenderer.on('get-session', sessionTime),
    setPauseDuration: (pauseTime)=>ipcRenderer.send('set-pause', pauseTime),
    getPauseDuration: (pauseTime)=>ipcRenderer.on('get-pause', pauseTime)
});