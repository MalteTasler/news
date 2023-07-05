import { INews } from "interfaces";

export const postNewsEntry = async(fetchUrlWithParameters: string, tobitAccessToken: string, data: INews) : Promise<Response> =>
    fetch(fetchUrlWithParameters , {
        method: "POST",
        body: JSON.stringify({
            siteId: data.siteId,
            tappId: data.tappId,
            imageList: data.imageList,
            headline: data.headline,
            message: data.message,
            publishTime: data.publishTime,
            publishTimestamp: data.publishTimestamp,
            hidden: data.hidden
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization" : `bearer ${tobitAccessToken}`
        }
    })