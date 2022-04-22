const { ipcRenderer } = require('electron/renderer');

const headerView = document.querySelector('.header');
const tasklistView = document.querySelector('.tasklist-view');
let itemList = [];

window.onload = ()=>{

  

  window.taskerAPI.getUsername((e, name)=>{

    console.log(name);

    let headerHtml = `<h1>Hi ${name}</h1>
    <p>Almost done for the day. Just one final push.</p>`;
  
    headerView.innerHTML = headerHtml;
  
  });
  
  if(itemList.length==0){
    tasklistView.innerHTML = `
    <div class="empty-state">
      <p>Nothing To See Here!!</p>
      <p>Add some tasks</p>
    </div>`;
  }
  
  window.electronAPI.getItem((e, item)=>{
    let itemHtml = "";
    itemList = [...itemList, item];
    console.log(itemList);
    itemList.forEach(item => {
      itemHtml +=`<div class="vert"></div>
        <div class="task-item">
          <p>9:00 am</p>
          <div class="task-item-details">
            <h2>${item['title']}</h2>
            <p>${item['group']}</p>
          </div>
          <p>9:30 am</p>
        </div>
        <div class="vert"></div>
        `;
    });
    tasklistView.innerHTML = itemHtml;
    console.log(tasklistView);
  });

}



