import { SearchResultType } from "@components/molecules/AISearchResultsList";
import { Contact } from "@models/contact.model";
import { LinkedinContact } from "@models/linkedinContact.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatRequest {
    text: string,
    timestamp: string,
    sender: "user",
}

export interface ChatResponse {
    text: string,
    timestamp: string,
    sender: "bot",
    isLiked?: boolean,
    data: {
        sourceDocs?: (Contact | LinkedinContact)[]
        searchResults?: SearchResultType[]
    }
}

export type ChatCycle = {
    id: string,
    request?: ChatRequest,
    response?: ChatResponse
}

export interface ChatThread {
    id: string,
    title: string,
    chatCycles: ChatCycle[]
}



export interface ChatSliceInterface {
    value: ChatThread
}


export const initialChatState: ChatSliceInterface = {
    value: {
        id: "",
        title: "",
        chatCycles: []
    }
}

export const actionSlice = createSlice({
    name: "chat",
    initialState: initialChatState,
    reducers: {
        addChatCycle(state: ChatSliceInterface, action: PayloadAction<ChatCycle>) {
            state.value.chatCycles.push(action.payload)
        },
        setChatThread(state: ChatSliceInterface, action: PayloadAction<ChatThread>) {
            state.value = action.payload
        },
        startChatThreadWithRequest(state: ChatSliceInterface, action: PayloadAction<{ chatRequest: ChatRequest, chatCycleId: string }>) {
            state.value.chatCycles.push({
                id: action.payload.chatCycleId,
                request: action.payload.chatRequest
            })
        },
        updateChatThreadWithResponse(state: ChatSliceInterface, action: PayloadAction<{ chatResponse: ChatResponse, chatCycleId: string }>) {
            const currentResponse = state.value.chatCycles.find(c => c.id === action.payload.chatCycleId)!.response
            state.value.chatCycles.find(c => c.id === action.payload.chatCycleId)!.response = {
                ...currentResponse,
                ...action.payload.chatResponse,
                data: {
                    ...currentResponse?.data,
                    ...action.payload.chatResponse.data
                }

            }
        },
        setLikeStateForSearchResult(state: ChatSliceInterface, action: PayloadAction<{ searchResultId: string, chatCycleId: string, isLiked: boolean }>) {
            const chatCycle = state.value.chatCycles.find(c => c.id === action.payload.chatCycleId)!
            const searchResult = chatCycle.response?.data?.searchResults?.find(sr => {
                // TODO: Patchfix - because ContentResponse doesn't have an id, it has an _id field so for now, we just skip over it if someone tries to like it
                if ("id" in sr) return sr.id === action.payload.searchResultId
            })
            if (searchResult) {
                searchResult.isLiked = action.payload.isLiked
            }
        },
        updateChatCycleId(state: ChatSliceInterface, action: PayloadAction<{ chatCycleId: string, newChatCycleId: string }>) {
            const chatCycle = state.value.chatCycles.find(c => c.id === action.payload.chatCycleId)!
            chatCycle.id = action.payload.newChatCycleId
        },
        setResponseLikedState(state: ChatSliceInterface, action: PayloadAction<{ chatCycleId: string, isLiked: boolean }>) {
            const chatCycle = state.value.chatCycles.find(c => c.id === action.payload.chatCycleId)!
            chatCycle.response!.isLiked = action.payload.isLiked
        }
    },
});

export const {
    setChatThread,
    addChatCycle,
    startChatThreadWithRequest,
    updateChatThreadWithResponse,
    setLikeStateForSearchResult,
    updateChatCycleId,
    setResponseLikedState
} = actionSlice.actions;

export default actionSlice.reducer;
