# Todo List

A responsive todo list application built with vanilla JavaScript
as part of The Odin Project's JavaScript curriculum. The application
allows users to organize tasks into projects, manage priorities,
track completion, and persist data across browser sessions.

## Live Demo

[View Live Demo](https://popInNotOut.github.io/odin-todo-list/)

## Features

- Create and delete projects.
- Create, edit, view, and delete todos.
- Organize todos into separate projects.
- Assign due dates, descriptions, notes, and priority levels.
- Mark todos as complete or incomplete.
- Color-coded priority indicators.
- Persistent data storage using localStorage.
- Responsive design for desktop and mobile devices.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- npm
- Webpack
- date-fns
- Web Storage API (localStorage)
- Git and GitHub

## Project Architecture

The application follows a modular, object-oriented architecture
that separates application logic, DOM manipulation, and data
persistence.

| Module | Responsibility |
| --- | --- |
| `index.js` | Initializes the application |
| `todo.js` | Defines the Todo class and its behavior |
| `project.js` | Manages individual projects and their todos |
| `todoManager.js` | Manages application state and operations |
| `storage.js` | Handles JSON serialization and localStorage |
| `dom.js` | Handles UI rendering and user interactions |
| `styles.css` | Defines the application's visual appearance |

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/popInNotOut/odin-todo-list.git
cd odin-todo-list
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

## What I Learned

Through this project, I gained practical experience with:

- Applying object-oriented programming principles in JavaScript.
- Following the Single Responsibility Principle.
- Separating application logic from DOM manipulation.
- Managing application state across multiple modules.
- Using npm to manage third-party dependencies.
- Configuring Webpack to bundle JavaScript, HTML, and CSS.
- Serializing and deserializing data using JSON.
- Reconstructing class instances from stored JSON data.
- Persisting application state using localStorage.
- Handling dynamically generated elements through event delegation.
- Formatting dates using the date-fns library.

## Acknowledgements

This project was completed as part of
[The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-todo-list)
JavaScript curriculum.