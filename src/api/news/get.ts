import { getAccessToken } from "chayns-api";

interface GetNewsOptions {
    fetchUrlWithParameters: string;
}

export const getNews = async (
    { fetchUrlWithParameters } : GetNewsOptions
): Promise<Response> => {
    const { accessToken } = await getAccessToken();
    
    return fetch(fetchUrlWithParameters, {
        headers: {
            Authorization: `bearer ${accessToken || ""}`,
        },
    });
}