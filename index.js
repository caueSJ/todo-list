const getTasks = () => {
    const stringTasks = localStorage.getItem('todo-tasks');

    if (!stringTasks) {
        return [];
    }

    return JSON.parse(stringTasks);
}

const toogleChecked = (element) => {
    const classList = element.classList;
    const taskId = +element.parentElement.id;
    classList.toggle('done', !classList.contains('done'));

    const tasks = getTasks();
    const indexTaskToChange = tasks.findIndex(task => task.id === taskId);
    tasks[indexTaskToChange].status = (tasks[indexTaskToChange].status === 0) ? 1 : 0;
    setTask(tasks);
}

const setTask = (tasks) => {
    const stringTasks = JSON.stringify(tasks);
    localStorage.setItem('todo-tasks', stringTasks);
};

const addTask = (task) => {
    const tasks = getTasks();
    const newTasks = [
        ...tasks,
        task
    ];

    setTask(newTasks);
}

const removeTask = (element) => {
    element.parentElement.parentElement.parentElement.remove();
    const tasks = document.getElementsByTagName('li');
    const newTasks = Array.from(tasks, task => {
        return {
            id: +task.id - 1, // FIX ID ATTRIBUTION
            title: task.querySelector('h2').innerText,
            status: (task.querySelector('.task-checkbox').classList.contains('done')) ? 1 : 0
        }
    });
    setTask(newTasks);
    if (tasks.length === 0) {
        document.querySelector('#task-list').insertAdjacentHTML('beforeend', '<h2 class="empty">Well done, no tasks to do! :D</h2>');   
    }
}

const formHandlerSubmit = (event) => {
    event.preventDefault();
    const taskTitle = event.target.querySelector('input[type="text"]').value.trim();
    const tasks = getTasks();

    if (taskTitle.length === 0)
        return;

    const newTask = {
        id: tasks.length + 1,
        title: taskTitle,
        status: 0
    }

    addTask(newTask);
    loadTasks();
    event.target.reset();
}

const handlerTaskItemEvent = (event) => {
    event.stopPropagation();
    const eventName = event.target.getAttribute('name');
    const element = event.target;

    switch (eventName) {
        case 'toogle-status':
            toogleChecked(element);
            break;
    
        case 'edit':
            break;
        
        case 'remove':
            removeTask(element);
            break;

        default:
            break;
    }

    return;
}

const attachEvents = () => {
    document.querySelector('form').addEventListener('submit', formHandlerSubmit);

    document.querySelector('ul').addEventListener('click', handlerTaskItemEvent);
}

const taskItemHTML = (task) => {
    return `
        <li id="${task.id}">
            <div name="toogle-status" class="task-checkbox ${(task.status === 1) ? 'done' : ''}" title="Complete task"></div>
            <h2>${task.title}</h2>
            <div class="options">
                <div>
                    <div name="edit" title="Edit task" class="icon pencil"></div>
                </div>
                <div>
                    <div name="remove" title="Remove task" class="icon trash"></div>
                </div>
            </div>
        </li>`;
}

const loadTasks = () => {
    const taskList = document.querySelector('#task-list');
    taskList.innerHTML = '';
    const tasks = getTasks();
    if (tasks.length === 0) {
        taskList.insertAdjacentHTML('beforeend', '<h2 class="empty">No tasks to do<h2>');
    }
    tasks.forEach(task => {
        taskList.insertAdjacentHTML('beforeend', taskItemHTML(task));
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    attachEvents();
});