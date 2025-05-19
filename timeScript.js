// timer countdown
const timerDisplay = document.querySelector('.timer');
const startBtn = document.querySelector('.start-button');
let pomodoroTimeLeft = 0.5 * 60; // 1 minute
let breakTimeLeft = 0.6 * 60; // 1.5 minutes
let timerInterval = null;
let isPaused = false;
let timeLeft = pomodoroTimeLeft; // track time globally

document.getElementById("start-timer").addEventListener("click", popupTask);

function popupTask() {
    if (document.getElementById('task-popup')) return;

    const popup = document.createElement('div');
    popup.id = 'task-popup';
    popup.innerHTML = `
        <img src="images/close-square-svgrepo-com.svg" class="exit-task-popup">
        <div class="task-popup-container">
            <div class="task-popup-content">
                <p>Which task would you like to work on now?</p>
                <ul class="task-list">
                    <li class="task" id="t1">Save Pakistan</li>
                    <li class="task" id="t2">Destroy India</li>
                    <li class="task" id="t3">Grape</li>
                    <li class="task" id="t4">Grape</li>
                    <li class="task" id="t5">Grape</li>
                    <li class="task" id="t6">Grape</li>
                    <li class="task" id="t7">Grape</li>
                </ul>
                <div class="task-btns">
                    <button id="add-task">Add Task</button>
                    <button id="start">Start</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    const currentTaskDisplay = document.querySelector('.current-task');
    const listContent = popup.querySelectorAll('.task');

    listContent.forEach(task => {
        task.addEventListener('click', () => {
            currentTaskDisplay.textContent = task.textContent;
        });
    });

    popup.querySelector("#start").addEventListener("click", startTimer);
    updateDisplay(pomodoroTimeLeft);

    document.querySelector('.exit-task-popup').addEventListener('click', () => {
        popup.remove();
    });
}

// time format
function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}

// update timer display
function updateDisplay(time) {
    timerDisplay.textContent = formatTime(time);
}

// start countdown
function startTimer() {
    if (timerInterval) return;

    // hide start button
    startBtn.style.display = 'none';

    // set timeLeft
    timeLeft = pomodoroTimeLeft;

    // create pause and stop buttons
    const timerBtns = document.createElement('div');
    timerBtns.id = 'timer-btns';
    timerBtns.innerHTML = `
        <div class="timer-btns-container">
            <button id='pause'>Pause</button>
            <button id='stop'>Stop</button>
        </div>
    `;
    // startBtn.parentNode.replaceChild(timerBtns, startBtn);
    startBtn.style.display = 'none';
    startBtn.insertAdjacentElement('afterend', timerBtns);


    const pauseBtn = timerBtns.querySelector('#pause');
    const stopBtn = timerBtns.querySelector('#stop');

    function pauseTimer() {
        if (!isPaused) {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            pauseBtn.textContent = 'Resume';
        } else {
            startCountdown(timerBtns); // resume with current timeLeft
            isPaused = false;
            pauseBtn.textContent = 'Pause';
        }
    }

    pauseBtn.addEventListener('click', pauseTimer);

    stopBtn.addEventListener('click', () => {
        if (document.getElementById('stop-popup')) return;
        const stopPopup = document.createElement('div');
        stopPopup.id = 'stop-popup';
        stopPopup.innerHTML = `
            <img src="images/close-square-svgrepo-com.svg" class="exit-stop-popup"></img>
            <div class="stop-popup-content">
                <h1>Ayaw mo na?<br>Kala mo maraming nagawa eh.</h1>
                <div class="stop-buttons">
                    <button id="record">Record</button>
                    <button id="reset">Reset</button>
                </div>
            </div>
        `;
        document.body.appendChild(stopPopup);

        stopPopup.querySelector('#reset').addEventListener('click', () => {
            resetPomodoroTimer();
            // timerBtns.parentNode.replaceChild(startBtn, timerBtns);
            timerBtns.remove();
            startBtn.style.display = 'inline-block';
            stopPopup.remove();
        });
    });

    // start timer initially
    startCountdown(timerBtns);
}

function resetPomodoroTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    pomodoroTimeLeft = 0.5 * 60;
    timeLeft = pomodoroTimeLeft; // reset timeLeft
    updateDisplay(timeLeft);
}

function resetBreakTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    breakTimeLeft = 0.6 * 60;
    timeLeft = breakTimeLeft;
    updateDisplay(timeLeft);
}

function startCountdown(timerBtns) {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay(timeLeft);
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Time's up!");

            // remove stopPopup if exists
            if (document.getElementById('stop-popup')) {
                document.getElementById('stop-popup').remove();
            }

            const breakBtns = document.createElement('div');
            breakBtns.id = 'break-btns';
            breakBtns.innerHTML = `
                <div class="break-buttons">
                    <button id="restart">Restart</button>
                    <button id="break">Break</button>
                </div>
            `;

            timerBtns.parentNode.replaceChild(breakBtns, timerBtns);

            breakBtns.querySelector('#restart').addEventListener('click', () => {
                resetPomodoroTimer();
                // breakBtns.parentNode.replaceChild(startBtn, breakBtns);
                breakBtns.remove();
                startBtn.style.display = 'inline-block';
            });

            breakBtns.querySelector('#break').addEventListener('click', () => {
                breakCountdown(breakBtns);
            });
        }
    }, 1000);
}

function breakCountdown(breakBtns) {
    const breakStartBtns = document.createElement('div');
    breakStartBtns.id = 'break-start-btns';
    breakStartBtns.innerHTML = `
        <button id="return">Return</button>
        <button id="break-start">Start</button> 
    `;

    document.body.appendChild(breakStartBtns);

    resetBreakTimer();
    breakBtns.parentNode.replaceChild(breakStartBtns, breakBtns);

    breakStartBtns.querySelector('#return').addEventListener('click', () => {
        // Clear break timer
        clearInterval(timerInterval);
        timerInterval = null;

        breakStartBtns.remove();
        resetPomodoroTimer();

        // Show start button again
        breakStartBtns.remove();
        startBtn.style.display = 'inline-block';
    });

    breakStartBtns.querySelector('#break-start').addEventListener('click', startBreakTimer);
}

function startBreakTimer() {
    const breakStartBtn = document.getElementById('break-start');

    if(!breakStartBtn) return;

    breakStartBtn.style.display = 'none';

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay(timeLeft);
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            updateDisplay(0);

            // replace break start button with restart
            const restartBreak = document.createElement('button');
            restartBreak.id = 'restart-break';
            restartBreak.textContent = 'Restart Break';

            breakStartBtn.remove();

            const btnContainer = document.getElementById('break-start-btns');
            btnContainer.appendChild(restartBreak);

            restartBreak.addEventListener('click', () => {
                resetBreakTimer();
                restartBreak.remove();
                btnContainer.appendChild(breakStartBtn);
                breakStartBtn.style.display = 'inline-block';
            });
        }
    }, 1000);
}

document.getElementById('music').addEventListener('click', spotifyPopup);

function spotifyPopup() {
    if (document.getElementById('spotify')) return;

    const spotifyBox = document.createElement('div');
    spotifyBox.id = 'spotify';
    spotifyBox.innerHTML = `
        <img src="images/close-square-svgrepo-com.svg" class="exit-spotify-popup">
        <iframe
            src="https://open.spotify.com/embed/playlist/1iCIhy3fqqSBrTUcIxI804?utm_source=generator"
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            style="border-radius: 12px; margin: 0;">
        </iframe>
    `;
    document.body.appendChild(spotifyBox);

    document.querySelector('.exit-spotify-popup').addEventListener('click', () => {
        spotifyBox.remove();
    });
}
