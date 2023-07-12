import { News } from './interfaces';

export type AddNewsEntryProps = {
    activeBackend: number;
    fetchNews: ({ shouldLoadMore }: { shouldLoadMore?: boolean | undefined }) => Promise<void>;
};
export type DeveloperToolsProps = {
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
    newsElement: News;
    activeBackend: number;
    fetchNews: ({ shouldLoadMore }: { shouldLoadMore?: boolean | undefined }) => Promise<void>;
};
export type NewsListProps = {
    news: Array<News>;
    activeBackend: number;
    fetchNews: ({ shouldLoadMore }: { shouldLoadMore?: boolean | undefined }) => Promise<void>;
};
export type EditNewsEntryProps = {
    id: number;
    onPublish: () => void;
    initMessage: string;
    initTitle: string;
    initImageList: Array<string>;
    initIsHidden: boolean;
    activeBackend: number;
};