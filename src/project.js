import Todo from "./todo.js";

export default class Project {
    constructor({
        name,
        todos = [],
        id = crypto.randomUUID(),
    }) {
        this.id = id;
        this.name = name;

        this.todos = todos.map((todo) => {
            if (todo instanceof Todo) {
                return todo;
            }

            return new Todo(todo);
        });
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    getTodo(todoId) {
        return this.todos.find((todo) => todo.id === todoId);
    }

    deleteTodo(todoId) {
        this.todos = this.todos.filter(
            (todo) => todo.id !== todoId,
        );
    }
}