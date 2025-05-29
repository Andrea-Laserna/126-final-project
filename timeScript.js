// timer countdown
const timerDisplay = document.querySelector('.timer');
const startBtn = document.querySelector('.start-button');
let pomodoroTimeLeft = 0.5 * 60; // 1 minute
let breakTimeLeft = 0.6 * 60; // 1.5 minutes
let timerInterval = null;
let isPaused = false;
let timeLeft = pomodoroTimeLeft; // track time globally
let currentTimerId = null; // store session id oof current timer
let timerBtns = null;
let taskConfirmed = false;

startBtn.addEventListener("click", () => {
    popupTask();
    popup.style.display = 'block';
    startBtn.style.display = 'none';
});

function popupTask() {
    const existingPopup = document.getElementById('task-popup');

    if (existingPopup && existingPopup.style.display !== 'none') {
        startBtn.style.display = 'none';
        return;
    } else if (existingPopup && existingPopup.style.display === 'none') {
        existingPopup.style.display = 'block';
        startBtn.style.display = 'none';
        return;
    }

    
    const popup = document.createElement('div');
    popup.id = 'task-popup';
    popup.innerHTML = `
        <img src="images/close-square-svgrepo-com.svg" class="exit-task-popup">
        <div class="task-popup-container">
            <div class="task-popup-content">
                <p id="task-question">Which task would you like to work on now?</p>
                <ul class="task-list"></ul>
                <div class="task-btns">
                    <button id="add-task">Add Task</button>
                    <button id="start">Start Timer</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    startBtn.style.display = 'none';

    fetch("get_tasks.php")
        .then(response => response.json())
        .then(tasks => {
            const taskList = popup.querySelector('.task-list');
            taskList.innerHTML = ''; // Clear just in case

            const ongoingTasks = tasks.filter(task=> task.status === "ongoing");
            if (ongoingTasks.length === 0) {
                taskList.innerHTML = "<li>No ongoing tasks found.</li>";
                return;
            }
            ongoingTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task';
                let dueText = "(≖_≖ )";
                if (task.deadline) {
                    const dueDate = new Date(task.deadline);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    dueText = dueDate.toLocaleDateString('en-US', options);
                }

                li.innerHTML = `
                    <strong>${task.title}</strong><br>
                    <small>Due: ${dueText}</small>
                `;
                li.dataset.id = task.t_id; // optional: to track selected task
                taskList.appendChild(li);
            });

            const currentTaskDisplay = document.querySelector('.current-task');

            taskList.querySelectorAll('.task').forEach(task => {
                task.addEventListener('click', () => {
                    currentTaskDisplay.textContent = task.textContent;
                });
            });
        })
        .catch(error => {
            console.error("Error loading tasks in popup:", error);
        });

    popup.querySelector("#add-task").addEventListener("click", () => {
        const popupContent = popup.querySelector(".task-popup-content");

        if (popupContent.querySelector('#new-task-form')) return;
        
        const form = document.createElement("form");
        document.getElementById('task-question').style.display = 'none';
        form.id = "new-task-form";
        form.innerHTML = `
            <div class="form-container">
                <input type="text" name="title" placeholder="Task title" required />
                <input type="date" name="deadline" />
                <button type="submit">Save</button>
                <img src="images/close-square-svgrepo-com.svg" class="exit-task-popup">
            </div>
        `;

        popupContent.appendChild(form);

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const task = {
                title: formData.get("title"),
                deadline: formData.get("deadline"),
                status: "ongoing" // send required status field
            };

            fetch("add_task.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert("Task added!");
                    form.remove(); // or popup.remove();
                    popup.remove(); // Close and re-open to refresh task list
                    popupTask();
                } else {
                    alert("Failed to add task: " + result.message);
                }
            })
            .catch(error => {
                console.error("Error adding task:", error);
            });
        });
        form.querySelector('.exit-task-popup').addEventListener('click', () => {
            document.getElementById('task-question').style.display = 'inline-block';
            form.remove();
        });
    });


    popup.querySelector("#start").addEventListener("click", () => {
        taskConfirmed = true;
        fetch("start_timer.php", {
            method: "POST", // send post request to start_timer.php
            headers: {
                "Content-Type": "application/json" // data im sending is in json format
            },
            body: JSON.stringify({
                session_type: "Pomodoro" // send this json body data to php
            })
        })
        .then(response => response.json()) // convert server reply from json text back to usable js obj
        .then(data => {
            console.log("Response from server: ", data)
            if(data.time_id) {
                currentTimerId = data.time_id; // time_id auto-generated from start_timer.php
                console.log("Timer started with ID: ", currentTimerId);
                startTimer();
            } else {
                console.error("Timer start failed: ", data.error);
            }
        })
        .catch(error => {
            console.error("Fetch error: ", error);
        });
    });
    updateDisplay(pomodoroTimeLeft);

    document.querySelector('.exit-task-popup').addEventListener('click', () => {
        popup.remove();
        if (timerInterval == null) {
            startBtn.style.display = 'inline-block';
        }
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
    timerBtns = document.createElement('div');
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
                    <button id="reset">Reset</button>
                </div>
            </div>
        `;
        document.body.appendChild(stopPopup);

        stopPopup.querySelector('#reset').addEventListener('click', () => {
            alert("Your progress will be recorded!");
            stopTimer();
            startBtn.style.display = 'inline-block';
        });

        document.querySelector('.exit-stop-popup').addEventListener('click', () => {
            stopPopup.remove();
        });
    });

    // start timer initially
    startCountdown(timerBtns);
    taskConfirmed = false;
}

function stopTimer() {
    fetch("stop_timer.php", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            time_id: currentTimerId
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            console.log("Timer stopped successfully.")
            resetPomodoroTimer();
            // timerBtns.parentNode.replaceChild(startBtn, timerBtns);
            if (timerBtns) {
                timerBtns.remove();
                timerBtns = null;
            }
            const stopPopup = document.getElementById('stop-popup');
            if (stopPopup) stopPopup.remove();
        } else {
            console.error("Failed to stop timer: ", data.error);
        }
    })
    .catch(error => {
        console.error("Fetch error: ", error);
    });
    taskConfirmed = false;
}

function stopBreakTimer() {
    return fetch("stop_timer.php", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            time_id:currentTimerId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Timer stopped successfully.")
            resetBreakTimer();
            if (timerBtns) {
                timerBtns.remove();
                timerBtns = null;
            }
            const stopPopup = document.getElementById('stop-popup');
            if (stopPopup) stopPopup.remove();
        } else {
            console.error("Failed to stop timer: ", data.error);
        }
    })
    .catch(error=>{
        console.error("Fetch error: ", error);
    });
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

            stopTimer();

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

        stopBreakTimer().then(()=>{
            breakStartBtns.remove();
            resetPomodoroTimer();

            // Show start button again
            startBtn.style.display = 'inline-block';
        });
    });

    breakStartBtns.querySelector('#break-start').addEventListener('click', () => {
        fetch ("start_timer.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_type: "Break"
            })
        })
        .then(response=>response.json())
        .then(data => {
            console.log("Response from server: ", data)
            if(data.time_id) {
                currentTimerId = data.time_id;
                console.log("Timer started with ID: ", currentTimerId);
                startBreakTimer();
            } else {
                console.error("Timer start failed: ", data.error);
            }
        })
        .catch(error => {
            console.error("Fetch error: ", error);
        });
    });
}

function startBreakTimer() {
    const breakStartBtn = document.getElementById('break-start');

    if(!breakStartBtn) return;

    breakStartBtn.style.display = 'none';

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            const taskPopup = document.getElementById('task-popup');
            if (taskPopup) {
                taskPopup.style.display = 'none';
            }
            timeLeft--;
            updateDisplay(timeLeft);
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            updateDisplay(0);
            stopBreakTimer();
            // replace break start button with restartk
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
