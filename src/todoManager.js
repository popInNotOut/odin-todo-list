import Project from "./project.js";
import Todo from "./todo.js";

class TodoManager {
    constructor() {
        this.projects = [];
        this.selectedProjectId = null;
    }

    initializeDefaultProject() {
        if (this.projects.length > 0) {
            return;
        }

        const inbox = new Project({
            name: "Inbox",
        });

        this.projects.push(inbox);
        this.selectedProjectId = inbox.id;
    }

    getSelectedProject() {
        return this.projects.find(
            (project) => project.id === this.selectedProjectId,
        );
    }

    getProject(projectId) {
        return this.projects.find(
            (project) => project.id === projectId,
        );
    }

    addProject(name) {
        const trimmedName = name.trim();

        if (!trimmedName) {
            throw new Error("Project name cannot be empty.");
        }

        const project = new Project({
            name: trimmedName,
        });

        this.projects.push(project);
        this.selectedProjectId = project.id;

        return project;
    }

    selectProject(projectId) {
        const project = this.getProject(projectId);

        if (!project) {
            throw new Error("Project not found.");
        }

        this.selectedProjectId = projectId;
    }

    deleteProject(projectId) {
        if (this.projects.length === 1) {
            throw new Error(
              "You must keep at least one project.", 
            );
        }

        this.projects = this.projects.filter(
            (project) => project.id !== projectId,
        );

        if (this.selectedProjectId === projectId) {
            this.selectedProjectId = this.projects[0].id;
        }
    }

    addTodo(todoData) {
        const project = this.getSelectedProject();

        if (!project) {
            throw new Error("No project is selected.");
        }

        const todo = new Todo(todoData);
        project.addTodo(todo);

        return todo;
    }

    getTodo(todoId) {
        const project = this.getSelectedProject();
        return project?.getTodo(todoId);
    }

    updateTodo(todoId, todoData) {
        const todo = this.getTodo(todoId);

        if (!todo) {
            throw new Error("Todo not found.");
        }

        todo.update(todoData);
    }

    toggleTodo(todoId) {
        const todo = this.getTodo(todoId);

        if (!todo) {
            throw new Error("Todo not found.");
        }

        todo.toggleComplete();
    }

    deleteTodo(todoId) {
        const project = this.getSelectedProject();

        if (!project) {
            throw new Error("No project is selected.");
        }

        project.deleteTodo(todoId);
    }

    loadData({ projects, selectedProjectId }) {
        this.projects = projects.map(
            (projectData) => new Project(projectData),
        );

        const selectedProjectExists = this.projects.some(
            (project) => project.id === selectedProjectId,
        );

        this.selectedProjectId = selectedProjectExists
            ? selectedProjectId
            : this.projects[0]?.id ?? null;

        this.initializeDefaultProject();
    }

    getSerializableData() {
        return {
            projects: this.projects,
            selectedProjectId: this.selectedProjectId,
        };
    }
}

export default new TodoManager();