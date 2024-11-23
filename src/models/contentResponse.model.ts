import { RecordType } from ".";
import { Contact } from "./contact.model";
import { CompleteResponseTag, } from "./responseTag.model";

export interface ContentResponse {
    _id?: string;
    documentId: string;
    contentBlockId: string;
    userId: string;
    answerText: string;
    contactId: string;
    sourceTimestamps?: number[]
    // selectedOptionId: string;  // Assuming this is for single-select
}

interface ExtendedContentResponse extends ContentResponse {
    recordType: RecordType
}


export interface CompleteContentResponse extends ExtendedContentResponse {
    contact?: Contact;
    responseTags?: CompleteResponseTag[];
}

