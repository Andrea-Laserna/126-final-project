document.getElementById("start-timer").addEventListener("click", popupTask);

function popupTask() {
    if (document.getElementById('task-popup')) return;

    const popup = document.createElement('div');
    popup.id = 'task-popup';
    popup.innerHTML = `
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
    updateDisplay();

    // Remove popup on click outside
    popup.addEventListener('click', (e) => {
        if (popup && e.target === popup) {
            popup.remove();
        }
    });
}

// timer Countdown
const timerDisplay = document.querySelector('.timer');
const startBtn = document.querySelector('.start-button');
let timeLeft = 25 * 60; // 25 mins in secs
let timerInterval = null;
let isPaused = false;

// time format
function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}

// update timer display
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

// start countdown
function startTimer() {
    // prevent multiple timers
    if (timerInterval) return;

    // hide start button
    startBtn.style.display = 'none';

    // create pause and stop buttons
    const timerBtns = document.createElement('div');
    timerBtns.id = 'timer-btns';
    timerBtns.innerHTML = `
        <div class=timer-btns-container>
            <button id='pause'>Pause</button>
            <button id='stop'>Stop</button>
        </div>
    `
    startBtn.parentNode.replaceChild(timerBtns, startBtn);


    // pause and stop button logic
    const pauseBtn = timerBtns.querySelector('#pause');
    const stopBtn = timerBtns.querySelector('#stop');
    
    // Start the countdown
    startCountdown();

    // Pause/Resume Logic
    pauseBtn.addEventListener('click', () => {
        // click pauses timer
        if (!isPaused) {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            pauseBtn.textContent = 'Resume';
        // click resumes timer
        } else {
            startCountdown();
            isPaused = false;
            pauseBtn.textContent = 'Pause';
        }
    });

    // Stop Logic
    stopBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = false;
        timeLeft = 25 * 60; // reset to original
        updateDisplay();

        // replace pause/stop with original start button
        timerBtns.parentNode.replaceChild(startBtn, timerBtns);
        startBtn.style.display = 'inline-block';
    });
}

function startCountdown() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Time's up!");
        }
    }, 1000);
}
