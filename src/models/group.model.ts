import { RecordType } from ".";
import { Contact } from "./contact.model";

export interface Group {
    id: string;
    contactIds: string[];
    name: string;
    description: string;
    recordType: RecordType;
    // Storing the timestamp while creating groups so that we can make recommendations accordingly
    timestamp?: string
}

export interface CompleteGroup extends Group {
    contacts: Contact[]
}