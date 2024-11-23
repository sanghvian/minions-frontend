import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group } from "@models/group.model";


export const initialGroupsListState: { value: Group[] } = {
    value: []
}

export const groupSlice = createSlice({
    name: "groupsList",
    initialState: initialGroupsListState,
    reducers: {
        setGroups(state: { value: Group[] }, action: PayloadAction<Group[]>) {
            state.value = action.payload
        },
        addGroupToList(state: { value: Group[] }, action: PayloadAction<Group>) {
            state.value.push(action.payload)
        }
    },
});

export const {
    setGroups,
    addGroupToList
} = groupSlice.actions;

export default groupSlice.reducer;
