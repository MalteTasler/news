export interface IResponse {
    headline: string;
    id: number;
    message: string;
    imageList: Array<string> | null;
    publishTime: string;
    publishTimestamp: number;
    hidden: boolean | undefined;
}
export interface IListResponse {
    itemList: INews[];
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
export interface IParameters {
    M: string | boolean
}