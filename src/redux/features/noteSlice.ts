import { RecordType } from "@models/index";
import { CompleteNote, Note } from "@models/note.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface NoteSliceInterface {
    value: {
        activeNote: Note,
        recentNotes: CompleteNote[]
    }
}

export const initialNoteState: NoteSliceInterface = {
    value: {
        activeNote: {
            id: "",
            content: "",
            location: "",
            timestamp: "",
            contactId: "",
            recordType: RecordType.NOTE
        },
        recentNotes: []
    }
}

export const noteSlice = createSlice({
    name: "note",
    initialState: initialNoteState,
    reducers: {
        setActiveNote(state: NoteSliceInterface, action: PayloadAction<Note>) {
            state.value.activeNote = action.payload
        },
        setRecentNotes(state: NoteSliceInterface, action: PayloadAction<Note[]>) {
            // Ensure that all the notes inside action.payload are unique notes using Set
            const uniqueNotes = new Set(action.payload)
            state.value.recentNotes = Array.from(uniqueNotes)
        },
        addRecentNoteToList(state: NoteSliceInterface, action: PayloadAction<Note>) {
            state.value.recentNotes.push(action.payload)
        }
    },
});

export const {
    setActiveNote,
    setRecentNotes,
    addRecentNoteToList
} = noteSlice.actions;

export default noteSlice.reducer;
