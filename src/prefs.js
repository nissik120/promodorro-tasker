let optionsForm = document.getElementById('options-form');
optionsForm.addEventListener('submit', submitOptionsForm);

function submitOptionsForm(e){
    e.preventDefault();

    const username = document.getElementById('name-option-text').value;
    const resetTime = setTime();
    const sessionTime = document.getElementById('session-mins-text').value;
    const pauseTime = document.getElementById('pause-mins-text').value;

    window.taskerAPI.setUsername(username);
    window.taskerAPI.setResetTime(resetTime);
    window.taskerAPI.setSessionDuration(sessionTime);
    window.taskerAPI.setPauseDuration(pauseTime);

}

function setTime(){
    const date = new Date();
    const hours = document.getElementById('hours').value;
    const mins = document.getElementById('mins').value;
    const dayTime = document.getElementById('day-time').value;

    date.setHours(hours);
    date.setMinutes(mins);
    date.setSeconds("00");

    return date;
}
