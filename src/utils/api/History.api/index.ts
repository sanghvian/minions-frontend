import { History } from "@models/history.model";
import { callApi } from "@utils/api/api-service";

export const getHistory = async (id: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/history/${id}`,
        accessToken,
        serializerFunc: (r: { data: History }) => r.data
    });
};

export const createHistory = async (history: Partial<History>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/history`,
        accessToken,
        requestBody: history,
        serializerFunc: (r: { data: History }) => r.data
    });
};

export const updateHistory = async (id: string, history: Partial<History>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/history/${id}`,
        accessToken,
        requestBody: history,
        serializerFunc: (r: { data: History }) => r.data
    });
};

export const deleteHistory = async (id: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/history/${id}`,
        accessToken,
        serializerFunc: () => { }
    });
};