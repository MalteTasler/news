export interface IListResponse {
    itemList: INews[];
    fullLength: number;
    length: number;
}
export interface INews {
    headline: string;
    id: number | undefined;
    siteId: string;
    tappId: number;
    message: string;
    imageList: Array<string>;
    publishTime: string;
    publishTimestamp: number;
    hidden: boolean | undefined;
}
export interface INewsBase {
    headline: string;
    id: number | undefined;
    message: string;
    imageList: Array<string>;
    hidden: boolean | undefined;
    siteId: string;
    tappId: number;
}
export interface IParameters {
    M: string | boolean;
}