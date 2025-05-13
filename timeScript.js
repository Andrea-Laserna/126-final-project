// Referencing DOM Elements
document.getElementById("start-timer").addEventListener("click", popupTask);

// pop up the task list after clicking start
function popupTask() {
    // check if popup exists already
    if (document.getElementById('task-popup')) return;

    // create popup overlay
    const popup = document.createElement('div');
    popup.id = 'task-popup';
    popup.innerHTML = `
        <div id="task-popup-content">
            <p>Which task would you like to work on now</p>
            <div class="task-list"></div>
            <div class="task-btns">
                <button id="add-task">Add Task</button>
                <button id="start">Start</button>
            </div>
            
        </div>
    `;
    
    // popup styles
    Object.assign(popup.style, {
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '5rem',
        right: '1.5rem',
        width: '25vw',
        height: '80vh',
        zIndex: '1000',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50px',
    });

    // add to body
    document.body.appendChild(popup);

    // inner content styles
    const popupContent = popup.querySelector('#task-popup-content');
    const taskBtns = popup.querySelectorAll('.task-btns button');
    const addTaskBtn = popup.querySelector('#add-task');
    const startBtn = popup.querySelector('#start');

    Object.assign(popupContent.style, {
        padding: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    });

    taskBtns.forEach(btn => {
        Object.assign(btn.style, {
            backgroundColor: '#8c52ff',
            borderRadius: '20px',
            color: 'white',
            width: '8rem',
            height: '3rem',
            border: 'none',
        });
    });

    // // remove popup
    // popup.addEventListener('click', (e) => {
    //     const popup = document.getElementById('task-popup');
    //     const popupContent = document.getElementById('task-popup-content');

    //     if (popup && !popupContent.contains(e.target)) {
    //         popup.remove();
    //     }
    // });
}