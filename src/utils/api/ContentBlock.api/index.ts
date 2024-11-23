import { ContentBlock } from "@models/contentBlock.model";
import { callApi } from "@utils/api/api-service";

export const getContentBlock = async (contentBlockId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/contentBlocks/${contentBlockId}`,
        accessToken,
        serializerFunc: (r: { data: ContentBlock }) => r.data
    });
};

export const getContentBlocksForUser = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/contentBlocks/byUser/${userId}`,
        accessToken,
        serializerFunc: (r: { data: ContentBlock[] }) => r.data
    });
}

export const getPaginatedContentBlocksForUser = async (userId: string, accessToken: string, page: number, limit: number) => {
    return await callApi({
        method: "GET",
        url: `/contentBlocks/byUserPaginated/${userId}?page=${page}&limit=${limit}`,
        accessToken,
        serializerFunc: (r: { data: { contentBlocks: ContentBlock[], count: number } }) => r.data,
    });
};

export const getRandomContentBlockForUser = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/contentBlocks/randomContentBlock/${userId}`,
        accessToken,
        serializerFunc: (r: { data: ContentBlock }) => r.data
    });
}

export const getCompleteContentBlockWithResponses = async (contentBlockId: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/contentBlocks/completeContentBlockWithResponses`,
        accessToken,
        requestBody: { contentBlockId, userId },
        serializerFunc: (r: { data: ContentBlock }) => r.data
    });
}

export const analyzeContentBlockTheme = async (combinedResponsesString: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/contentBlocks/analyzeContentBlockTheme`,
        accessToken,
        requestBody: { combinedResponsesString },
        serializerFunc: (r: { data: string }) => r.data
    });
}

export const createContentBlock = async (contentBlock: Partial<ContentBlock>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/contentBlocks`,
        accessToken,
        requestBody: contentBlock,
        serializerFunc: (r: { data: ContentBlock }) => r.data
    });
};

export const updateContentBlock = async (contentBlockId: string, contentBlock: Partial<ContentBlock>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/contentBlocks/${contentBlockId}`,
        accessToken,
        requestBody: contentBlock,
        serializerFunc: (r: { data: ContentBlock }) => r.data
    });
};

export const deleteContentBlock = async (contentBlockId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/contentBlocks/${contentBlockId}`,
        accessToken,
        serializerFunc: () => { }
    });
};
