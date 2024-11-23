import { callApi } from "@utils/api/api-service";

export const createSpreadsheet = async ({ title, accessToken }: { title: string, accessToken: string }) => {
    return await callApi({
        method: "POST",
        url: `/integrations/gsheets/createSpreadsheet`,
        accessToken,
        requestBody: { title, refreshToken: accessToken },
        serializerFunc: (r: {
            data: {
                spreadsheetId: string,
                properties: { [key: string]: string }
            }
        }) => r.data
    });
};

export const searchSpreadsheets = async ({ title, accessToken }: { title: string, accessToken: string }) => {
    return await callApi({
        method: "POST",
        url: `/integrations/gsheets/searchSpreadsheets`,
        accessToken,
        requestBody: { title, refreshToken: accessToken },
        serializerFunc: (r: {
            data: {
                spreadsheetId: string,
                properties: { [key: string]: string }
            }
        }) => r.data
    });
};

export const createTab = async ({ title, accessToken, spreadsheetId }: { title: string, accessToken: string, spreadsheetId: string }) => {
    return await callApi({
        method: "POST",
        url: `/integrations/gsheets/createTab`,
        accessToken,
        requestBody: { title, refreshToken: accessToken, spreadsheetId },
        serializerFunc: (r: { data: { spreadsheetId: string, replies: any[] } }) => r.data
    });
};

export const addRows = async ({
    sheetTitle, accessToken, spreadsheetId, values
}: {
    sheetTitle: string,
    accessToken: string,
    spreadsheetId: string,
    values: string[]
}) => {
    return await callApi({
        method: "POST",
        url: `/integrations/gsheets/addRows`,
        accessToken,
        requestBody: { sheetTitle, refreshToken: accessToken, spreadsheetId, values },
        serializerFunc: (r: {
            data:
            {
                spreadsheetId: string,
                replies: { [key: string]: string }
            }
        }) => r.data
    });
};
