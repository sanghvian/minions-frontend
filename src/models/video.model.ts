export enum VideoProcessingStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export enum VideoSource {
  FIREFLIES_IMPORT = "FIREFLIES_IMPORT",
  USER_UPLOAD = "USER_UPLOAD",
  GOOGLE_DRIVE = "GOOGLE_DRIVE"
}

export enum VideoLanguage {
  ENGLISH = "en",
  HINDI = "hi",
  TAMIL = "ta",
}

export interface Video {
  _id?: string;
  userId: string;
  videoUrl: string;
  name: string;
  transcriptText?: string;
  timestampedTranscript?: any[];
  createdAt: string;
  status?: VideoProcessingStatus;
  videoSource: VideoSource;
  videoSourceId?: string;
  language?: string;
}