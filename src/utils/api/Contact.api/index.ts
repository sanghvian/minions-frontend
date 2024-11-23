import { Contact } from "@models/contact.model"
import { callApi } from "@utils/api/api-service"

export const createContact = async (contact: Partial<Contact>, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/contacts/${userId}`,
        accessToken,
        requestBody: contact,
        serializerFunc: (r: { data: Contact }) => (r.data)
    })
}

export const getContact = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/contacts/${userId}/${id}`,
        accessToken,
        serializerFunc: (r: { data: Contact[] }) => (r.data)
    })
}

export const syncContactToCRM = async (contact: Contact, userId: string, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/contacts/syncContactToCRM`,
        accessToken,
        requestBody: { contact, userId },
        serializerFunc: (r: { data: Contact }) => (r.data)
    })
}

export const searchContact = async (searchText: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/contacts/${userId}/searchContacts`,
        requestBody: { searchText },
        accessToken,
        serializerFunc: (r: { data: Contact[] }) => (r.data)
    })
}

export const getContactByLinkedinContactId = async (linkedinContactId: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/contacts/byLinkedinContactId/${userId}/${linkedinContactId}`,
        accessToken,
        serializerFunc: (r: { data: Contact }) => (r.data)
    })
}

export const updateContact = async (id: string, contact: Partial<Contact>, userId: string, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/contacts/${userId}/${id}`,
        accessToken,
        requestBody: contact,
        serializerFunc: (r: { data: Contact }) => (r.data)
    })
}

export const deleteContact = async (id: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/contacts/${userId}/${id}`,
        accessToken,
        serializerFunc: () => { }
    })
}

export const getAllUserContacts = async (userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/contacts/${userId}`,
        accessToken,
        serializerFunc: (r: { data: Contact[] }) => (r.data)
    })
}