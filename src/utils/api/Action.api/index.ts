import { Action } from "@models/action.model";
import { callApi } from "@utils/api/api-service";

export const createAction = async (action: Partial<Action>, userId: string, userUUID: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/actions/${userId}`,
        accessToken,
        requestBody: { ...action, refreshToken: accessToken, userUUID },
        serializerFunc: (r: { data: Action }) => r.data
    });
};

export const createActionFromText = async ({
    query,
    relationshipId,
    timestamp,
    userId,
    accessToken,
    userUUID,
    existingCalendarId
}: {
    query: string,
    relationshipId: string,
    timestamp: string,
    userId: string,
    accessToken: string,
    userUUID: string,
    existingCalendarId: string
}) => {
    return await callApi({
        method: "POST",
        url: `/actions/${userId}/createActionFromText`,
        accessToken,
        requestBody: {
            query, relationshipId, timestamp, refreshToken: accessToken,
            userUUID,
            existingCalendarId
        },
        serializerFunc: (r: { data: Action }) => r.data
    });
};

export const getAction = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/actions/${userId}/${id}`,
        accessToken,
        serializerFunc: (r: { data: Action }) => r.data
    });
};

export const updateAction = async (id: string, action: Partial<Action>, userId: string, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/actions/${userId}/${id}`,
        accessToken,
        requestBody: action,
        serializerFunc: (r: { data: Action }) => r.data
    });
};

export const deleteAction = async (id: string, userId: string, body: {
    eventId: string,
    calendarId: string,
    refreshToken: string,
}, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/actions/${userId}/${id}`,
        accessToken,
        requestBody: body,
        serializerFunc: () => { }
    });
};

export const getAllUserActions = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/actions/${userId}/getAllActions`,
        accessToken,
        serializerFunc: (r: { data: Action[] }) => r.data
    });
};

export const getUpcomingActions = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/actions/getActionsForFiveDays/${userId}`,
        accessToken,
        serializerFunc: (r: { data: Action[] }) => r.data
    });
};

export const getMultipleActions = async (actionIds: string[], userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/actions/${userId}/getActions`,
        accessToken,
        requestBody: { actionIds },
        serializerFunc: (r: { data: Action[] }) => r.data
    });
};

export const deleteActionsByFilter = async (filterObject: any, userId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/actions/${userId}/deleteByFilter`,
        accessToken,
        requestBody: filterObject,
        serializerFunc: () => { }
    });
};
