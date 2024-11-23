import { Template } from "@models/template.model";
import { callApi } from "@utils/api/api-service";

export const createTemplate = async (template: Partial<Template>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/templates`,
        accessToken,
        requestBody: template,
        serializerFunc: (r: { data: Template }) => r.data
    });
};

export const getTemplate = async (templateId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/templates/${templateId}`,
        accessToken,
        serializerFunc: (r: { data: Template }) => r.data
    });
};

export const updateTemplate = async (templateId: string, template: Partial<Template>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/templates/${templateId}`,
        accessToken,
        requestBody: template,
        serializerFunc: (r: { data: Template }) => r.data
    });
};

export const deleteTemplate = async (templateId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/templates/${templateId}`,
        accessToken,
        serializerFunc: () => { }
    });
};

export const getAllUserTemplates = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/templates/all/${userId}`,
        accessToken,
        serializerFunc: (r: { data: Template[] }) => r.data
    });
};

export const getFullTemplate = async (templateId: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/templates/getFullTemplate/${templateId}`,
        accessToken,
        requestBody: { userId }, // Assuming you need to send userId in body. If it's a query param, adjust accordingly.
        serializerFunc: (r: { data: Template }) => r.data
    });
};

export const fillTemplate = async ({
    templateId,
    text,
    userId,
    recontactUserName,
    accessToken
}: { templateId: string, text: string, userId: string, recontactUserName: string, accessToken: string }) => {
    try {
        return await callApi({
            method: "POST",
            url: `/templates/fillTemplate/${templateId}`,
            accessToken,
            requestBody: { text, userId, recontactUserName },
            serializerFunc: (r: { data: any }) => r.data // Replace 'any' with the actual expected type
        })
    } catch (error: any) {
        // console.log(error.message)
        throw new Error(`Unable to fill template: ${error.message}`)
    };
};
