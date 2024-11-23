import { CompleteContentResponse } from "./contentResponse.model";
import { Option } from "./option.model";
import { CompleteResponseTag } from "./responseTag.model";
import { Tag } from "./tag.model";
import { Template } from "./template.model";

export interface ContentBlock {
    _id?: string;
    templateId: string;
    description: string;
    blockTitle: string;
    blockKey: string;
    order: number;
    userId: string;
    responseType: 'text' | 'number' | 'single-select' | 'multi-select';
    optionIds?: Option[];
}

export interface CompleteContentBlock extends ContentBlock {
    options?: Option[];
    template?: Template;
}

export interface ResponseContentBlock {
    _id?: string;
    templateId: Template;
    description: string;
    blockTitle: string;
    blockKey: string;
    order: number;
    userId: string;
    responseType: 'text' | 'number' | 'single-select' | 'multi-select';
    optionIds?: Option[];

    // Returning only number of contentResponses for the given contentBlock
    contentResponses?: CompleteContentResponse[];
    responseTags?: CompleteResponseTag[]
    tags?: Tag[];
    responseCount?: number;
}