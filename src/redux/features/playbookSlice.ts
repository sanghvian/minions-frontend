import { CompleteTemplate, Template } from "@models/template.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface PlaybookSliceInterface {
    activePlaybook: CompleteTemplate,
    playbooksList: Template[]
}

export const initialPlaybookState: PlaybookSliceInterface = {
    activePlaybook: {
        _id: "",
        name: "",
        description: "",
        userId: "",
        createdAt: "",
        updatedAt: "",
        contentBlocks: []
    },
    playbooksList: []
}

export const playbookSlice = createSlice({
    name: "playbook",
    initialState: initialPlaybookState,
    reducers: {
        setActivePlaybook(state: PlaybookSliceInterface, action: PayloadAction<CompleteTemplate>) {
            state.activePlaybook = action.payload
        },
        setPlaybooksList(state: PlaybookSliceInterface, action: PayloadAction<Template[]>) {
            // Ensure that all the playbooks inside action.payload are unique playbooks using Set
            const uniquePlaybooks = new Set(action.payload)
            state.playbooksList = Array.from(uniquePlaybooks)
        },
        addPlaybookToList(state: PlaybookSliceInterface, action: PayloadAction<Template>) {
            state.playbooksList.push(action.payload)
        },
        removePlaybookFromList(state: PlaybookSliceInterface, action: PayloadAction<Template>) {
            state.playbooksList = state.playbooksList.filter((playbook) => playbook._id !== action.payload._id)
        }
    },
});

export const {
    setActivePlaybook,
    setPlaybooksList,
    addPlaybookToList,
    removePlaybookFromList
} = playbookSlice.actions;

export default playbookSlice.reducer;
