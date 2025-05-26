document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-task");
  const form = document.getElementById("addTaskForm");
  const closeBtn = document.getElementById("closePopUp");
  const saveBtn = document.getElementById("saveTask");
  const taskNameInput = document.getElementById("taskName");
  const dueDateInput = document.getElementById("dueDate");
  const nameError = document.getElementById("nameError");
  let currentColumn = null;
  let editingTask = null;

  function loadTasks() {
    fetch("get_tasks.php")
      .then(response => response.json())
      .then(tasks => {
        tasks.forEach(task => {
          const targetColumn = document.querySelector(`.status.${task.status} .list-container`);
          if (!targetColumn) return;

          const dueDate = task.deadline ? new Date(task.deadline) : null;
          let dueText = "(≖_≖ )";
          if (dueDate) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dueText = dueDate.toLocaleDateString('en-US', options);
          }

          const taskCard = document.createElement("div");
          taskCard.className = "task-card";
          taskCard.dataset.id = task.t_id;  
          taskCard.innerHTML = `
            <div class="task-content">
              <strong>${task.title}</strong><br>
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

          const addButton = targetColumn.querySelector(".add-task");
          targetColumn.insertBefore(taskCard, addButton);
        });
      })
      .catch(error => console.error("Error fetching tasks:", error));
  }
  loadTasks();


  form.addEventListener("submit", (e) => {
    e.preventDefault();  // Prevent normal form submission (page reload)
    saveBtn.click();     // Trigger the save button click handler to handle adding/updating task
  });


  addButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentColumn = button.closest(".status");
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

    const columnClass = currentColumn.classList;
    let status = "pending";
    if (columnClass.contains("ongoing")) status = "ongoing";
    else if (columnClass.contains("done")) status = "done";

    if (editingTask) {
      // UPDATE existing task
      const taskId = editingTask.dataset.id;

      fetch("edit_task.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t_id: taskId,
          title: name,
          deadline: dueRaw
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Edit response:", data);
        if (data.success) {
          window.location.reload(); 
          editingTask.querySelector("strong").innerText = name;
          editingTask.querySelector("small").innerText = "Due: " + dueText;
          console.log("Task updated successfully");
        } else {
          console.error("Update failed:", data.message);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });

      editingTask = null;
    } else {
      // CREATE new task in UI
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

      const targetColumn = document.querySelector(`.status.${status} .list-container`);
      if (targetColumn) {
        const addButton = targetColumn.querySelector(".add-task");
        targetColumn.insertBefore(newTask, addButton);
      }

      // POST to add_task.php only if creating
      fetch("add_task.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: name,
          deadline: dueRaw,
          status: status
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log("Response from server: ", data)
        if(data.t_id){
           newTask.dataset.id = data.t_id;
          console.log("Task started with ID: ", data.t_id);
        } else {
          console.error("Task start failed: ", data.error);
        }
      })
      .catch(error => {
        console.error("Fetch error: ", error);
      });
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
    const taskId = task.dataset.id;  // this gets the task ID from the dataset

    if (!taskId) {
      console.error("Task ID not found!");
      return;
    }

    // Confirm before deletion (optional)
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    // Send DELETE request to PHP
    fetch("delete_task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ t_id: taskId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Remove task from DOM
        task.remove();
        console.log("Task deleted successfully.");
      } else {
        console.error("Error deleting task:", data.error);
        alert("Failed to delete task: " + data.error);
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      alert("An error occurred while deleting the task.");
    });
  }

    // edit task
    if (e.target.classList.contains("edit-task")) {
      const task = e.target.closest(".task-card");
      const name = task.querySelector("strong").innerText;
      let dueText = task.querySelector("small").innerText.replace("Due: ", "");

      taskNameInput.value = name;

      // Convert dueText to YYYY-MM-DD for date input
      if (dueText === "(≖_≖ )" || dueText.trim() === "") {
        dueDateInput.value = ""; // no valid date
      } else {
        const parsedDate = new Date(dueText);
        if (!isNaN(parsedDate)) {
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
          const day = String(parsedDate.getDate()).padStart(2, '0');
          dueDateInput.value = `${year}-${month}-${day}`;
        } else {
          dueDateInput.value = ""; // fallback
        }
      }

      form.style.display = "flex";
      currentColumn = task.closest(".status"); // better get closest status container
      editingTask = task;
      saveBtn.textContent = "Edit Task";
    }


    // move task (from dropdown)
  if (e.target.closest(".status-menu li")) {
    const status = e.target.getAttribute("data-status");
    const task = e.target.closest(".task-card");
    const destination = document.querySelector(`.${status} .list-container`);
    const taskId = task.dataset.id;

    if (destination && taskId) {
      destination.insertBefore(task, destination.querySelector(".add-task"));

      fetch("update_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t_id: taskId,
          status: status // send the new status
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("Task status updated successfully.");
        } else {
          console.error("Failed to update task status:", data.error);
          alert("Failed to update task status: " + data.error);
        }
      })
      .catch(error => {
        console.error("Fetch error while updating status:", error);
        alert("An error occurred while updating the task status.");
      });
    }
  }
  });
});
