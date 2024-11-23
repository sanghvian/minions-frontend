import { RecordType } from ".";
import { Contact } from "./contact.model";

export interface Relationship {
    id?: string;
    userId: string;
    contactId: string;
    actionIds?: string[];
    relationshipContext: string;
    recordType: RecordType;
}


export interface CompleteRelationship extends Relationship {
    contact?: Partial<Contact>
}