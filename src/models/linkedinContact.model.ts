import { RecordType } from ".";
import { History } from "./history.model";

export interface LinkedinContact {
    id?: string;
    historyIds: string[];
    name: string;
    location: string;
    organization_name: string; // Current organization name
    occupation: string; // Current occupation at the current organization
    recordType: RecordType;
    linkedinUrl: string;
    biography: string;
    headline?: string;
    description: string;

    // Optional, but we actually pass the contactId from the backend to the frontend so that when we get a searchResult in "AI Search" as a linkedinContact, we can link it back to a corresponding parent contact page. Even though on the backend we have linkedinContact setup as dissociated from contact entities, but on the frontend the linkedinContact only makes sense when shown connected to a contactId.
    contactId?: string;
}

export interface CompleteLinkedinContact extends LinkedinContact {
    histories?: History[];
}

export const LinkedinNamespace = "linkedins";

