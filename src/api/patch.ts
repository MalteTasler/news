import { INews } from "interfaces";

export const patchNewsEntry = async(fetchUrlWithParameters: string, tobitAccessToken: string, data: INews) : Promise<Response> =>
    fetch(fetchUrlWithParameters , {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization" : `bearer ${tobitAccessToken}`
        }
    })