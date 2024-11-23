import { RecordType } from ".";
import { CompleteLinkedinContact } from "./linkedinContact.model";

export interface User {
    id?: string;
    email: string
    name?: string;
    photoURL?: string;


    biography?: string;
    interests?: string[];
    occupation?: string;
    organization_name?: string;
    location?: string;
    phone?: string;

    token: string
    calendarId?: string
    subscriptionExpiryDate?: string
    status?: UserStatus;
    recordType?: RecordType;

    linkedinContactId?: string;


    // For token information obtained from authenticating with a CRM
    tokenInfo?: any

    // For storing user action count
    usageCount?: number

    // For connecting to external systems
    ownerId?: string
    spreadsheetId?: string
    firefliesApiKey?: string
    notionApiKey?: string
    notionPageId?: string
    miroAccessToken?: string
    currentVideoTime?: number
}


export interface CompleteUser extends User {
    linkedinContact?: CompleteLinkedinContact,
    activeUserEmail?: string
    activeTopicId?: string
}

export enum UserStatus {
    UNAUTHENTICATED = "UNAUTHENTICATED",
    UNSUBSCRIBED = "UNSUBSCRIBED",
    SUBSCRIBED = "SUBSCRIBED"
}