import axios from 'axios';

export const performGoogleSearch = async (queryString: string, userId: string) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_BASE_URL}/search/${userId}/onlineSearch`, {
            query: queryString,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const results = response.data.organic_results// Here you can handle the response data
        return results;

    } catch (error) {
        console.error('An error occurred while performing the search:', error);
        throw error; // You might want to handle the error differently
    }
};