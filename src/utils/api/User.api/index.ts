import { User } from "@models/user.model";
import { callApi } from "@utils/api/api-service";


// ? Basic CRUD APIs
export const getUserByEmail = async (email: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/users/${email}`,
        accessToken,
        serializerFunc: (r: { data: User }) => r.data
    });
};

export const getUser = async (email: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "GET",
        url: `/users/${email}/${userId}`,
        accessToken,
        serializerFunc: (r: { data: User }) => r.data
    });
};

export const createUser = async (user: Partial<User>, accessToken: string) => {
    return await callApi({
        method: "POST",
        url: "/users",
        accessToken,
        requestBody: user,
        serializerFunc: (r: { data: User }) => r.data
    });
};

export const updateUserByEmailOrCreate = async (email: string, userCreationData: Partial<User>, accessToken: string) => {
    let user;
    try {
        // Try to get the user by email
        user = await callApi({
            method: "GET",
            url: `/users/${email}`,
            accessToken,
            serializerFunc: (r: { data: User }) => r.data
        });
        // TODO: Tempcode to just ensure all users have the UPDATED refreshToken set on logging in
        if (user) {
            user = await updateUser(email, user.id, { token: accessToken }, accessToken);
        }


    } catch (error: any) {
        // If user is not found, create a new one
        if (error?.response?.status === 404 || error.message.includes("404")) {
            user = await callApi({
                method: "POST",
                url: "/users",
                accessToken,
                requestBody: userCreationData,
                serializerFunc: (r: { data: User }) => r.data
            });
        } else {
            // If the error is not a 404, rethrow it
            throw error;
        }
    }
    return user;
};

export const updateUser = async (email: string, userId: string, user: Partial<User>, accessToken: string) => {
    return await callApi({
        method: "PUT",
        url: `/users/${email}/${userId}`,
        accessToken,
        requestBody: user,
        serializerFunc: (r: { data: User }) => r.data
    });
};


export const updateUserActionsCount = async ({ email, userId, usageCount, accessToken }: { email: string, userId: string, usageCount: number, accessToken: string }) => {
    return await callApi({
        method: "PUT",
        url: `/users/${email}/${userId}`,
        accessToken,
        requestBody: { usageCount },
        serializerFunc: (r: { data: User }) => r.data
    });
}

export const deleteUser = async (email: string, userId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/users/${email}/${userId}`,
        accessToken,
        serializerFunc: () => { }
    });
};


// ? Advanced and 3rd party APIs
export const deleteUserByFilter = async (filterObject: any, userId: string, accessToken: string) => {
    return await callApi({
        method: "DELETE",
        url: `/users/${userId}/deleteByFilter`,
        accessToken,
        requestBody: filterObject,
        serializerFunc: () => { }
    });
};

