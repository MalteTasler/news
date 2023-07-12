import { getAccessToken } from 'chayns-api';

interface NewsBase {
    headline: string;
    id: number | undefined;
    message: string;
    imageList: Array<string>;
    isHidden: boolean | undefined;
    siteId: string;
    tappId: number;
}

interface PatchNewsOptions {
    fetchUrlWithParameters: string;
    data: NewsBase;
}

export const patchNewsEntry = async (
    { 
        fetchUrlWithParameters,
        data
    } : PatchNewsOptions
): Promise<Response> => {
    const { accessToken } = await getAccessToken();

    return fetch(fetchUrlWithParameters, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `bearer ${accessToken || ""}`,
        },
    });
}