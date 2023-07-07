import { INews, INewsBase } from "./interfaces";

export type AddNewsEntryProps = {
    siteId: string;
    tappId: number;
    onPublish: (data: INewsBase) => void;
    now: Date;
};
export type DeveloperToolsProps = {
    siteId: string;
    tappId: number;
    numberOfDisplayedNews: number;
    numberOfFetchedNews: number;
    numberOfDatabaseNews: number;
    numberOfDatabaseUnhiddenNews: number;
    showNews: boolean;
    cbShowNewsOnChange: (value: boolean) => void;
    useBackend: number;
    setUseBackend: (value: number) => void;
}
export type FooterProps = {
    date: string;
    dateAbsolute: string;
    id: number;
}
export type NewsEntryProps = {
    id: number;
    siteId: string;
    tappId: number;
    title: string;
    message: string;
    imageList: Array<string>;
    publishTime: string;
    publishTimestamp: number;
    onPatch: (data: INewsBase) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    now: Date;
    hidden: boolean;
}
export type NewsListProps = {
    siteId: string;
    tappId: number;
    news: Array<INews>;
    now: Date;
    onPatch: (data: INewsBase) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}
export type EditNewsEntryProps = {
    id: number;
    siteId: string;
    tappId: number;
    onPublish: (data: INewsBase) => void;
    now: Date;
    initMessage: string;
    initTitle: string;
    initImageList: Array<string>;
    initIsHidden: boolean;
}
export type ContextMenuItem = {
    className: string | null | undefined;
    onClick: (() => void | Promise<void> | void);
    text: string;
    icon: string;
}