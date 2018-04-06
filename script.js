let sessionTime = 25; // Time in minutes per session
let breakTime = 5; // Time in minutes per short break
let longBreakTime = 15; // Time in minutes per long break
let timerMinutes = 25; // Timer's current setting in minutes
let timerSeconds = 0; // Seconds remaining in current countdown
let timer; // equals setTimeout
let pomodoroState = 0; // 0 for session, 1 for short break, 2 for long break
let timerRunning = false; // 'true' for counting down, 'false' for stopped
let completedPomodoros = 0; // How many pomodoros have been completed
let pomoTimeSpent = 0; // Total time spent on task
let totalTimeSpent = 0; // Total time spent on task+breaks
let audio = document.getElementsByTagName('audio')[0];

document.getElementById('breakTime').innerHTML = breakTime;
document.getElementById('sessionTime').innerHTML = sessionTime;
document.getElementById('longBreakTime').innerHTML = longBreakTime;
document.getElementById('timerDisplay').innerHTML = timerMinutes;
document.getElementById('stateDisplay').innerHTML = 'Session<br/>0 pomodoros completed';

document.getElementById('sessionUp').addEventListener('click', () => {
  sessionTime++;  
  document.getElementById('sessionTime').innerHTML = sessionTime;
  if (pomodoroState === 0) {
    timerReset();
  }
});
document.getElementById('sessionDown').addEventListener('click', () => {
  if (sessionTime > 1) {
    sessionTime--;
  }    
  document.getElementById('sessionTime').innerHTML = sessionTime;
  if (pomodoroState === 0) {
    timerReset();
  }
});
document.getElementById('breakUp').addEventListener('click', () => {
  breakTime++;  
  document.getElementById('breakTime').innerHTML = breakTime;
  if (pomodoroState === 1) {
    timerReset();
  }
});
document.getElementById('breakDown').addEventListener('click', () => {
  if (breakTime > 1) {
    breakTime--;  
  }
  document.getElementById('breakTime').innerHTML = breakTime;
  if (pomodoroState === 1) {
    timerReset();
  }
});
document.getElementById('longBreakUp').addEventListener('click', () => {
  longBreakTime++;  
  document.getElementById('longBreakTime').innerHTML = longBreakTime;
  if (pomodoroState === 2) {
    timerReset();
  }
});
document.getElementById('longBreakDown').addEventListener('click', () => {
  if (longBreakTime > 1) {
    longBreakTime--;
  }    
  document.getElementById('longBreakTime').innerHTML = longBreakTime;
  if (pomodoroState === 2) {
    timerReset();
  }
});

document.getElementById('timerBlock').addEventListener('click', () => {
  if (!timerRunning) {
    if (timerMinutes <= 0 && timerSeconds <= 0) {      
    }
    else {
      timerRunning = true;
      secondCountDown();      
    }
  }
  else if (timerRunning) {
    stopCountDown();
  }
  else {
    console.log('Error. How did this happen?');
  }
});

document.getElementById('reset').addEventListener('click', () => {
  timerReset();
  
});

function secondCountDown() {
  document.getElementById('timerDisplay').innerHTML = timerMinutes+':'+setTwoDigits(timerSeconds);
  timerSeconds--;
  if (timerSeconds < 0) {
    timerSeconds = 59;
    timerMinutes--;
  }
  if (timerMinutes < 0) {
    setNextPomodoroState();
  }
  else {
    timer = setTimeout(() => {
      secondCountDown();
    }, 1);
  }  
}

function stopCountDown() {
    clearTimeout(timer);
    timerRunning = false;  
}

function setTwoDigits(num) {
  let newStr = '00'+num;
  return newStr.slice(-2);
}

function setNextPomodoroState() {	
  audio.play();
  if (pomodoroState === 0) {
    completedPomodoros++;
    pomoTimeSpent += sessionTime;
    totalTimeSpent += sessionTime;
    if (completedPomodoros%4 === 0) {
      pomodoroState = 2;
      document.getElementById('stateDisplay').innerHTML = 'Long break<br/>'+completedPomodoros+' pomodoros completed';
    }
    else {
      pomodoroState = 1;
      document.getElementById('stateDisplay').innerHTML = 'Short break<br/>'+completedPomodoros+' pomodoros completed';
    }
  }
  else {
    if (pomodoroState === 1) {
      totalTimeSpent += breakTime;
    }
    else if (pomodoroState === 2) {
      totalTimeSpent += longBreakTime;
    }
    pomodoroState = 0;    
    document.getElementById('stateDisplay').innerHTML = 'Session<br/>'+completedPomodoros+' pomodoros completed';
  }
  pomoTimeSpentHours = Math.floor(pomoTimeSpent/60);
  pomoTimeSpentMins = pomoTimeSpent%60;
  totalTimeSpentHours = Math.floor(totalTimeSpent/60);
  totalTimeSpentMins = totalTimeSpent%60;
  document.getElementById('info').innerHTML = 'You have spent '+pomoTimeSpentHours+' hours and '+pomoTimeSpentMins+' minutes immersed in your task.'
  document.getElementById('info').innerHTML += '<br/>And a total of '+totalTimeSpentHours+' hours and '+totalTimeSpentMins+' minutes using the Pomodoro Technique.'
  timerReset();  
}

function timerReset() {
  if (timerRunning) {
    stopCountDown();
  }
  switch (pomodoroState) {
    case 0:
      timerMinutes = sessionTime;
      break;
    case 1:
      timerMinutes = breakTime;
      break;
    case 2:
      timerMinutes = longBreakTime;
      break;
    default:
      alert('Unknown pomodoro state');
      break;      
  }
  timerSeconds = 0;
  document.getElementById('timerDisplay').innerHTML = timerMinutes;
}