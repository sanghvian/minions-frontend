
export interface AudioTranscript {
    _id?: string;
    documentId: string;
    userId: string;
    recordingBlobUrl: string;
    transcriptText: string;
    createdAt: string;
}