import { ResponseContentBlock } from "@models/contentBlock.model";
import { CompleteContentResponse } from "@models/contentResponse.model";
import { callApi } from "@utils/api/api-service"; // Assuming callApi is a generic API calling utility

export const getMiroAccessToken = async ({ code }: { code: string; }) => {
    return await callApi({
        method: "POST",
        url: `/integrations/miro/get-access-token`,
        requestBody: { code },
        serializerFunc: (r: { data: any }) => r.data, // Adjust the serializer function based on your response structure
    });
};

export const createBoardAndStickies = async ({ contentBlock, contentResponses, miroAccessToken }: {
    contentBlock: ResponseContentBlock;
    contentResponses: CompleteContentResponse[];
    miroAccessToken: string;
}) => {
    return await callApi({
        method: "POST",
        url: `/integrations/miro/create-board-and-stickies`,
        requestBody: { contentBlock, contentResponses, miroAccessToken },
        serializerFunc: (r: { data: any }) => r.data, // Adjust the serializer function based on your response structure
    });
}