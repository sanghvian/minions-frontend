import { callApi } from "@utils/api/api-service"; // Assuming callApi is a generic API calling utility

export const syncDocumentToNotion = async ({
  notionApiKey,
  notionPageId,
  pageTitle,
  documentContent,
  dateString,
  recontactDocumentUrl,
}: {
  notionApiKey: string;
  notionPageId: string;
  pageTitle: string;
  documentContent: any[];
  dateString: string;
    recontactDocumentUrl: string;
}) => {
  return await callApi({
    method: "POST",
    url: `/integrations/notion/newPage`,
    requestBody: { notionApiKey, notionPageId, pageTitle, documentContent, dateString, recontactDocumentUrl},
    serializerFunc: (r: { data: any }) => r.data, // Adjust the serializer function based on your response structure
  });
};
