export interface Tag {
    _id?: string;
    name: string;
    description?: string;
    // Topic is actually the same as contentBlock
    contentBlockId: string;
    userId: string;

    // This is a field that is not in the model, but is used in the UI
    count?: number;
}