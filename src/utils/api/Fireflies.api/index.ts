import { callApi } from "@utils/api/api-service"; // Assuming callApi is a generic API calling utility

export const fetchUserData = async ({ firefliesApiKey, userId }: { firefliesApiKey: string, userId?: string }) => {
    return await callApi({
        method: "POST",
        url: `/integrations/fireflies/user`,
        requestBody: { firefliesApiKey, userId },
        serializerFunc: (r: { data: any }) => r.data // Adjust the serializer function based on your response structure
    });
};

export const fetchTranscript = async ({ apiKey, transcriptId }: { apiKey: string, transcriptId: string }) => {
    return await callApi({
        method: "POST",
        url: `/integrations/fireflies/transcript`,
        requestBody: { firefliesApiKey: apiKey, transcriptId },
        serializerFunc: (r: { data: any }) => r.data // Adjust the serializer function based on your response structure
    });
};


// export const saveTranscript = async ({ apiKey, transcript }: { apiKey: string, transcript: any }) => {
//     return await callApi({
//         method: "POST",
//         url: `/integrations/fireflies/saveTranscript`,
//         requestBody: { firefliesApiKey: apiKey, transcript },
//         serializerFunc: (r: { data: any }) => r.data // Adjust the serializer function based on your response structure
//     });
// }

export const fetchTranscripts = async ({
    apiKey,
    userId,
    options,
}: {
    apiKey: string,
    userId: string,
    options: {
        title?: string,
        date?: number,
        limit?: number,
        skip?: number,
        hostEmail?: string,
        participantEmail?: string,
        userId?: string,
    }
}) => {
    return await callApi({
        method: "POST",
        url: `/integrations/fireflies/transcripts`,
        requestBody: { firefliesApiKey: apiKey, userId, ...options },
        serializerFunc: (r: { data: any[] }) => r.data // Assuming the response is an array of transcripts. Adjust as needed.
    });
};


export const fetchTimestampedTranscript = async ({
    firefliesApiKey,
    firefliesTranscriptId,
    videoId,
}: {
    firefliesApiKey: string;
    firefliesTranscriptId: string;
    videoId: string;
}) => {
    return await callApi({
        method: "POST",
        url: `/integrations/fireflies/timestampedTranscript`,
        requestBody: { firefliesApiKey, firefliesTranscriptId, videoId },
        serializerFunc: (r: { data: any }) => r.data, // Adjust the serializer function based on your response structure
    });
};