import { ResponseContentBlock } from "@models/contentBlock.model";
import { CompleteContentResponse } from "@models/contentResponse.model";
import { Tag } from "@models/tag.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface TopicsSliceInterface {
    activeTopic: ResponseContentBlock,
}

export const initialTopicsState: TopicsSliceInterface = {
    activeTopic: {
        _id: "",
        templateId: {
            _id: "",
            name: "",
            description: "",
            userId: "",
            createdAt: "",
            updatedAt: "",
        },
        description: "",
        blockTitle: "",
        blockKey: "",
        order: 0,
        userId: "",
        responseType: "text",
        optionIds: [],
        contentResponses: [],
        responseTags: [],
        tags: [],
    }
}

export const topicSlice = createSlice({
    name: "topic",
    initialState: initialTopicsState,
    reducers: {
        setActiveTopic(state: TopicsSliceInterface, action: PayloadAction<ResponseContentBlock>) {
            state.activeTopic = action.payload
        },
        updateContentResponseInTopic(state: TopicsSliceInterface, action: PayloadAction<CompleteContentResponse>) {
            state.activeTopic.contentResponses = state.activeTopic.contentResponses?.map((response) => {
                if (response._id === action.payload._id) {
                    return {
                        ...response,
                        ...action.payload
                    }
                }
                return response
            })
        },
        setTopicTags(state: TopicsSliceInterface, action: PayloadAction<Tag[]>) {
            state.activeTopic.tags = action.payload
        }
    },
});

export const {
    setActiveTopic,
    updateContentResponseInTopic,
    setTopicTags
} = topicSlice.actions;

export default topicSlice.reducer;
