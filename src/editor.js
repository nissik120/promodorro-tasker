const Store = require('electron-store');
const { ipcRenderer } = require('electron/renderer');

const store = Store();

let addForm = document.getElementById("add-form");
addForm.addEventListener('submit', submitAddForm);

function submitAddForm(e){
    e.preventDefault();
    const itemTitle = document.querySelector('#itemTitle').value;
    const itemGroup = document.querySelector('#itemGroup').value;
    const itemIndex = document.querySelector('#itemIndex').value;

    const myItem = {title: itemTitle, group: itemGroup};

    window.electronAPI.setItem(myItem);

    //store.set('item', myItem);



    //console.log(taskItem)
}