export interface IResponse {
    headline: string;
    id: string;
    message: string;
    imageList: Array<string> | null;
    publishTime: string;
    publishTimestamp: number;
    hidden: boolean | undefined;
}
export interface IListResponse {
    itemList: IResponse[];
    length: number;
}
export interface INews {
    headline: string;
    id: string | undefined;
    message: string;
    imageList: Array<string>;
    publishTime: string;
    publishTimestamp: number;
    hidden: boolean | undefined;
}
export interface IParameters {
    M: string | boolean
}