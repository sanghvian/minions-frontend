import { Option } from "@models/option.model";
import { callApi } from "@utils/api/api-service";

export const createOption = async (option: Partial<Option>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: `/options`,
        accessToken,
        requestBody: option,
        serializerFunc: (r: { data: Option }) => r.data
    });
};

export const getOption = async (id: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/options/${id}`,
        accessToken,
        serializerFunc: (r: { data: Option }) => r.data
    });
};

export const updateOption = async (id: string, option: Partial<Option>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/options/${id}`,
        accessToken,
        requestBody: option,
        serializerFunc: (r: { data: Option }) => r.data
    });
};

export const deleteOption = async (id: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/options/${id}`,
        accessToken,
        serializerFunc: () => { }
    });
};

export const getAllOptionsByContentBlock = async (contentBlockId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/options/byContentBlock/${contentBlockId}`,
        accessToken,
        serializerFunc: (r: { data: Option[] }) => r.data
    });
};
