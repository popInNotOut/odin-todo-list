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










export function renderApp() {
  renderProjects();
//   renderTodos();
}

function saveAndRender() {
  saveData(todoManager);
  renderApp();
}