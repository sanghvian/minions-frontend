import { RecordType } from ".";
import { CompleteLinkedinContact } from "./linkedinContact.model";

export interface History {
    id?: string;
    organization_name: string;
    organization_url?: string;
    occupation: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    info: string[];
    linkedinContactId: string;
    historyType: HistoryType;
    recordType: RecordType;
}

export enum HistoryType {
    WORK = "work",
    EDUCATION = "education",
    VOLUNTEER = "volunteer"
}

export interface CompleteHistory extends History {
    linkedinContact?: Partial<CompleteLinkedinContact>
}
