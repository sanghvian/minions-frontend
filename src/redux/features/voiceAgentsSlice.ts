import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VoiceAgent {
    id: string,
    name: string;
    description: string;
    prompt: string;
    audioUrls: string[];
    imgUrl: string
}

interface VoiceAgentsSliceInterface {
    voiceAgents: VoiceAgent[];
}

const initialAgentsState = [
    {
        id: "1",
        name: "Maya Sen",
        description: "Ideal for low ticket size, neutral customer speaking Hindi-English mixed",
        prompt: "Hello, I am Maya Sen. How can I help you today?",
        audioUrls: [
            "https://recontact-temp-recording-bucket.s3.amazonaws.com/voice-calls/1.aac",
        ],
        imgUrl: "https://recontact-temp-recording-bucket.s3.amazonaws.com/photos/SCR-20240616-hovm.png"
    },
    {
        id: "2",
        name: "Dheeraj Singh",
        description: "Ideal for low ticket size, neutral customer with a thick Punjabi accent",
        prompt: "Hello, I am Dheeraj. How can I help you today?",
        audioUrls: [],
        imgUrl: "https://recontact-temp-recording-bucket.s3.amazonaws.com/photos/SCR-20240616-hpcv.png"
    },
    {
        id: "3",
        name: "Nina Sharma",
        description: "Ideal for high ticket size, neutral customer speaking with a stern, Marathi accent",
        prompt: "Hello, I am Nina Sharma. How can I help you today?",
        audioUrls: [],
        imgUrl: "https://recontact-temp-recording-bucket.s3.amazonaws.com/photos/SCR-20240616-hrgd.png"
    },
    {
        id: "4",
        name: "Jayanth K",
        description: "Ideal for high ticket size, risky customers who speak south Indian accent",
        prompt: "Hello, I am Jayanth K. How can I help you today?",
        audioUrls: [],
        imgUrl: "https://recontact-temp-recording-bucket.s3.amazonaws.com/photos/SCR-20240616-hqzi.png"
    },
]

const initialVoiceAgentsState: VoiceAgentsSliceInterface = {
    voiceAgents: initialAgentsState,
};

export const voiceAgentsSlice = createSlice({
    name: "voiceAgents",
    initialState: initialVoiceAgentsState,
    reducers: {
        addVoiceAgent(state, action: PayloadAction<VoiceAgent>) {
            state.voiceAgents.push(action.payload);
        },
        updateVoiceAgentName(
            state,
            action: PayloadAction<{ index: number; name: string }>
        ) {
            const { index, name } = action.payload;
            if (state.voiceAgents[index]) {
                state.voiceAgents[index].name = name;
            }
        },
        updateVoiceAgentDescription(
            state,
            action: PayloadAction<{ index: number; description: string }>
        ) {
            const { index, description } = action.payload;
            if (state.voiceAgents[index]) {
                state.voiceAgents[index].description = description;
            }
        },
        updateVoiceAgentPrompt(
            state,
            action: PayloadAction<{ index: number; prompt: string }>
        ) {
            const { index, prompt } = action.payload;
            if (state.voiceAgents[index]) {
                state.voiceAgents[index].prompt = prompt;
            }
        },
        addVoiceAgentAudioUrl(
            state,
            action: PayloadAction<{ index: number; url: string }>
        ) {
            const { index, url } = action.payload;
            if (state.voiceAgents[index]) {
                state.voiceAgents[index].audioUrls.push(url);
            }
        },
        removeVoiceAgentAudioUrl(
            state,
            action: PayloadAction<{ index: number; url: string }>
        ) {
            const { index, url } = action.payload;
            if (state.voiceAgents[index]) {
                state.voiceAgents[index].audioUrls = state.voiceAgents[index].audioUrls.filter(
                    (audioUrl) => audioUrl !== url
                );
            }
        },
    },
});

export const {
    addVoiceAgent,
    updateVoiceAgentName,
    updateVoiceAgentDescription,
    updateVoiceAgentPrompt,
    addVoiceAgentAudioUrl,
    removeVoiceAgentAudioUrl,
} = voiceAgentsSlice.actions;

export default voiceAgentsSlice.reducer;
