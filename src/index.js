/*

  DEFINITIONS SECTIONS

*/
const headerView = document.querySelector('.header');
const progressView = document.querySelector('.progress');
const tasklistView = document.querySelector('.tasklist-view');
const tasklistTimerView = document.querySelector('.tasklist-timer-view');
const tasklistItems = document.querySelectorAll('.task-item');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const startResetBtn = document.getElementById('btn-start-reset');
let pageNum = 1;
let pageViews = 2;
let maxPages = 1;

/*

  HTML TEMPLATES

*/

const headerHtml = name => `
  <h1>Hi,	
  &#128075; <br> ${name}</h1>
`;

const emptyListHtml =  `
  <div class="empty-state">
    <p>Nothing To See Here!!</p>
    <p>Add some tasks</p>
  </div>
`;

const statusMessages = {
  lvl0: "There is always something to be done. Add tasks",
  lvl1: "Looks like another busy day",
  lvl2: "Easy does it. Keep on it.",
  lvl3: "Great progress so far, keep on working",
  lvl4: "Almost done for the day. Just one final push.",
  lvl5: "Nicely done. Take a break." 
}

const progressFormatter = (percTaskDone) =>{

  let progressMessage;

  if (percTaskDone==100){
    progressMessage = statusMessages.lvl5;
  }else if(percTaskDone>=75 && percTaskDone<100){
    progressMessage = statusMessages.lvl4;
  }else if(percTaskDone>=55 && percTaskDone<75){
    progressMessage = statusMessages.lvl3;
  }else if(percTaskDone>=5 && percTaskDone<55){
    progressMessage = statusMessages.lvl2;
  }else if(percTaskDone>=1 && percTaskDone<5){
    progressMessage = statusMessages.lvl1;
  }else{
    progressMessage = statusMessages.lvl0;
  }

  return `<p>${progressMessage}</p>`;;

}

const progressStatusHtml = (nTaskDone, nTaskTotal, percTaskDone) => `
  ${progressFormatter(percTaskDone)}
  <h1>Daily Progress</h1>
  <div class="pg-bar-wrap padding-even">
    <div class="pg-bar" style="width: ${percTaskDone}%;"></div>
  </div>
  <p>${nTaskDone} of ${nTaskTotal} Tasks completed -> ${percTaskDone}&percnt;</p>
`;

const timerStatusHtml = (listStartTime, cleanupTime)=>`
  <h2>&#9201; <span>${new Date(listStartTime).toLocaleTimeString()}</span> <button id="btn-start-reset">Reset</button></h2>
  <h2>&#128686; <span>${new Date(cleanupTime).toLocaleString()}</span></h2>
`;

const tastListItemHtml = (title, group, status, startVal, stopVal) => `
  <div class="vert"></div>
  <div class="task-item" style="color:${status===0?"black":"gray"}">
    <p>${startVal}</p>
    <div class="task-item-details">
      <h2>${title}</h2>
      <p>${group}</p>
    </div>
    <p>${stopVal}</p>
  </div>
  <div class="vert"></div>
`;


/*

  FUNCTIONS SECTIONS

*/

function createPageView(userObject, listObject, pageNumber, itemsPerPage){

  let itemList = listObject;
  let {name, resetTime, startTime, sessionDuration, pauseDuration} = userObject;
  let nTaskDone;
  let nTaskTotal;
  let taskDonePercentage;

  if(itemList.length==0){
    nTaskDone = 0;
    nTaskTotal = 0;
    taskDonePercentage = Math.trunc(100*nTaskDone/nTaskTotal);
    progressView.innerHTML == progressStatusHtml(nTaskDone, nTaskTotal, taskDonePercentage);
    tasklistView.innerHTML = emptyListHtml;
  }

  let taskLeftArr = (itemList).filter(item=>item.status===0);
  nTaskTotal = itemList.length;
  nTaskDone = nTaskTotal - taskLeftArr.length;
  
  taskDonePercentage = Math.trunc(100*nTaskDone/nTaskTotal);

  headerView.innerHTML = headerHtml(name);
  progressView.innerHTML = progressStatusHtml(nTaskDone, nTaskTotal, taskDonePercentage);
  tasklistTimerView.innerHTML = timerStatusHtml(startTime, resetTime);
  pageMaker(taskLeftArr, pageNumber, itemsPerPage, startTime, sessionDuration, pauseDuration);

}

function pageMaker(list, pageNum, itemPerPage, startTime, sessionDuration, pauseDuration){
  let itemHtml = "";
  let itemCount = list.length;
  let pageCount = Math.ceil(itemCount/itemPerPage);
  let sessionValue = sessionDuration*60*1000;
  let pauseValue = pauseDuration*60*1000;
  //let taskLeftArr = (list).filter(item=>item.status===0);

  

  if (pageNum>=1 && pageNum<=pageCount && itemCount!==0){
    let lwLim = (pageNum-1)*itemPerPage;
    let upLim = lwLim + (itemPerPage-1);
    let indxArr = Array.from({length: itemPerPage}, (_, i) => lwLim +i);
    for (let indx of indxArr){
      if(indx<itemCount){
        let item = list[indx];
        let startValue = indx<=0?(startTime + (sessionValue*indx)) : ((startTime + (pauseValue*indx) + (sessionValue*indx)));
        let endValue = startValue + sessionValue;
    
        let startDate = new Date(startValue).toLocaleString();
        let endDate = new Date(endValue).toLocaleString();
        itemHtml += tastListItemHtml(item['title'], item['group'], item['status'], startDate, endDate);
      }

    }
    tasklistView.innerHTML = itemHtml;
  }

}

async function initializeView(){
  const userAsync = window.windowsAPI.GetUserValues();
  const listAsync = window.windowsAPI.GetList();

  const [userReturn, listReturn] = await Promise.all([userAsync, listAsync]);
  let taskLeftArr = (listReturn).filter(item=>item.status===0);
  let itemCount = taskLeftArr.length;
  maxPages = Math.ceil(itemCount/pageViews);
  createPageView(userReturn, listReturn, pageNum, pageViews);
  document.getElementById('home-btn').click();
}

function clearListCheck(){
  //if start view > rest time call to clear list
}

function openTabView(evt, tabId){
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("main");

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabId).style.display = "block";
  evt.currentTarget.className += "active";

}

function resetStartTimeFunc(){
  window.windowsAPI.GetUserValues().then((userValues)=>{
    userValues['startTime'] = Date.now();
    let updateUserValues= {
      name: userValues['name'],
      resetTime: userValues['resetTime'],
      startTime: userValues['startTime'],
      sessionDuration: userValues['sessionDuration'],
      pauseDuration: userValues['pauseDuration'],
    };
    window.taskerAPI.setUserValues(updateUserValues);
  });
}

function submitAddForm(){
  const itemTitle = document.querySelector('#itemTitle').value;
  const itemGroup = document.querySelector('#itemGroup').value;
  const itemId = Date.now();

  const myItem = {title: itemTitle, group: itemGroup, id: itemId, status: 0};

  window.taskerAPI.setItem(myItem);
}

function submitOptionsForm(){

  const username = document.getElementById('name-option-text').value;
  const resetTime = setTime();
  const sessionTime = document.getElementById('session-mins-text').value;
  const pauseTime = document.getElementById('pause-mins-text').value;

  const userValuesObj = {
      name: username,
      resetTime: resetTime,
      startTime: Date.now(),
      sessionDuration: sessionTime,
      pauseDuration: pauseTime,
  };

  window.taskerAPI.setUserValues(userValuesObj);

}

function setTime(){
  const date = new Date();
  date.setDate(date.getDate()+1);
  const hours = document.getElementById('hours').value;
  const mins = document.getElementById('mins').value;
  const dayTime = document.getElementById('day-time').value;

  date.setHours(hours);
  date.setMinutes(mins);
  date.setSeconds("00");

  return date;
}

/*

  LISTENERS SECTIONS

*/

prevBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  pageNum = pageNum!=1?pageNum-1:pageNum;
  nextBtn.disabled = false;
  prevBtn.disabled = (pageNum===1)?true:false;
  initializeView();
});

nextBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  pageNum = pageNum!=maxPages?pageNum+1:pageNum;
  nextBtn.disabled = (pageNum===maxPages)?true:false;
  prevBtn.disabled = false;
  initializeView();
});

document.addEventListener('click', function(e){
  if(e.target && e.target.id == "btn-start-reset"){
    e.preventDefault();
    resetStartTimeFunc();
    initializeView();
    window.windowsAPI.ReloadView();
  }
});

document.addEventListener('submit', function(e){
  if(e.target && e.target.id == "add-form"){
    e.preventDefault();
    submitAddForm();
    initializeView();
  }


  if(e.target && e.target.id == "options-form"){
    e.preventDefault();
    submitOptionsForm();
    initializeView();
  }

});


document.addEventListener("DOMContentLoaded", ()=>{
  initializeView();
});