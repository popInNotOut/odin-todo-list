export default class Todo {
    constructor({
        title,
        description = "",
        dueDate,
        priority = "medium",
        notes = "",
        completed = false,
        id = crypto.randomUUID(),
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.completed = completed;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    update({
        title,
        description,
        dueDate,
        priority,
        notes,
    }) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
    }
}