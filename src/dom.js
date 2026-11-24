import { format, parseISO } from "date-fns";
import todoManager from "./todoManager.js";
import { saveData } from "./storage.js";

const projectList = document.querySelector(
    "#project-list",
);

const todoList = document.querySelector("#todo-list");

const currentProjectTitle = document.querySelector(
    "#current-project-title",
);

const projectDialog = document.querySelector(
    "#project-dialog",
);

const projectForm = document.querySelector(
    "#project-form",
);

const projectNameInput = document.querySelector(
    "#project-name",
);

const todoDialog = document.querySelector(
    "#todo-dialog",
);

const todoForm = document.querySelector("#todo-form");

const todoFormTitle = document.querySelector(
    "#todo-form-title",
);

const todoIdInput = document.querySelector("#todo-id");
const todoTitleInput = 
    document.querySelector("#todo-title");

const todoDescriptionInput = document.querySelector(
    "#todo-description",
);

const todoDueDateInput = document.querySelector(
    "#todo-due-date",
);

const todoPriorityInput = document.querySelector(
    "#todo-priority",
);

const todoNotesInput = document.querySelector(
    "#todo-notes",
);

const detailsDialog = document.querySelector(
    "#details-dialog",
);

const todoDetails = document.querySelector(
    "#todo-details",
);

function createElement(
    tag,
    {
        className,
        text,
        attributes = {},
    } = {},
) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    Object.entries(attributes).forEach(
        ([attribute, value]) => {
            element.setAttribute(attribute, value);
        },
    );

    return element;
}

function renderProjects() {
    projectList.replaceChildren();

    todoManager.projects.forEach((project) => {
        const projectRow = createElement("div", {
            className: "project-row",
        });

        const projectButton = createElement("button", {
            className: "project-button",
            text: project.name,
            attributes: {
                type: "button",
                "data-project-id": project.id,
            },
        });

        if (
            project.id === todoManager.selectedProjectId
        ) {
            projectButton.classList.add("selected");
        }

        projectRow.append(projectButton);

        if (todoManager.projects.length > 1) {
            const deleteButton = createElement("button", {
                className: "delete-project-button",
                text: "×",
                attributes: {
                    type: "button",
                    "data-delete-project-id": project.id,
                    "aria-label": `Delete ${project.name}`,
                },
            });

            projectRow.append(deleteButton);
        }

        projectList.append(projectRow);
    });
}

projectList.addEventListener("click", (event) => {
    const selectButton = event.target.closest(
        "[data-project-id]",
    );

    const deleteButton = event.target.closest(
        "[data-delete-project-id]",
    );

    if (selectButton) {
        todoManager.selectProject(
            selectButton.dataset.projectId,
        );

        saveAndRender();
        return;
    }

    if (deleteButton) {
        const projectId = 
            deleteButton.dataset.deleteProjectId;

        const project = todoManager.getProject(projectId);

        const shouldDelete = window.confirm(
            `Delete the "${project.name}" project and all of its todos?`,
        );

        if (!shouldDelete) {
            return;
        }

        try {
            todoManager.deleteProject(projectId);
            saveAndRender();
        } catch (error) {
            window.alert(error.message);
        }
    }
});

document
    .querySelector("#open-project-form")
    .addEventListener("click", () => {
        projectForm.reset();
        projectDialog.showModal();
        projectNameInput.focus();
    });

projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    try {
        todoManager.addProject(projectNameInput.value);
        projectDialog.close();
        projectForm.reset();
        saveAndRender();
    } catch (error) {
        window.alert(error.message);
    }
});

document
    .querySelectorAll("[data-close-dialog]")
    .forEach((button) => {
        button.addEventListener("click", () => {
            button.closest("dialog").close();
        });
    });

function createTodoCard(todo) {
    const card = createElement("article", {
        className: "todo-card",
        attributes: {
            "data-todo-id": todo.id,
        },
    });

    card.classList.add(`priority-${todo.priority}`);

    if (todo.completed) {
        card.classList.add("completed");
    }

    const completionCheckbox = createElement("input", {
        attributes: {
          type: "checkbox",
          "data-action": "toggle",
          "aria-label": `Mark ${todo.title} complete`,  
        },
    });

    completionCheckbox.checked = todo.completed;

    const content = createElement("button", {
        className: "todo-card-content",
        attributes: {
            type: "button",
            "data-action": "details",
        },
    });

    const title = createElement("h3", {
        text: todo.title,
    });

    const dueDate = createElement("p", {
        className: "todo-due-date",
        text: formatTodoDate(todo.dueDate),
    });

    content.append(title, dueDate);

    const actions = createElement("div", {
        className: "todo-actions",
    });

    const editButton = createElement("button", {
        text: "Edit",
        attributes: {
            type: "button",
            "data-action": "edit",
        },
    });

    const deleteButton = createElement("button", {
        text: "Delete",
        attributes: {
            type: "button",
            "data-action": "delete",
        },
    });

    actions.append(editButton, deleteButton);

    card.append(
        completionCheckbox,
        content,
        actions,
    );

    return card;
}

function formatTodoDate(dateString) {
    if (!dateString) {
        return "No due date";
    }

    try {
        return format(
            parseISO(dateString),
            "MMM d, yyyy",
        );
    } catch {
        return dateString;
    }
}

function renderTodos() {
    todoList.replaceChildren();

    const selectedProject = 
        todoManager.getSelectedProject();

    if (!selectedProject) {
        currentProjectTitle.textContent = 
            "No project selected";
        return;
    }

    currentProjectTitle.textContent =
        selectedProject.name;
    
    if (selectedProject.todos.length === 0) {
        const emptyMessage = createElement("p", {
            className: "empty-message",
            text: "There are no todos in this project.",
        });

        todoList.append(emptyMessage);
        return;
    }

    selectedProject.todos.forEach((todo) => {
        todoList.append(createTodoCard(todo));
    });
}

document
    .querySelector("#open-todo-form")
    .addEventListener("click", () => {
        todoForm.reset();
        todoIdInput.value = "";
        todoFormTitle.textContent = "Create Todo";
        todoPriorityInput.value = "medium";

        todoDialog.showModal();
        todoTitleInput.focus();
    });

function getTodoFormData() {
    return {
        title: todoTitleInput.value.trim(),
        description:
            todoDescriptionInput.value.trim(),
        dueDate: todoDueDateInput.value,
        priority: todoPriorityInput.value,
        notes: todoNotesInput.value.trim(),
    };
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const todoData = getTodoFormData();
    const editingTodoId = todoIdInput.value;

    if (!todoData.title) {
        window.alert("Please enter a todo title.");
        return;
    }

    if (editingTodoId) {
        todoManager.updateTodo(
            editingTodoId,
            todoData,
        );
    } else {
        todoManager.addTodo(todoData);
    }

    todoDialog.close();
    todoForm.reset();
    saveAndRender();
});

todoList.addEventListener("click", (event) => {
    const card = event.target.closest("[data-todo-id]");

    if (!card) {
        return;
    }

    const todoId = card.dataset.todoId;
    const actionElement = event.target.closest(
        "[data-action]",
    );

    if (!actionElement) {
        return;
    }

    const action = actionElement.dataset.action;

    if (action === "toggle") {
        todoManager.toggleTodo(todoId);
        saveAndRender();
    }

    if (action === "details") {
        openTodoDetails(todoId);
    }

    if (action === "edit") {
        openTodoEditForm(todoId);
    }

    if (action === "delete") {
        deleteTodo(todoId);
    }
});

function openTodoDetails(todoId) {
    const todo = todoManager.getTodo(todoId);

    if (!todo) {
        return;
    }

    todoDetails.replaceChildren();

    const title = createElement("h2", {
        text: todo.title,
    });

    const description = createElement("p", {
        text: 
            todo.description || "No description provided.",
    });

    const dueDate = createElement("p", {
        text: `Due: ${formatTodoDate(todo.dueDate)}`,
    });

    const priority = createElement("p", {
        text: `Priority: ${capitalize(todo.priority)}`,
    });

    const status = createElement("p", {
        text: `Status: ${
            todo.completed ? "Complete" : "Incomplete"
        }`,
    });

    const notes = createElement("p", {
        text: todo.notes || "No notes provided.",
    });

    todoDetails.append(
        title,
        description,
        dueDate,
        priority,
        status,
        notes,
    );

    detailsDialog.showModal();
}

function capitalize(value) {
    return (
        value.charAt(0).toUpperCase() + value.slice(1)
    );
}

function openTodoEditForm(todoId) {
    const todo = todoManager.getTodo(todoId);

    if (!todo) {
        return;
    }

    todoFormTitle.textContent = "Edit Todo";

    todoIdInput.value = todo.id;
    todoTitleInput.value = todo.title;
    todoDescriptionInput.value = todo.description;
    todoDueDateInput.value = todo.dueDate;
    todoPriorityInput.value = todo.priority;
    todoNotesInput.value = todo.notes;

    todoDialog.showModal();
}

function deleteTodo(todoId) {
    const todo = todoManager.getTodo(todoId);

    if (!todo) {
        return;
    }

    const shouldDelete = window.confirm(
        `Delete "${todo.title}"?`,
    );

    if (!shouldDelete) {
        return;
    }

    todoManager.deleteTodo(todoId);
    saveAndRender();
}

export function renderApp() {
  renderProjects();
  renderTodos();
}

function saveAndRender() {
  saveData(todoManager);
  renderApp();
}