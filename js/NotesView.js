export default class NotesView {

    #root;

    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.#root = root;
        this.#setFunctions(onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete);
        this.#root.innerHTML = NotesView.#getInnerHTML();
        this.addListeners();
        
        this.updateNotePreviewVisibility(false);
    }

    #setFunctions(onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete) {
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete; 
    }

    static #getInnerHTML() {
        return `
            <div class="notes__sidebar">
                <button class="notes__add" type="button">Add Note</button>
                <div class="notes__list">
                    
                </div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body">Take Note...</textarea>
            </div>
        `;
    }

    addListeners() {
        const btnAddNote = this.#root.querySelector('.notes__add');
        const inputTitle = this.#root.querySelector('.notes__title');
        const inputBody = this.#root.querySelector('.notes__body');

        btnAddNote.addEventListener('click', () => {
            this.onNoteAdd();
        });

        [inputTitle, inputBody].forEach(inputField => {
            inputField.addEventListener('blur', () => {
                const updatedTitle = inputTitle.value.trim();
                const updatedBody = inputBody.value.trim();
                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });
    }

    getRoot() {
        return this.#root;
    }

    #createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;
        const locStringOptions = {
            dateStyle: 'full',
            timeStyle: 'short'
        }

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.length > MAX_BODY_LENGTH ? body.substring(0, MAX_BODY_LENGTH) : body}
                    ${body.length > MAX_BODY_LENGTH ? '...' : ''}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, locStringOptions)}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.#root.querySelector('.notes__list');

        // empty list
        notesListContainer.innerHTML = '';

        console.log(notes);

        for(const note of notes) {
            const html = this.#createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML('beforeend', html);
        }

        // add select/delete event for each list item
        notesListContainer.querySelectorAll('.notes__list-item').forEach(noteListItem => {
            noteListItem.addEventListener('click', () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });
            noteListItem.addEventListener('dblclick', () => {
                const doDelete = confirm('Are you sure you want to delete this note?');
                if(doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.#root.querySelector('.notes__title').value = note.title;
        this.#root.querySelector('.notes__body').value = note.body;
        this.#root.querySelectorAll('.notes__list-item--selected').forEach(noteListItem => {
            noteListItem.classList.remove('notes__list-item--selected');
        });
        this.#root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add('notes__list-item--selected');
    }

    updateNotePreviewVisibility(visible) {
        this.#root.querySelector('.notes__preview').style.visibility = visible ? 'visible' : 'hidden';
    }
}