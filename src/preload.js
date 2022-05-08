const {contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('taskerAPI',{
    setItem: (item)=>ipcRenderer.send('set-item', item),
    setUserValues: (userValues)=>ipcRenderer.send('set-user-values', userValues)
});

const WINDOWS_API = {
    GetListItem: (item)=>ipcRenderer.invoke('get/taskItem'),
    GetList: ()=>ipcRenderer.invoke('get/taskList'),
    GetUserValues: () => ipcRenderer.invoke('get/userValues'),
    ReloadView: ()=>ipcRenderer.invoke('reload/window')
};

contextBridge.exposeInMainWorld('windowsAPI', WINDOWS_API);
