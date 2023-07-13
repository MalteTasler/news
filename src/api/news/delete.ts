import { getAccessToken } from 'chayns-api';

interface DeleteNewsOptions {
    fetchUrlWithParameters: string;
}

export const deleteNewsEntry = async ({
    fetchUrlWithParameters,
}: DeleteNewsOptions): Promise<Response> => {
    const { accessToken } = await getAccessToken();

    return fetch(fetchUrlWithParameters, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `bearer ${accessToken || ''}`,
        },
    });
};
