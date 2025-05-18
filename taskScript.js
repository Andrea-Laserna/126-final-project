document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-task");
  const form = document.getElementById("taskForm");
  const closeBtn = document.getElementById("closePopUp");
  const saveBtn = document.getElementById("saveTask");
  const taskNameInput = document.getElementById("taskName");
  const dueDateInput = document.getElementById("dueDate");
  const nameError = document.getElementById("nameError");
  let currentColumn = null;
  let editingTask = null;

  addButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentColumn = button.parentElement;
      form.style.display = "flex";
      taskNameInput.value = "";
      dueDateInput.value = "";
      editingTask = null;
      saveBtn.textContent = "Add Task"; //INITIAL BUTTON LABEL
    });
  });

  closeBtn.addEventListener("click", () => {
    form.style.display = "none";
    taskNameInput.value = "";
    dueDateInput.value = "";
  });

  // save task
  saveBtn.addEventListener("click", () => {
    const name = taskNameInput.value.trim();
    const dueRaw = dueDateInput.value;

    if (name) {
      nameError.textContent = "";
      let dueText = "";
      if (dueRaw) {
        const dueDate = new Date(dueRaw);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dueText = dueDate.toLocaleDateString('en-US', options);
      } else {
        dueText = "(≖_≖ )";
      }

      if (editingTask) {
        // UPDATE
        editingTask.querySelector("strong").innerText = name;
        editingTask.querySelector("small").innerText = "Due: " + dueText;
        editingTask = null;
      } else {
        // CREATE
        const newTask = document.createElement("div");
        newTask.className = "task-card";
        newTask.innerHTML = `
          <div class="task-content">
            <strong>${name}</strong><br>
            <small>Due: ${dueText}</small>
          </div>
          <div class="task-options">
            <button class="options-btn">⋮</button>
            <ul class="options-menu">
              <li class="edit-task">Edit</li>
              <li class="delete-task">Delete</li>
              <li class="move-task">
                Change Status
                <ul class="status-menu">
                  <li data-status="pending">Pending</li>
                  <li data-status="ongoing">Ongoing</li>
                  <li data-status="done">Done</li>
                </ul>
              </li>
            </ul>
          </div>
        `;
        currentColumn.insertBefore(newTask, currentColumn.querySelector(".add-task"));
      }

      form.style.display = "none";
      saveBtn.textContent = "Add Task";
      taskNameInput.value = "";
      dueDateInput.value = "";
    } else {
      nameError.textContent = "Ba't walang task name?!";
      nameError.style.color = "red";
    }
  });

  document.addEventListener("click", (e) => {
    // toggle 3-dot menu
    if (e.target.classList.contains("options-btn")) {
      const menu = e.target.nextElementSibling;
      document.querySelectorAll(".options-menu").forEach(m => {
        if (m !== menu) m.style.display = "none";
      });
      menu.style.display = menu.style.display === "block" ? "none" : "block";
      return;
    }

    // hide menus when clicking elsewhere
    document.querySelectorAll(".options-menu").forEach(m => m.style.display = "none");

    // delete task
    if (e.target.classList.contains("delete-task")) {
      const task = e.target.closest(".task-card");
      task.remove();
    }

    // edit task
    if (e.target.classList.contains("edit-task")) {
      const task = e.target.closest(".task-card");
      const name = task.querySelector("strong").innerText;
      const due = task.querySelector("small").innerText.replace("Due: ", "");

      taskNameInput.value = name;
      dueDateInput.value = due;
      form.style.display = "flex";
      currentColumn = task.parentElement;
      editingTask = task; //TASK IS BEING EDITED
      saveBtn.textContent = "Edit Task"; //CHANGES LABEL IF EDITING
    }

    // move task (from dropdown)
    if (e.target.closest(".status-menu li")) {
      const status = e.target.getAttribute("data-status");
      const task = e.target.closest(".task-card");
      const destination = document.querySelector(`.${status} .list-container`);

      if (destination) {
        destination.insertBefore(task, destination.querySelector(".add-task"));
      }
    }
  });
});
