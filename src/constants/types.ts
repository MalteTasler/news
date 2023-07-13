import { News, NewsNumbers } from './interfaces';

export type AddNewsEntryProps = {
    activeBackend: number;
    loadNews: ({
        shouldLoadMore,
    }: {
        shouldLoadMore?: boolean | undefined;
    }) => Promise<void>;
};
export type AdminControlsProps = {
    newsNumbers: NewsNumbers;
    activeBackend: number;
    setActiveBackend: (value: number) => void;
    loadNews: ({
        shouldLoadMore,
    }: {
        shouldLoadMore?: boolean | undefined;
    }) => Promise<void>;
    shouldShowNews: boolean;
    setShowNews: (value: boolean) => void;
};
export type DeveloperToolsProps = {
    newsNumbers: NewsNumbers;
    showNews: boolean;
    setShowNews: (value: boolean) => void;
    activeBackend: number;
    setActiveBackend: (value: number) => void;
};
export type EditNewsEntryProps = {
    id: number;
    onPublish: () => Promise<void>;
    initMessage: string;
    initTitle: string;
    initImageList: Array<string>;
    initIsHidden: boolean;
    activeBackend: number;
};
export type FooterProps = {
    date: string;
    dateAbsolute: string;
    id: number;
};
export type HeaderProps = {
    id: number;
    isHidden: boolean;
    isEditMode: boolean;
    activeBackend: number;
    setEditMode: (value: boolean) => void;
    handleHide: ({
        shouldBeHidden,
    }: {
        shouldBeHidden: boolean;
    }) => Promise<void>;
    loadNews: ({
        shouldLoadMore,
    }: {
        shouldLoadMore?: boolean | undefined;
    }) => Promise<void>;
};
export type MainProps = {
    newsElement: News;
    activeBackend: number;
    isEditMode: boolean;
    handlePublish: () => Promise<void>;
};
export type NewsEntryProps = {
    newsElement: News;
    activeBackend: number;
    loadNews: ({
        shouldLoadMore,
    }: {
        shouldLoadMore?: boolean | undefined;
    }) => Promise<void>;
};
export type NewsListProps = {
    news: Array<News>;
    activeBackend: number;
    loadNews: ({
        shouldLoadMore,
    }: {
        shouldLoadMore?: boolean | undefined;
    }) => Promise<void>;
};
export type NewsSectionProps = {
    news: Array<News>;
    activeBackend: number;
    loadNews: ({
        shouldLoadMore,
    }: {
        shouldLoadMore?: boolean | undefined;
    }) => Promise<void>;
    newsEntryId: number;
    setNewsEntryId: (value: number | null) => void;
    newsNumbers: NewsNumbers;
    isLoadMoreButtonEnabled: boolean;
};
