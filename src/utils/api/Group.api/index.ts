import { Group } from "@models/group.model";
import { callApi } from "@utils/api/api-service";

export const createGroup = async (group: Partial<Group>, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/groups/${userId}`,
        accessToken,
        requestBody: group,
        serializerFunc: (r: { data: Group }) => r.data
    });
};

export const getGroup = async (groupId: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/groups/${userId}/${groupId}`,
        accessToken,
        serializerFunc: (r: { data: Group }) => r.data
    });
};

export const updateGroup = async (groupId: string, group: Partial<Group>, userId: string, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/groups/${userId}/${groupId}`,
        accessToken,
        requestBody: group,
        serializerFunc: (r: { data: Group }) => r.data
    });
};

export const deleteGroup = async (groupId: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/groups/${userId}/${groupId}`,
        accessToken,
        serializerFunc: () => { }
    });
};

export const getAllUserGroups = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/groups/${userId}`,
        accessToken,
        serializerFunc: (r: { data: Group[] }) => r.data
    });
};
