export interface IResponse {
    headline: string;
    id: string;
    message: string;
    imageList: Array<string>;
    publishTime: string;
    publishTimestamp: number;
}
export interface INews {
    headline: string;
    id: string | undefined;
    message: string;
    imageList: Array<string>;
    publishTime: string;
    publishTimestamp: number;
}