import { RecordType } from ".";
import { Action } from "./action.model";
import { CompleteLinkedinContact } from "./linkedinContact.model";
import { Note } from "./note.model";
import { Relationship } from "./relationship.model";

export interface ContactResponse {
    biography: string;
    email: string;
    interests: string;
    location: string;
    name: string;
    occupation: string;
    organization_name: string;
    phone: string;
}


export interface Contact {
    id?: string;
    name: string;
    namespace: string;
    biography: string;
    headline?: string;
    email?: string;
    interests: string[];
    occupation: string;
    organization_name: string;
    location: string;
    phone?: string;
    recordType: RecordType;
    timestamp: string;
    noteIds: string[];
    relationshipId?: string,
    imgUrl?: string;
    linkedinContactId?: string,

    // Social URLs
    linkedinUrl?: string
    twitterUrl?: string
    instagramUrl?: string

    // Connecting to CRMs
    salesforceCrmId?: string
    hubspotCrmId?: string
    zohoCrmId?: string
    crmOwnerId?: string

}

export interface CompleteContact extends Contact {
    notes?: Note[],
    actions?: Action[],
    relationship?: Relationship
    linkedinContact?: CompleteLinkedinContact
}

export interface ContactOnlineSearchResult {
    title: string
    snippet: string
    link: string
    favicon?: string
    source?: string
    position?: number
}


// export interface Name {
//     givenName: string;
//     familyName: string;
// }

// export interface EmailAddress {
//     value: string;
// }

// export interface PhoneNumber {
//     value: string;
// }

// export interface Occupation {
//     value: string;
// }

// export interface Organization {
//     name: string;
//     title: string;
// }

// export interface Location {
//     value: string;
// }

// export interface EventDate {
//     year: number;
//     month: number;
//     day: number;
// }

// export interface Event {
//     type: string;
//     formattedType: string;
//     date: EventDate;
//     description: string;
// }

// export interface Biography {
//     value: string;
// }

// export interface Interest {
//     value: string;
// }

// export interface Contact {
//     names: Name[];
//     emailAddresses: EmailAddress[];
//     phoneNumbers: PhoneNumber[];
//     occupations: Occupation[];
//     organizations: Organization[];
//     locations: Location[];
//     events: Event[];
//     biographies: Biography[];
//     interests: Interest[];
//     onlineSearchResults: ContactOnlineSearchResult[];
// }

// export interface ContactV2 {
//     firstName: string;
//     lastName: string;
//     emailAddress: string;
//     phoneNumber: string;
//     occupation: string;
//     organization: string;
//     location: string;
//     event: string;
//     meetingDate: string;
//     biography: string;
//     interests: string[];
//     onlineSearchResults: ContactOnlineSearchResult[];
// }