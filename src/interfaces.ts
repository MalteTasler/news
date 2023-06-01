export interface INewsEntry {
    publishTimestamp: string | number;
}
export interface IItem {
    publishTimestamp: string | number
}
export interface IResponse {
    body: {
        itemList: {
            headline: string;
            id: string;
            message: string;
            imageList: Array<string>;
            publishTime: string;
            publishTimestamp: number;
        }[]
    };
}
export interface INews {
    headline: string;
        id: string;
        message: string;
        imageList: Array<string>;
        publishTime: string;
        publishTimestamp: number;
}