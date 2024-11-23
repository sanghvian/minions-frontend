import { ContentBlock } from "./contentBlock.model";

export interface Template {
    _id?: string;
    name: string;
    description: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CompleteTemplate extends Template {
    contentBlocks?: ContentBlock[];
}