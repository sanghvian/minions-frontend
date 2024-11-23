import { Document, CompleteDocument } from "@models/document.model";
import { callApi } from "@utils/api/api-service";

export const getDocument = async (documentId: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/documents`,
        accessToken,
        params: { documentId: documentId, userId: userId },
        serializerFunc: (r: { data: Document }) => r.data,
    });
};

export const getDocumentsForUser = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/documents/getDocumentsForUser/${userId}`,
        accessToken,
        serializerFunc: (r: { data: CompleteDocument }) => r.data,
    });
};

export const getPaginatedDocumentsForUser = async (userId: string, accessToken: string, page: number, limit: number) => {
    return await callApi({
        method: "GET",
        url: `/documents/getPaginatedDocumentsForUser/${userId}?page=${page}&limit=${limit}`,
        accessToken,
        serializerFunc: (r: { data: { docs: CompleteDocument[], count: number } }) => r.data,
    });
};

export const getPaginatedDocumentsForUserForTemplate = async (userId: string, templateId: string, accessToken: string, page: number, limit: number) => {
    return await callApi({
        method: "GET",
        url: `/documents/getPaginatedDocumentsForUserForTemplate/${userId}/${templateId}?page=${page}&limit=${limit}`,
        accessToken,
        serializerFunc: (r: { data: { docs: CompleteDocument[], count: number } }) => r.data,
    });
};

export const getDocumentsForUserContact = async (userId: string, contactId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: "/documents/getDocumentsForContact",
        accessToken,
        requestBody: { userId: userId, contactId: contactId },
        serializerFunc: (r: { data: CompleteDocument }) => r.data,
    });
};

export const createDocument = async (document: Partial<Document>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/documents`,
        accessToken,
        requestBody: document,
        serializerFunc: (r: { data: Document }) => r.data
    });
};
export const structureTranscriptAndCreateDocument = async ({
    transcript,
    templateId,
    userId,
    videoId,
    contactId,
    accessToken,
    recontactUserName
}: {
    transcript: string,
    templateId: string,
    userId: string,
    videoId: string,
    contactId: string,
    accessToken: string,
    recontactUserName: string
}
) => {
    return await callApi({
        method: "POST",
        url: `/documents/structureTranscriptToDoc`,
        accessToken,
        requestBody: {
            transcript,
            templateId,
            userId,
            videoId,
            contactId,
            recontactUserName
        },
        serializerFunc: (r: { data: Document }) => r.data
    });
};
export const structureTranscriptAndCreateDocumentWithTimestamp = async ({
    transcript,
    transcriptSentences,
    templateId,
    userId,
    videoId,
    contactId,
    accessToken,
    recontactUserName
}: {
    transcript: string,
    transcriptSentences: {
        start: number,
        end: number,
        text: string,
        speaker: string
    }[],
    templateId: string,
    userId: string,
    videoId: string,
    contactId: string,
    accessToken: string,
    recontactUserName: string
}
) => {
    return await callApi({
        method: "POST",
        url: `/documents/structureTranscriptToDocWithTimestamp`,
        accessToken,
        requestBody: {
            transcript,
            transcriptSentences,
            templateId,
            userId,
            videoId,
            contactId,
            recontactUserName
        },
        serializerFunc: (r: { data: Document }) => r.data
    });
};

export const processStructuredNoteIntoDoc = async ({
    structuredNote,
    userId,
    templateId,
    contactId,
    accessToken,
    filters,
    documentId
}: {
    structuredNote: string,
    userId: string,
    templateId: string,
    contactId: string,
    accessToken: string,
    filters: {
        doSyncToSheet?: boolean
    },
    documentId: string
}) => {
    return await callApi({
        method: "POST",
        url: `/documents/processStructuredNoteIntoDoc`,
        accessToken,
        requestBody: {
            structuredNote,
            userId,
            templateId,
            contactId,
            filters,
            documentId
        },
        serializerFunc: (r: { data: Document }) => r.data
    });
}

export const updateDocument = async (documentId: string, document: Partial<Document>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/documents/${documentId}`,
        accessToken,
        requestBody: document,
        serializerFunc: (r: { data: Document }) => r.data
    });
};

export const deleteDocument = async (
    { documentId, userId, accessToken }
        : { documentId: string, userId: string, accessToken: string }) => {
    return await callApi({
        method: "DELETE",
        url: `/documents/${documentId}`,
        requestBody: { userId },
        accessToken,
        serializerFunc: () => { }
    });
};


export const generateDocumentSummary = async (documentId: string, documentTranscript: string) => {
    return await callApi({
        method: "POST",
        url: `/documents/summarizeDocument`,
        requestBody: { documentId, documentTranscript },
        serializerFunc: (r: { data: string }) => r.data,
    });
}