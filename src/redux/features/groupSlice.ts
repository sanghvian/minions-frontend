import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompleteGroup, Group } from "@models/group.model";
import { RecordType } from "@models/index";

export interface GroupSliceInterface {
    activeGroup: CompleteGroup
    groupsList: Group[]
}


export const initialGroupState: GroupSliceInterface = {
    activeGroup: {
        id: "",
        name: "",
        description: "",
        contactIds: [],
        contacts: [],
        recordType: RecordType.GROUP
    },
    groupsList: []
}

export const groupSlice = createSlice({
    name: "group",
    initialState: initialGroupState,
    reducers: {
        setGroup(state: GroupSliceInterface, action: PayloadAction<CompleteGroup>) {
            state.activeGroup = action.payload
        },
        setGroupContacts(state: GroupSliceInterface, action: PayloadAction<CompleteGroup["contacts"]>) {
            state.activeGroup.contacts = action.payload
        },
        setGroups(state: GroupSliceInterface, action: PayloadAction<Group[]>) {
            state.groupsList = action.payload
        },
        addGroupToList(state: GroupSliceInterface, action: PayloadAction<Group>) {
            state.groupsList.push(action.payload)
        }
    },
});

export const {
    setGroup,
    setGroupContacts,
    setGroups,
    addGroupToList
} = groupSlice.actions;

export default groupSlice.reducer;
