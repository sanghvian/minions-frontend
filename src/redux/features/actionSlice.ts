import { RecordType } from "@models/index";
import { Action, ActionStatus, CompleteAction } from "@models/action.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActionSliceInterface {
    value: {
        activeAction: Action,
        // Active actions contains the actions we get when we get suggestedActions and are selecting, deleting, or editing them
        activeActions: Action[],

        // Suggested actions are the actions that are suggested to the user based on the context of the conversation. We store only temp stuff here so that we can have the AI response and the user final response stored up
        suggestedActions: Action[],

        // Recent actions will eventually only deal with actions that are recently added, imp upcoming and will populate the home-page. Mostly just 5 of them will be shown, as per "today", "tomorrow" or "this week"
        recentActions: CompleteAction[]

        // Fixed actions are the actions on the calendar page of the user that contain all of the upcoming actions that they're supposed to do
        fixedActions: Action[]
    }
}


export const initialActionState: ActionSliceInterface = {
    value: {
        activeAction: {
            id: "",
            event: "",
            action: "",
            timestamp: "",
            relationshipId: "",
            actionLink: "",
            status: ActionStatus.SCHEDULED,
            recordType: RecordType.ACTION
        },
        activeActions: [],
        recentActions: [],
        fixedActions: [],
        suggestedActions: []
    }
}

export const actionSlice = createSlice({
    name: "action",
    initialState: initialActionState,
    reducers: {
        setAction(state: ActionSliceInterface, action: PayloadAction<Action>) {
            state.value.activeAction = action.payload
        },
        setActiveActions(state: ActionSliceInterface, action: PayloadAction<Action[]>) {
            state.value.activeActions = action.payload
        },
        setRecentActions(state: ActionSliceInterface, action: PayloadAction<Action[]>) {
            state.value.recentActions = action.payload
        },
        setFixedActions(state: ActionSliceInterface, action: PayloadAction<Action[]>) {
            state.value.fixedActions = action.payload
        },
        setSuggestedActions(state: ActionSliceInterface, action: PayloadAction<Action[]>) {
            state.value.suggestedActions = action.payload
        },
        removeActiveActionFromList(state: ActionSliceInterface, action: PayloadAction<Action>) {
            state.value.activeActions = state.value.activeActions.filter((activeAction: Action) => activeAction.id !== action.payload.id)
        }
    },
});

export const {
    setAction,
    setActiveActions,
    setRecentActions,
    setFixedActions,
    setSuggestedActions,
    removeActiveActionFromList
} = actionSlice.actions;

export default actionSlice.reducer;
