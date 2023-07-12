import { getAccessToken } from 'chayns-api';

interface NewsBase {
    headline: string;
    id: number | undefined;
    message: string;
    imageList: Array<string>;
    hidden: boolean | undefined;
    siteId: string;
    tappId: number;
}

interface PostNewsOptions {
    fetchUrlWithParameters: string;
    data: NewsBase;
}

export const postNewsEntry = async (
    { 
        fetchUrlWithParameters,
        data
    } : PostNewsOptions
): Promise<Response> => {
    const { accessToken } = await getAccessToken();
    
    return fetch(fetchUrlWithParameters, {
        method: 'POST',
        body: JSON.stringify({
            siteId: data.siteId,
            tappId: data.tappId,
            imageList: data.imageList,
            headline: data.headline,
            message: data.message,
            hidden: data.hidden,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `bearer ${accessToken || ""}`,
        },
    });
}