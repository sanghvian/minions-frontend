import { callApi } from "@utils/api/api-service";
import { Video, VideoLanguage } from "@models/video.model";

export const transcribeVideo = async (
  videoUrl: string,
  language: string = VideoLanguage.ENGLISH,
  accessToken: string
) => {
  return await callApi({
    method: "POST",
    url: `/videos/transcribeVideo`,
    accessToken,
    requestBody: { videoUrl, language },
    serializerFunc: (r: { data: any }) => r.data, // Adapt the return type as needed
  });
};

export const getVideoTranscriptWithTimestamp = async (videoId: string, accessToken: string, transcribeVideo: boolean = false) => {
    return await callApi({
        method: "POST",
        url: `/videos/transcribeVideoWithTimestamp`,
        accessToken,
        requestBody: { videoId, transcribeVideo },
        serializerFunc: (r: { data: any }) => r.data, // Adapt the return type as needed
    });
}

export const getVideo = async (id: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/videos/${id}`,
        accessToken,
        serializerFunc: (r: { data: any }) => r.data // Adapt the return type as needed
    });
};

export const getVideoByUrl = async (videoUrl: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/videos/byUrl`,
        accessToken,
        requestBody: { videoUrl },
        serializerFunc: (r: { data: Video }) => r.data
    });
}

export const getAllUserVideos = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/videos/all/${userId}`,
        accessToken,
        serializerFunc: (r: { data: Video[] }) => r.data
    });
};

export const getAllUserUploadedVideos = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/videos/userUploaded/${userId}`,
        accessToken,
        serializerFunc: (r: { data: Video[] }) => r.data
    });
};

export const createVideo = async (videoData: Partial<Video>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: "/videos/",
        accessToken,
        requestBody: videoData,
        serializerFunc: (r: { data: any }) => r.data // Adapt the return type as needed
    });
};

export const updateVideo = async (id: string, videoData: Partial<Video>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/videos/${id}`,
        accessToken,
        requestBody: videoData,
        serializerFunc: (r: { data: any }) => r.data // Adapt the return type as needed
    });
};

export const deleteVideo = async (id: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/videos/${id}`,
        accessToken,
        serializerFunc: () => { } // No response data expected for delete operation
    });
};
