const STORAGE_KEY = "odin-todo-list";

export function saveData(todoManager) {
    const data = todoManager.getSerializableData();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data),
    );
}

export function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return null;
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        console.error("Could not load saved todo data:", error);
        return null;
    }
}

export function clearData() {
    localStorage.removeItem(STORAGE_KEY);
}