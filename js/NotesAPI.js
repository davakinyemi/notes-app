export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem('notesapp-notes') || '[]');

        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(note) {
        const notes = NotesAPI.getAllNotes();

        const existing = notes.find(oldNote => oldNote.id === note.id);

        // edit/update
        if(existing) {
            existing.title = note.title;
            existing.body = note.body;
            existing.updated = new Date().toISOString();
        } else {
            note.id = Math.floor(Math.random() * 1000000);
            note.updated = new Date().toISOString();
            notes.push(note);
        }


        localStorage.setItem('notesapp-notes', JSON.stringify(notes));
    }

    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);
        localStorage.setItem('notesapp-notes', JSON.stringify(newNotes));
    }
}