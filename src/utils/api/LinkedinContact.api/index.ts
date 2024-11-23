import { CompleteLinkedinContact, LinkedinContact } from "@models/linkedinContact.model";
import { callApi } from "@utils/api/api-service";

export const getLinkedinContact = async (id: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/linkedin/${id}`,
        accessToken,
        serializerFunc: (r: { data: LinkedinContact }) => r.data
    });
};

export const createLinkedinContact = async (linkedinContact: Partial<LinkedinContact>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/linkedin`,
        accessToken,
        requestBody: linkedinContact,
        serializerFunc: (r: { data: LinkedinContact }) => r.data
    });
};

export const enhanceContactLinkedin = async (linkedinUrl: string, contactId: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/linkedin/${userId}/enhanceContactLinkedin`,
        accessToken,
        requestBody: { linkedinUrl, contactId },
        serializerFunc: (r: { data: CompleteLinkedinContact }) => r.data
    });
};
export const enhanceUserLinkedin = async (linkedinUrl: string, userUUID: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/linkedin/${userId}/enhanceUserLinkedin`,
        accessToken,
        requestBody: { linkedinUrl, userUUID },
        serializerFunc: (r: { data: CompleteLinkedinContact }) => r.data
    });
};

export const updateLinkedinContact = async (id: string, linkedinContact: Partial<LinkedinContact>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/linkedin/${id}`,
        accessToken,
        requestBody: linkedinContact,
        serializerFunc: (r: { data: LinkedinContact }) => r.data
    });
};

export const deleteLinkedinContact = async (id: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/linkedin/${id}`,
        accessToken,
        serializerFunc: () => { }
    });
};

export const getLinkedinContactByLinkedinUrl = async (linkedinUrl: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/linkedin/byLinkedinUrl`,
        accessToken,
        requestBody: { linkedinUrl },
        serializerFunc: (r: { data: LinkedinContact }) => r.data
    });
};
