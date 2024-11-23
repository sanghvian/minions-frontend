import { Video, VideoProcessingStatus, VideoSource } from "@models/video.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface VideoInterface {
    activeVideo: Video,
    videosList: Video[]
}

export const initialVideoState: VideoInterface = {
    activeVideo: {
        _id: "",
        userId: "",
        videoUrl: "",
        name: "",
        transcriptText: "",
        createdAt: "",
        status: VideoProcessingStatus.PENDING,
        videoSource: VideoSource.USER_UPLOAD,
    },
    videosList: []
}

export const videoSlice = createSlice({
    name: "video",
    initialState: initialVideoState,
    reducers: {
        setActiveVideo(state: VideoInterface, action: PayloadAction<Video>) {
            state.activeVideo = action.payload
        }
        ,
        setVideosList(state: VideoInterface, action: PayloadAction<Video[]>) {
            // Ensure that all the videos inside action.payload are unique videos using Set
            const uniqueVideos = new Set(action.payload)
            state.videosList = Array.from(uniqueVideos)
        },
        addVideoToList(state: VideoInterface, action: PayloadAction<Video>) {
            state.videosList.push(action.payload)
        },
        removeVideoFromList(state: VideoInterface, action: PayloadAction<Video>) {
            state.videosList = state.videosList.filter((video) => video._id !== action.payload._id)
        }
    },
});

export const {
    setActiveVideo,
    setVideosList,
    addVideoToList,
    removeVideoFromList
} = videoSlice.actions;

export default videoSlice.reducer;
