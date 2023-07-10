import { INewsBase } from '../constants/interfaces';

export const postNewsEntry = async (
    fetchUrlWithParameters: string,
    tobitAccessToken: string,
    data: INewsBase
): Promise<Response> =>
    fetch(fetchUrlWithParameters, {
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
            Authorization: `bearer ${tobitAccessToken}`,
        },
    });
