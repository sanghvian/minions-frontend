import { Tag } from "@models/tag.model";
import { callApi } from "@utils/api/api-service";

export const getTag = async (id: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/tags/${id}`,
        accessToken,
        serializerFunc: (r: { data: Tag }) => r.data
    });
};

export const getTopicTags = async (userId: string, contentBlockId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/tags/getTopicTags`,
        accessToken,
        requestBody: { userId, contentBlockId },
        serializerFunc: (r: { data: Tag[] }) => r.data
    });
};

export const getAllTags = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/tags/getAllTags?userId=${userId}`,
        accessToken,
        serializerFunc: (r: { data: Tag[] }) => r.data
    });
};

export const createTag = async (tag: Partial<Tag>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/tags`,
        accessToken,
        requestBody: tag,
        serializerFunc: (r: { data: Tag }) => r.data
    });
};

export const updateTag = async (id: string, tag: Partial<Tag>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/tags/${id}`,
        accessToken,
        requestBody: tag,
        serializerFunc: (r: { data: Tag }) => r.data
    });
};

export const deleteTag = async (id: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/tags/${id}`,
        accessToken,
        serializerFunc: () => { }
    });
};
