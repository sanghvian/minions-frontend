import { Tag } from "./tag.model";

export interface ResponseTag {
    _id?: string;
    tagId: string;
    contentResponseId: string;
    userId: string;
}


export interface CompleteResponseTag {
    _id?: string;
    tagId: Tag;
    contentResponseId: string;
    userId: string;
}