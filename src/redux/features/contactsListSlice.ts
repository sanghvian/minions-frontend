import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompleteContact } from "@models/contact.model";


export const initialContactsListState: { value: CompleteContact[] } = {
    value: []
}

export const contactSlice = createSlice({
    name: "contactsList",
    initialState: initialContactsListState,
    reducers: {
        setFixedContacts(state: { value: CompleteContact[] }, action: PayloadAction<CompleteContact[]>) {
            state.value = action.payload
        },
        addContactToList(state: { value: CompleteContact[] }, action: PayloadAction<CompleteContact>) {
            state.value.push(action.payload)
        },
        removeContactFromList(state: { value: CompleteContact[] }, action: PayloadAction<CompleteContact>) {
            state.value = state.value.filter((contact) => contact.id !== action.payload.id)
        },
        clearContactsList(state: { value: CompleteContact[] }) {
            state.value = []
        }
    },
});

export const {
    setFixedContacts,
    addContactToList,
    removeContactFromList,
    clearContactsList
} = contactSlice.actions;

export default contactSlice.reducer;
