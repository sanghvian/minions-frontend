import { RecordType } from ".";
import { Contact } from "./contact.model";

export interface Note {
    id?: string;
    contactId: string;
    content: string;
    timestamp: string;
    location: string;
    recordType: RecordType;
    // Optional fields for notes that are created from online data about a person
    noteSource?: string;
    noteFavicon?: string;

    // Connecting to CRMs
    salesforceCrmId?: string
    hubspotCrmId?: string
    zohoCrmId?: string
    crmOwnerId?: string
    salesforceCrmContactId?: string
    hubspotCrmContactId?: string
}

export interface CompleteNote extends Note {
    contact?: Partial<Contact>
}
