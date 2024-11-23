import { RecordType } from ".";
import { Contact } from "./contact.model";
import { Relationship } from "./relationship.model";

export interface Action {
    id?: string;
    event: string;
    timestamp: string;
    action: string;
    relationshipId: string;
    actionLink: string;
    recordType: RecordType
    gcalEventId?: string;
    status: ActionStatus;
}

export enum ActionStatus {
    SCHEDULED = 'scheduled',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    RESCHEDULED = 'rescheduled'
}


export interface CompleteAction extends Action {
    relationship?: Partial<Relationship>
    contact?: Partial<Contact>
    contactId?: string
    contactName?: string
}