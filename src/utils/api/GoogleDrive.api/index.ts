import { VideoLanguage } from "@models/video.model";
import { callApi } from "@utils/api/api-service"; // Assuming callApi is a generic API calling utility


// Function to fetch combined Google Drive files
export const fetchCombinedGDriveFiles = async ({
    refreshToken,
    userId,
    options,
}: {
    refreshToken: string,
    userId: string,
    options: { [key: string]: any },
}) => {
    return await callApi({
        method: "POST",
        url: `/integrations/gdrive/fetchCombinedGDriveFiles`,
        requestBody: { refreshToken, userId, options },
        serializerFunc: (r: { data: any }) => r.data // Adjust the serializer function based on your response structure
    });
};

// Function to transcribe selected files from Google Drive
export const transcribeSelectedGDriveFiles = async ({
    refreshToken,
    fileIds,
}: {
    refreshToken: string,
    fileIds: string[],
}) => {
    return await callApi({
        method: "POST",
        url: `/integrations/gdrive/transcribeSelectedFiles`,
        requestBody: { refreshToken, fileIds },
        serializerFunc: (r: { data: any }) => r.data // Adjust the serializer function based on your response structure
    });
};

// Function to transcribe selected files from Google Drive
export const transcribeGDriveVideo = async ({
    refreshToken,
    fileId,
    language
}: {
    refreshToken: string,
        fileId: string,
    language:VideoLanguage
}) => {
    return await callApi({
      method: "POST",
      url: `/integrations/gdrive/transcribeGDriveVideo`,
      requestBody: { refreshToken, fileId, language },
      serializerFunc: (r: { data: any }) => r.data, // Adjust the serializer function based on your response structure
    });
};

// Function to fetch content from Google Drive file
export const fetchContentFromGoogleDriveFile = async ({
  refreshToken,
  fileId,
}: {
  refreshToken: string;
  fileId: string;
}) => {
  return await callApi({
    method: "POST",
    url: `/integrations/gdrive/fetchContentFromGoogleDriveFile`,
    requestBody: { refreshToken, fileId },
    serializerFunc: (r: { data: any }) => r.data, // Adjust the serializer function based on your response structure
  });
};
