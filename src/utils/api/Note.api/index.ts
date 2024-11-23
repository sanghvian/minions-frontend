import { Note } from "@models/note.model";
import { callApi } from "@utils/api/api-service";

export const createNote = async (note: Partial<Note>, doCacheNote: boolean = false, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/notes/${userId}`,
        accessToken,
        requestBody: { note, doCacheNote },
        serializerFunc: (r: { data: Note }) => r.data
    });
};

export const getNote = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/notes/${userId}/${id}`,
        accessToken,
        serializerFunc: (r: { data: Note }) => r.data
    });
};

export const getRecentNotes = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/notes`,
        requestBody: { userId },
        accessToken,
        serializerFunc: (r: { data: Note[] }) => r.data
    });
}

export const updateNote = async (id: string, note: Partial<Note>, userId: string, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/notes/${userId}/${id}`,
        accessToken,
        requestBody: note,
        serializerFunc: (r: { data: Note }) => r.data
    });
};


export const deleteCachedNote = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/notes/deleteCachedNote`,
        accessToken,
        requestBody: { noteId: id, userId },
        serializerFunc: () => { }
    });
}

export const deleteNote = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/notes/${userId}/${id}`,
        accessToken,
        serializerFunc: () => { }
    });
};

export const getMultipleNotes = async (noteIds: string[], userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/notes/${userId}/getNotes`,
        accessToken,
        requestBody: { noteIds },
        serializerFunc: (r: { data: Note[] }) => r.data
    });
};

export const syncNoteToCRM = async (note: Note, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/notes/syncNoteToCRM`,
        accessToken,
        requestBody: { note },
        serializerFunc: (r: { data: Note }) => (r.data)
    })
}

export const syncStructuredNoteToCRM = async (note: Note, doCacheNote: boolean = false, templateId: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/notes/syncStructuredNoteToCRM`,
        accessToken,
        requestBody: { note, templateId, userId, doCacheNote },
        serializerFunc: (r: { data: Note }) => (r.data)
    })
}

export const structureNote = async ({
    note,
    templateId,
    userId,
    accessToken
}: {
    note: Note,
    templateId: string,
    userId: string,
    accessToken: string
}) => {
    return await callApi({
        method: "PUT",
        url: `/notes/structureNote`,
        accessToken,
        requestBody: { note, templateId, userId },
        serializerFunc: (r: { data: Note }) => (r.data)
    })
}

export const
    syncSNoteToCRM = async ({
        structuredNote,
        note,
        filters,
        templateId,
        userId,
        accessToken,
        documentId
    }: {
        structuredNote: { [key: string]: string },
        note: Note,
        filters: {
            doCacheNote?: boolean,
            doSyncToHubspot?: boolean,
            doSyncToSalesforce?: boolean
            doSyncToSheet?: boolean
        },
        templateId: string,
        userId: string,
        documentId: string,
        accessToken: string
    }) => {
        return await callApi({
            method: "PUT",
            url: `/notes/structureSNote`,
            accessToken,
            requestBody: {
                note,
                templateId,
                userId,
                structuredNote,
                filters,
                documentId
            },
            serializerFunc: (r: { data: Note }) => (r.data)
        })
    }