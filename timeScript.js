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
    updateDisplay();

    // // Remove popup on click outside
    // popup.addEventListener('click', (e) => {
    //     if (popup && e.target === popup) {
    //         popup.remove();
    //     }
    // });

    document.querySelector('.exit-task-popup').addEventListener('click', () => {
        popup.remove();
    });

}

// timer countdown
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

    function pauseTimer() {
        // clicking pauses timer
        if (!isPaused) {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            pauseBtn.textContent = 'Resume';
        // clicking resumes timer
        } else {
            startCountdown();
            isPaused = false;
            pauseBtn.textContent = 'Pause';
        }
    }
    
    // start the countdown
    startCountdown();

    // pause/resume Logic
    pauseBtn.addEventListener('click', pauseTimer);
   
    // Stop Logic
    stopBtn.addEventListener('click', () => {
        // pause first

        // record reset popup
        const stopPopup = document.createElement('div');
        stopPopup.id = 'stop-popup';
        stopPopup.innerHTML = `
            <div class="stop-popup-content">
                <h1>Ayaw mo na?<br>Kala mo maraming nagawa eh.</h1>
                <div class="stop-buttons">
                    <button id="record">Record</button>
                    <button id="reset">Reset</button>
                </div>
            </div>
        `
        document.body.appendChild(stopPopup);

        // record time logic


        // reset logic
        stopPopup.querySelector('#reset').addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = false;
            timeLeft = 25 * 60; // reset to original
            updateDisplay();
        });

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
    `
    document.body.appendChild(spotifyBox);

    // exit spotify popup
    document.querySelector('.exit-spotify-popup').addEventListener('click', () => {
        spotifyBox.remove();
    });
}