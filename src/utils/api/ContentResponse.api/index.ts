import { ContentResponse } from "@models/contentResponse.model";
import { callApi } from "@utils/api/api-service";

export const getContentResponse = async (contentResponseId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/contentResponses/${contentResponseId}`,
        accessToken,
        serializerFunc: (r: { data: ContentResponse }) => r.data
    });
};

export const createContentResponse = async (contentResponse: Partial<ContentResponse>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/contentResponses`,
        accessToken,
        requestBody: contentResponse,
        serializerFunc: (r: { data: ContentResponse }) => r.data
    });
};

export const updateContentResponse = async (contentResponseId: string, contentResponse: Partial<ContentResponse>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/contentResponses/${contentResponseId}`,
        accessToken,
        requestBody: contentResponse,
        serializerFunc: (r: { data: ContentResponse }) => r.data
    });
};

export const deleteContentResponse = async (contentResponseId: string, topicId:string, userId:string, accessToken: string) => {
    return await callApi({
      method: "DELETE",
      url: "/contentResponses",
      params: {
        contentResponseId: contentResponseId,
        topicId: topicId,
        userId: userId,
      },
      accessToken,
      serializerFunc: () => {},
    });
};
