import { Action } from "@models/action.model";
import { Contact } from "@models/contact.model";
import { Relationship } from "@models/relationship.model";
import { User } from "@models/user.model";
import { callApi } from "@utils/api/api-service";

export const createRelationship = async (relationship: Partial<Relationship>, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/relationships/${userId}`,
        accessToken,
        requestBody: relationship,
        serializerFunc: (r: { data: Relationship }) => r.data
    });
};

export const getRelationship = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/relationships/${userId}/${id}`,
        accessToken,
        serializerFunc: (r: { data: Relationship }) => r.data
    });
};

export const updateRelationship = async (id: string, relationship: Partial<Relationship>, userId: string, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/relationships/${userId}/${id}`,
        accessToken,
        requestBody: relationship,
        serializerFunc: (r: { data: Relationship }) => r.data
    });
};

export const deleteRelationship = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/relationships/${userId}/${id}`,
        accessToken,
        serializerFunc: () => { }
    });
};

export const getAllUserRelationships = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/relationships/${userId}/getAllRelationships`,
        accessToken,
        serializerFunc: (r: { data: Relationship[] }) => r.data
    });
};

export const createRelationshipPlan = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/relationships/${userId}/${id}/createPlan`,
        accessToken,
        serializerFunc: (r: { data: any }) => r.data
    });
};
export const storeRAP = async (id: string, userId: string, body: {
    user: User,
    contact: Contact,
    finalActions: Partial<Action>[],
    suggestedActions: Partial<Action>[]
}, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/relationships/${userId}/${id}/storeRAP`,
        accessToken,
        requestBody: {
            user: body.user,
            contact: body.contact,
            finalActions: body.finalActions,
            suggestedActions: body.suggestedActions,
            refreshToken: accessToken
        },
        serializerFunc: (r: { data: any }) => r.data
    });
};
