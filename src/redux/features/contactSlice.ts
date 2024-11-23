import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompleteContact } from "@models/contact.model";
import { RecordType } from "@models/index";
import { Note } from "@models/note.model";
import { CompleteAction } from "@models/action.model";
import { CompleteLinkedinContact } from "@models/linkedinContact.model";

interface ContactSliceInterface {
    value: {
        activeContact: CompleteContact,
        activeContacts: CompleteContact[]
    }
}

export const initialContactState: ContactSliceInterface = {
    value: {
        activeContact: {
            name: "",
            namespace: "",
            biography: '',
            email: '',
            interests: [],
            occupation: '',
            organization_name: '',
            location: '',
            phone: '',
            recordType: RecordType.CONTACT,
            timestamp: '',
            noteIds: [],
            relationshipId: '',
            notes: [],
            actions: [],
            imgUrl: '',
            linkedinContactId: '',
            linkedinContact: undefined
        },
        activeContacts: []
    }
}

export const contactSlice = createSlice({
    name: "contact",
    initialState: initialContactState,
    reducers: {
        setContact(state: ContactSliceInterface, action: PayloadAction<CompleteContact>) {
            state.value.activeContact = action.payload
        },
        setContactActions(state: ContactSliceInterface, action: PayloadAction<CompleteAction[]>) {
            if (state.value) {
                state.value.activeContact.actions = action.payload
            }
        },
        addContactNote(state: ContactSliceInterface, action: PayloadAction<Note>) {
            if (state.value) {
                if (!state.value.activeContact.notes) { state.value.activeContact.notes = [] }
                state.value.activeContact.notes!.push(action.payload)
                state.value.activeContact.noteIds!.push(action.payload.id!)
            }
        },
        removeContactNote(state: ContactSliceInterface, action: PayloadAction<Note>) {
            if (state.value) {
                state.value.activeContact.notes = state.value.activeContact.notes!.filter((note: Note) => note.id !== action.payload.id)
                state.value.activeContact.noteIds = state.value.activeContact.noteIds.filter((noteId: string) => noteId !== action.payload.id)
            }
        },
        clearContactNotes(state: ContactSliceInterface) {
            if (state.value) {
                state.value.activeContact.notes = []
                state.value.activeContact.noteIds = []
            }
        },
        setLinkedinContactForContact(state: ContactSliceInterface, action: PayloadAction<CompleteLinkedinContact>) {
            if (state.value) {
                state.value.activeContact.linkedinContact = action.payload
                state.value.activeContact.linkedinContactId = action.payload.id
            }
        },
        setActiveContacts(state: ContactSliceInterface, action: PayloadAction<CompleteContact[]>) {
            state.value.activeContacts = action.payload
        },
        addContactToActiveContactsList(state: ContactSliceInterface, action: PayloadAction<CompleteContact>) {
            state.value.activeContacts.push(action.payload)
        },
        removeContactFromActiveContactsList(state: ContactSliceInterface, action: PayloadAction<CompleteContact>) {
            state.value.activeContacts = state.value.activeContacts.filter((contact) => contact.id !== action.payload.id)
        }
    },
});

export const {
    setContact,
    addContactNote,
    removeContactNote,
    setContactActions,
    clearContactNotes,
    setLinkedinContactForContact,
    setActiveContacts,
    addContactToActiveContactsList,
    removeContactFromActiveContactsList
} = contactSlice.actions;

export default contactSlice.reducer;
