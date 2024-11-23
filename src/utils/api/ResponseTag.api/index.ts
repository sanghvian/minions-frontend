import { ResponseTag } from "@models/responseTag.model"; // Adjust the import path according to your project structure
import { callApi } from "@utils/api/api-service";

export const getResponseTags = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/responseTags?userId=${userId}`,
        accessToken,
        serializerFunc: (r: { data: ResponseTag[] }) => r.data
    });
};

export const getResponseTag = async (id: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/responseTags/${id}`,
        accessToken,
        serializerFunc: (r: { data: ResponseTag }) => r.data
    });
};

export const suggestResponseTags = async ({ userId, responseId }: { userId: string, responseId: string }, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/responseTags/suggest`,
        accessToken,
        requestBody: { userId, responseId },
        serializerFunc: (r: { data: ResponseTag[] }) => r.data
    });
};

export const createSuggestedResponseTags = async ({ userId, responseId }: { userId: string, responseId: string }, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/responseTags/suggestAndCreate`,
        accessToken,
        requestBody: { userId, responseId },
        serializerFunc: (r: { data: ResponseTag[] }) => r.data
    });
};

export const createResponseTag = async (responseTag: Partial<ResponseTag>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/responseTags`,
        accessToken,
        requestBody: responseTag,
        serializerFunc: (r: { data: ResponseTag }) => r.data
    });
};

export const updateResponseTag = async (id: string, responseTag: Partial<ResponseTag>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/responseTags/${id}`,
        accessToken,
        requestBody: responseTag,
        serializerFunc: (r: { data: ResponseTag }) => r.data
    });
};

export const deleteResponseTag = async (id: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/responseTags/${id}`,
        accessToken,
        serializerFunc: () => { }
    });
};
