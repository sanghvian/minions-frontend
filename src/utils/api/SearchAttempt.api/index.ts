import { SearchAttempt } from "@models/searchAttempt.model";
import { callApi } from "../api-service";

export const updateSearchAttempt = async (searchId: string, searchAttempt: SearchAttempt) => {
    return await callApi({
        method: "PUT",
        url: `/search/${searchId}`,
        requestBody: { searchAttempt },
        serializerFunc: (r: { data: any }) => r.data
    });
};

export const recommendInUserNetwork = async (searchReq: { query: string, userId: string, userUUID: string, accessToken: string }) => {
    const { query, userId, userUUID, accessToken } = searchReq;
    return await callApi({
        method: "POST",
        url: `/search/${userId}/contactsSearch`,
        accessToken,
        requestBody: { query, userUUID },
        serializerFunc: (r: { data: any }) => r.data
    });
};

export const chatInUserNetwork = async (searchReq: { query: string, chatHistory: string, userId: string, userUUID: string, accessToken: string }) => {
    const { query, userId, userUUID, accessToken, chatHistory } = searchReq;
    return await callApi({
        method: "POST",
        url: `/search/${userId}/chatSearch`,
        accessToken,
        requestBody: { query, userUUID, chatHistory },
        serializerFunc: (r: { data: any }) => r.data
    });
};

export const searchInUserNetwork = async (query: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/search/${userId}/search`,
        accessToken,
        requestBody: { query },
        serializerFunc: (r: { data: any }) => r.data
    });
};

export const onlineSearch = async (query: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/search/${userId}/onlineSearch`,
        accessToken,
        requestBody: { query },
        serializerFunc: (r: { data: any }) => r.data
    });
};

export const imageSearch = async (imageUrl: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/search/${userId}/imageSearch`,
        accessToken,
        requestBody: { imageUrl },
        serializerFunc: (r: { data: any }) => r.data
    });
};
