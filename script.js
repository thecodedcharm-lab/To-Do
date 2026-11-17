let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(name) {
    tasks.push({
        id: Date.now() + Math.random(),
        name: name,
        completed: false,
        subtasks: []
    });

    saveTasks();
    renderTasks();
}

function updateParent(task) {
    if (task.subtasks.length > 0) {
        task.completed = task.subtasks.every(
            subtask => subtask.completed
        );
    }
}

function createButton(text, callback) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;

    button.addEventListener("click", callback);

    return button;
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {

        updateParent(task);

        const taskDiv = document.createElement("div");
        taskDiv.className = "task";

        if (task.completed) {
            taskDiv.classList.add("completed");
        }

        const row = document.createElement("div");
        row.className = "task-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;

            task.subtasks.forEach(subtask => {
                subtask.completed = task.completed;
            });

            saveTasks();
            renderTasks();
        });

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.name;



        const addSubtask = createButton("+ Subtask", () => {
            const value = prompt("Enter subtask:");

            if (value && value.trim()) {
                task.subtasks.push({
                    id: Date.now() + Math.random(),
                    name: value.trim(),
                    completed: false
                });

                task.completed = false;

                saveTasks();
                renderTasks();
            }
        });



        const edit = createButton("Edit", () => {
            const value = prompt("Edit task:", task.name);

            if (value && value.trim()) {
                task.name = value.trim();

                saveTasks();
                renderTasks();
            }
        });



        const remove = createButton("Delete", () => {
            if (confirm("Delete this task?")) {
                tasks = tasks.filter(
                    item => item.id !== task.id
                );

                saveTasks();
                renderTasks();
            }
        });

        const actions = document.createElement("div");
        actions.className = "task-actions";

        actions.append(addSubtask, edit, remove);

        row.append(checkbox, name, actions);
        taskDiv.append(row);


        if (task.subtasks.length > 0) {

            const subtaskContainer = document.createElement("div");
            subtaskContainer.className = "subtasks";

            task.subtasks.forEach(subtask => {

                const subtaskDiv = document.createElement("div");
                subtaskDiv.className = "subtask";

                if (subtask.completed) {
                    subtaskDiv.classList.add("completed");
                }

                const subCheckbox = document.createElement("input");
                subCheckbox.type = "checkbox";
                subCheckbox.checked = subtask.completed;

                subCheckbox.addEventListener("change", () => {
                    subtask.completed = subCheckbox.checked;

                    updateParent(task);

                    saveTasks();
                    renderTasks();
                });

                const subName = document.createElement("span");
                subName.textContent = subtask.name;

          

                const subEdit = createButton("Edit", () => {
                    const value = prompt(
                        "Edit subtask:",
                        subtask.name
                    );

                    if (value && value.trim()) {
                        subtask.name = value.trim();

                        saveTasks();
                        renderTasks();
                    }
                });

                

                const subDelete = createButton("×", () => {
                    task.subtasks = task.subtasks.filter(
                        item => item.id !== subtask.id
                    );

                    updateParent(task);

                    saveTasks();
                    renderTasks();
                });

                subtaskDiv.append(
                    subCheckbox,
                    subName,
                    subEdit,
                    subDelete
                );

                subtaskContainer.append(subtaskDiv);
            });

            taskDiv.append(subtaskContainer);
        }

        taskList.append(taskDiv);
    });

    updateProgress();

    document.getElementById("emptyMessage").style.display =
        tasks.length === 0 ? "block" : "none";

    document.getElementById("taskCount").textContent =
        `${tasks.length} tasks`;

    saveTasks();
}



function updateProgress() {
    let total = 0;
    let completed = 0;

    tasks.forEach(task => {
        total++;

        if (task.completed) {
            completed++;
        }

        task.subtasks.forEach(subtask => {
            total++;

            if (subtask.completed) {
                completed++;
            }
        });
    });

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressBar").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "%";
}



taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (!name) return;

    addTask(name);

    taskForm.reset();
    taskInput.focus();
});



renderTasks();
