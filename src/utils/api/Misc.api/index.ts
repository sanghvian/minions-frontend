import { Contact } from "@models/contact.model";
import { callApi } from "../api-service";

export const createAuthTokens = async (code: string) => {
    return await callApi({
        method: "POST",
        url: `/create-tokens`,
        requestBody: { code },
        serializerFunc: (r: { data: any }) => r.data
    });
};

export const callViaVoiceAgent = async ({
    phoneNumber,
    customerName,
    loanAmount,
    language
}: {
    phoneNumber: string, customerName: string, loanAmount: string
    language: string
}) => {
    return await callApi({
        method: "POST",
        url: `/voiceCalling/call`,
        requestBody: {
            phoneNumber,
            customerName,
            loanAmount,
            language
        },
        serializerFunc: (r: { data: any }) => r.data // Adjust the serializer function based on your response structure
    });
};


export const callFunction = async (
    { query, contactId, userId, token }
        : { query: string, contactId: string, userId: string, token: string }) => {
    return await callApi({
        method: "POST",
        url: `/call/${userId}`,
        requestBody: { query, contactId },
        accessToken: token,
        serializerFunc: (r: { data: any }) => r.data
    });
}

export const sendEmail = async (
    { contact, noteString, token, senderIntro }
        : { contact: Partial<Contact>, noteString: string, senderIntro: string, token: string }) => {
    return await callApi({
        method: "POST",
        url: `/email/send-email`,
        requestBody: { contact, note: noteString, senderIntro },
        accessToken: token,
        serializerFunc: (r: { data: any }) => r.data
    });
}

export const sendEmailForVideo = async (
    { contact, transcript, token }
        : { contact: Partial<Contact>, transcript: string, token: string }) => {
    return await callApi({
        method: "POST",
        url: `/email/send-vc-email`,
        requestBody: { contact, transcript: transcript },
        accessToken: token,
        serializerFunc: (r: { data: any }) => r.data
    });
}