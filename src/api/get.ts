import { getAccessToken } from "chayns-api";

interface GetNewsOptions {
    fetchURLWithParameters: string;
}

export const getNews = async (
    {fetchURLWithParameters} : GetNewsOptions
): Promise<Response> => {
    const { accessToken } = await getAccessToken();
    
    return fetch(fetchURLWithParameters, {
        headers: {
            Authorization: `bearer ${accessToken || ""}`,
        },
    });
}
