import { RecordType } from ".";
import { Contact } from "./contact.model";
import { CompleteTemplate } from "./template.model";

export interface Document {
  _id?: string;
  templateId: string;
  userId: string;
  contactId: string;
  createdAt: string;
  updatedAt: string;
  videoId?: string;
  recordType: RecordType;
  documentTranscript?: string;
}
export interface CompleteDocument {
  _id?: string;
  id?: string;
  templateId: CompleteTemplate;
  template?: CompleteTemplate;
  userId: string;
  contactId: string;
  createdAt: string;
  updatedAt: string;
  videoId?: string;
  recordType: RecordType;
  contact: Contact;
  contentResponses?: DocumentContentResponse[];
  documentTranscript?: string;
  summary?: string;
  actionItems?: string[];
  keyInsights?: string[];
}

interface DocumentContentBlock {
  _id: string;
  templateId: string;
  description: string;
  order: number;
  responseType: string;
  blockTitle: string;
  blockKey: string;
  optionIds: string[];
  userId: string;
}

export interface DocumentContentResponse {
  _id: string;
  documentId: string;
  contentBlockId: DocumentContentBlock;
  userId: string;
  contactId: string;
  answerText: string;
  selectedOptionIds: string[];
  isSingleSelect: boolean;
  sourceTimestamps?: number[];
}
