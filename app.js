document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const prioritySelect = document.getElementById('priority');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    const progressFill = document.getElementById('progress');
    const numbersEl = document.getElementById('numbers');
    const totalEl = document.getElementById('total');

    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.querySelector('.clear-completed');
    const themeToggle = document.getElementById('themeToggle');

    let tasks = [];
    let currentFilter = 'all';

    // Get current user's task storage key (per-user isolation)
    function getTaskKey() {
        const session = localStorage.getItem('todo_session');
        if (session) {
            const { email } = JSON.parse(session);
            return 'tasks_' + email.toLowerCase();
        }
        return 'tasks';
    }

    // Load tasks from Local Storage (per-user)
    function loadTasks() {
        const key = getTaskKey();
        const saved = localStorage.getItem(key);
        if (saved) {
            tasks = JSON.parse(saved);
        } else {
            // Migrate from old global 'tasks' key if present
            const old = localStorage.getItem('tasks');
            if (old) {
                tasks = JSON.parse(old);
                localStorage.setItem(key, old);
            } else {
                tasks = [];
            }
        }
        renderTasks();
    }

    // Save tasks to Local Storage (per-user)
    function saveTasks() {
        localStorage.setItem(getTaskKey(), JSON.stringify(tasks));
    }

    // Create task element
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const dueHTML = task.dueDate 
            ? `<span class="due-date">${formatDueDate(task.dueDate)}</span>` 
            : '';

        const priorityHTML = task.priority 
            ? `<span class="priority-tag priority-${task.priority}">${task.priority.toUpperCase()}</span>` 
            : '';

        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-text">
                <span class="task-title">${task.text}</span>
                ${dueHTML}
            </div>
            ${priorityHTML}
            <button class="delete-btn">🗑️</button>
        `;

        li.querySelector('.checkbox').addEventListener('change', () => toggleComplete(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

        return li;
    }

    function formatDueDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0,0,0,0);
        const due = new Date(dateStr);
        due.setHours(0,0,0,0);

        const diff = Math.ceil((due - today) / (86400000));

        if (diff < 0) return '<span style="color:#ef4444;">Overdue</span>';
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function renderTasks() {
        taskList.innerHTML = '';

        let filtered = tasks;
        if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
        if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

        if (filtered.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filtered.forEach(task => taskList.appendChild(createTaskElement(task)));
        }

        updateStats();
    }

    function updateStats() {
        const total = tasks.length;
        const done = tasks.filter(t => t.completed).length;
        const percent = total ? Math.round((done / total) * 100) : 0;

        progressFill.style.width = percent + '%';
        numbersEl.textContent = done;
        totalEl.textContent = total;
    }

    function addTask(e) {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        tasks.unshift({
            id: Date.now().toString(),
            text: text,
            completed: false,
            dueDate: dueDateInput.value || null,
            priority: prioritySelect.value || null
        });

        saveTasks();
        renderTasks();
        taskForm.reset();
        prioritySelect.selectedIndex = 0;
    }

    function toggleComplete(id) {
        tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        if (confirm('Delete this task?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
    }

    function clearCompleted() {
        if (confirm('Clear all completed tasks?')) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
        }
    }

    taskForm.addEventListener('submit', addTask);
    clearCompletedBtn.addEventListener('click', clearCompleted);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    loadTasks();
});
