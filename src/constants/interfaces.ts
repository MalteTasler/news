export interface ListResponse {
    itemList: News[];
    fullLength: number;
    length: number;
}
export interface News {
    headline: string;
    id: number;
    siteId: string;
    tappId: number;
    message: string;
    imageList: Array<string>;
    publishTime: string;
    publishTimestamp: number;
    isHidden: boolean;
}