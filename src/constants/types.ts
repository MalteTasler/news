import { News, NewsBase } from './interfaces';

export type AddNewsEntryProps = {
    siteId: string;
    tappId: number;
    onPublish: (object : {data: NewsBase}) => Promise<void>;
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
    activeBackend: number;
    setActiveBackend: (value: number) => void;
};
export type FooterProps = {
    date: string;
    dateAbsolute: string;
    id: number;
};
export type NewsEntryProps = {
    id: number;
    siteId: string;
    tappId: number;
    title: string;
    message: string;
    imageList: Array<string>;
    publishTime: string;
    publishTimestamp: number;
    onPatch: (object : {data: NewsBase}) => Promise<void>;
    onDelete: (object : {id: number}) => Promise<void>;
    hidden: boolean;
};
export type NewsListProps = {
    siteId: string;
    tappId: number;
    news: Array<News>;
    onPatch: (object : {data: NewsBase}) => Promise<void>;
    onDelete: (object: {id: number}) => Promise<void>;
};
export type EditNewsEntryProps = {
    id: number;
    siteId: string;
    tappId: number;
    onPublish: (object : {data: NewsBase}) => void;
    initMessage: string;
    initTitle: string;
    initImageList: Array<string>;
    initIsHidden: boolean;
};
export type ContextMenuItem = {
    className: string | null | undefined;
    onClick: () => void | Promise<void> | void;
    text: string;
    icon: string;
};