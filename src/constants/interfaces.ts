export interface ListResponse {
    itemList: News[];
    fullLength: number;
    length: number;
}
export interface News {
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
export interface NewsBase {
    headline: string;
    id: number | undefined;
    message: string;
    imageList: Array<string>;
    hidden: boolean | undefined;
    siteId: string;
    tappId: number;
}
export interface Parameters {
    M: string | boolean;
}