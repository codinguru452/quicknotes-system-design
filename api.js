
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

let notes = [];

// Display a status message and apply the correct CSS class.
function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// Reusable function for making API requests.
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    // DELETE responses may have no JSON body.
    if (response.status === 204) {
        return null;
    }

    const data = await response.json();

    return {
        data,
        status: response.status
    };
}

// Display notes safely on the page.
function renderNotes() {
    notesList.replaceChildren();

    if (notes.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No notes available. Load or create a note.";
        emptyMessage.classList.add("empty-message");
        notesList.appendChild(emptyMessage);
        return;
    }

    notes.forEach((note) => {
        const listItem = document.createElement("li");
        listItem.classList.add("note-item");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const body = document.createElement("p");
        body.textContent = note.body || "No content provided.";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteNote(note.id, deleteButton);
        });

        listItem.append(title, body, deleteButton);
        notesList.appendChild(listItem);
    });
}

// GET: Load 10 notes from the server.
async function loadNotes() {
    loadButton.disabled = true;
    showStatus("Loading notes...", "loading");

    try {
        const result = await request(`${API_URL}?_limit=10`);

        notes = result.data;
        renderNotes();

        if (notes.length === 0) {
            showStatus("No notes were found.", "success");
        } else {
            showStatus(
                `Loaded ${notes.length} notes from the server.`,
                "success"
            );
        }
    } catch (error) {
        console.error("Error loading notes:", error);
        showStatus(
            "Unable to load notes. Please check your connection and try again.",
            "error"
        );
    } finally {
        loadButton.disabled = false;
    }
}

// POST: Create a new note.
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showStatus("Please enter a note title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus("The title cannot exceed 100 characters.", "error");
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;
    showStatus("Creating note...", "loading");

    try {
        const result = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        const newNote = result.data;

        // JSONPlaceholder returns a simulated new note.
        // It does not permanently save the note on its server.
        notes.unshift(newNote);

        renderNotes();

        showStatus(
            `Note created (status ${result.status}, id ${newNote.id}).`,
            "success"
        );

        noteForm.reset();
    } catch (error) {
        console.error("Error creating note:", error);
        showStatus(
            "Unable to create the note. Please try again.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
    }
}

// DELETE: Remove a note.
async function deleteNote(noteId, deleteButton) {
    deleteButton.disabled = true;
    showStatus("Deleting note...", "loading");

    try {
        const result = await request(`${API_URL}/${noteId}`, {
            method: "DELETE"
        });

        // JSONPlaceholder simulates DELETE and does not permanently
        // change its stored data. We remove the note from this page's
        // local array so the user sees the expected result.
        notes = notes.filter((note) => note.id !== noteId);

        renderNotes();

        showStatus(`Note ${noteId} deleted successfully.`, "success");
    } catch (error) {
        console.error("Error deleting note:", error);
        showStatus(
            "Unable to delete the note. Please try again.",
            "error"
        );

        deleteButton.disabled = false;
    }
}

// Event listeners.
loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
