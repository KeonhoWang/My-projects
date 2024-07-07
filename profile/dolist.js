document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskDate = document.getElementById("task-date");
  const taskList = document.getElementById("task-list");
  const calendarDays = document.querySelector(".days");
  const monthName = document.querySelector(".month-name");
  const prevMonthBtn = document.querySelector(".prev");
  const nextMonthBtn = document.querySelector(".next");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentDate = new Date();

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function generateCalendar(year, month) {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const prevLastDate = new Date(year, month - 1, 0).getDate();

    calendarDays.innerHTML = "";

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    monthName.textContent = `${monthNames[month - 1]} ${year}`;

    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = document.createElement("div");
      day.className = "day prev-month";
      day.textContent = prevLastDate - i;
      calendarDays.appendChild(day);
    }

    // Current month's days
    for (let i = 1; i <= lastDate; i++) {
      const day = document.createElement("div");
      day.className = "day current-month";
      day.textContent = i;

      const dayString = new Date(year, month - 1, i)
        .toISOString()
        .split("T")[0];
      if (tasks.some((task) => task.date === dayString)) {
        const taskIndicator = document.createElement("div");
        taskIndicator.className = "task-indicator";
        const hasUnfinishedTask = tasks.some(
          (task) => task.date === dayString && !task.completed
        );
        taskIndicator.classList.add(
          hasUnfinishedTask ? "unfinished" : "finished"
        );
        day.appendChild(taskIndicator);
      }

      calendarDays.appendChild(day);
    }

    // Next month's days
    const nextDaysCount = 42 - calendarDays.children.length;
    for (let i = 1; i <= nextDaysCount; i++) {
      const day = document.createElement("div");
      day.className = "day next-month";
      day.textContent = i;
      calendarDays.appendChild(day);
    }

    highlightSelectedDate(taskDate.value);
  }

  function highlightSelectedDate(dateString) {
    document.querySelectorAll(".day").forEach((day) => {
      day.classList.remove("selected");
      const dayNumber = parseInt(day.textContent);
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dayNumber
      );
      if (
        day.classList.contains("current-month") &&
        date.toISOString().split("T")[0] === dateString
      ) {
        day.classList.add("selected");
      }
    });
  }

  function updateTaskIndicators() {
    const dayElements = document.querySelectorAll(".current-month");
    dayElements.forEach((day) => {
      const dayNumber = parseInt(day.textContent);
      const dayString = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dayNumber
      )
        .toISOString()
        .split("T")[0];
      let indicator = day.querySelector(".task-indicator");
      if (indicator) day.removeChild(indicator);
      if (tasks.some((task) => task.date === dayString)) {
        const taskIndicator = document.createElement("div");
        taskIndicator.className = "task-indicator";
        const hasUnfinishedTask = tasks.some(
          (task) => task.date === dayString && !task.completed
        );
        taskIndicator.classList.add(
          hasUnfinishedTask ? "unfinished" : "finished"
        );
        day.appendChild(taskIndicator);
      }
    });
  }

  function loadTasksForDate(date) {
    taskList.innerHTML = "";
    const dateString = date.toISOString().split("T")[0];
    const filteredTasks = tasks.filter((task) => task.date === dateString);
    filteredTasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.className = "task";
      if (task.completed) taskItem.classList.add("completed");
      taskItem.innerHTML = `
              <span>${task.text}</span>
              <div class="actions">
                  <button class="complete">✔️</button>
                  <button class="edit">✏️</button>
                  <button class="delete">❌</button>
              </div>
          `;
      taskList.appendChild(taskItem);
    });
  }

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
    updateTaskIndicators();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
    updateTaskIndicators();
  });

  calendarDays.addEventListener("click", (e) => {
    if (e.target.classList.contains("current-month")) {
      const selectedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        parseInt(e.target.textContent)
      );
      taskDate.value = selectedDate.toISOString().split("T")[0];
      loadTasksForDate(selectedDate);
      highlightSelectedDate(taskDate.value);
    }
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = taskDate.value;
    const text = taskInput.value.trim();
    if (text && date) {
      tasks.push({ date, text, completed: false });
      taskInput.value = "";
      saveTasks();
      loadTasksForDate(new Date(date));
      updateTaskIndicators();
    }
  });

  taskList.addEventListener("click", (e) => {
    const date = taskDate.value;
    if (e.target.classList.contains("delete")) {
      const taskElement = e.target.parentElement.parentElement;
      const taskText = taskElement.querySelector("span").textContent;
      tasks = tasks.filter(
        (task) => !(task.text === taskText && task.date === date)
      );
      saveTasks();
      loadTasksForDate(new Date(date));
      updateTaskIndicators();
    }
    if (e.target.classList.contains("edit")) {
      const taskElement = e.target.parentElement.parentElement;
      const taskText = taskElement.querySelector("span").textContent;
      const newTask = prompt("Edit Task", taskText);
      if (newTask) {
        tasks = tasks.map((task) => {
          if (task.text === taskText && task.date === date) {
            task.text = newTask;
          }
          return task;
        });
        saveTasks();
        loadTasksForDate(new Date(date));
        updateTaskIndicators();
      }
    }
    if (e.target.classList.contains("complete")) {
      const taskElement = e.target.parentElement.parentElement;
      const taskText = taskElement.querySelector("span").textContent;
      tasks = tasks.map((task) => {
        if (task.text === taskText && task.date === date) {
          task.completed = !task.completed;
        }
        return task;
      });
      saveTasks();
      loadTasksForDate(new Date(date));
      updateTaskIndicators();
    }
  });

  generateCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  updateTaskIndicators();
  loadTasksForDate(currentDate);
  highlightSelectedDate(taskDate.value);
});
