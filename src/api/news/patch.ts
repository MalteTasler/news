import { getAccessToken } from 'chayns-api';
import { NewsBase } from '../../constants/interfaces';

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