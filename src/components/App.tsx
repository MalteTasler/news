import React, { FC, useEffect, useRef, useState } from 'react';
import { getParameters } from 'chayns-api';
import { AnimationWrapper, Button } from 'chayns-components';
import { fetchNews } from 'utils/fetch';
import DeveloperTools from './developer-tools/DeveloperTools';
import NewsListErrorBoundary from './news-list-error-boundary/NewsListErrorBoundary';
import NewsList from './news-list-error-boundary/news-list/NewsList';
import AddNewsEntryErrorBoundary from './add-news-entry-error-boundary/AddNewsEntryErrorBoundary';
import AddNewsEntry from './add-news-entry-error-boundary/add-news-entry/AddNewsEntry';
import './app.scss';
import { News, NewsNumbers } from '../constants/interfaces';

require('../constants/chayns.d');
require('../constants/chayns-components.d');

const App: FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [activeBackend, setActiveBackend] = useState(1);
    const [newsEntryId, setNewsEntryId] = useState<number | null>(null); // id of the news entry to display, if null display multiple news
    const [shouldShowNews, setShowNews] = useState(true);
    const [newsNumbers, setNewsNumbers] = useState<NewsNumbers>({
        numberOfDatabaseNews: null,
        numberOfDatabaseUnhiddenNews: null,
        numberOfFetchedNews: 0,
    });
    const [isLoadMoreButtonEnabled, setLoadMoreButtonEnabled] = useState(false);
    const isFirstRender = useRef(true);

    const loadNews = async ({ shouldLoadMore = false }) => {
        const fetchResult: {
            news: News[];
            numbers: NewsNumbers;
        } = await fetchNews({
            shouldLoadMore,
            activeBackend,
            news,
            newsNumbers,
            newsEntryId: newsEntryId || 0,
        });
        setNews(fetchResult.news);
        setNewsNumbers(fetchResult.numbers);
    };

    useEffect(() => {
        const params: {
            [key: string]: string;
            [key: symbol]: string;
        } = getParameters();
        // check if paramters are valid
        if (params.M !== undefined) {
            setNewsEntryId(params.M as unknown as number);
        } else {
            void loadNews({ shouldLoadMore: false });
        }
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            // mark first render as done
        } else {
            void loadNews({ shouldLoadMore: false });
        }
    }, [newsEntryId]);

    useEffect(() => {
        setLoadMoreButtonEnabled(
            newsNumbers.numberOfDatabaseUnhiddenNews
                ? newsNumbers.numberOfFetchedNews <
                      newsNumbers.numberOfDatabaseUnhiddenNews
                : false
        );
    }, [
        newsNumbers.numberOfDatabaseNews,
        newsNumbers.numberOfDatabaseUnhiddenNews,
        newsNumbers.numberOfFetchedNews,
    ]);

    useEffect(() => {
        if (isFirstRender.current) {
            // mark first render as done
            isFirstRender.current = false;
        } else {
            void loadNews({ shouldLoadMore: false });
        }
    }, [activeBackend]);

    return (
        <div className="app">
            <AnimationWrapper>
                <h1 id="pageHeadline">Aktuelle News</h1>
                <p id="pageSubHeadline">
                    Kurz, kompakt und immer wieder frisch informieren wir hier
                    über aktuelle Themen und Aktionen.
                </p>
            </AnimationWrapper>
            {chayns.env.user.adminMode && (
                <div>
                    <AddNewsEntryErrorBoundary>
                        <AddNewsEntry
                            activeBackend={activeBackend}
                            fetchNews={loadNews}
                        />
                    </AddNewsEntryErrorBoundary>
                    <DeveloperTools
                        newsNumbers={newsNumbers}
                        showNews={shouldShowNews}
                        cbShowNewsOnChange={setShowNews}
                        activeBackend={activeBackend}
                        setActiveBackend={setActiveBackend}
                    />
                </div>
            )}
            <br />
            {shouldShowNews && (
                <div>
                    {newsNumbers.numberOfDatabaseNews === null ? (
                        <div className="app__loading">
                            <br />
                            waiting for news...
                        </div>
                    ) : (
                        <div>
                            {newsNumbers.numberOfDatabaseNews &&
                            news.length > 0 ? (
                                <div className="app__newsListContainer">
                                    {newsEntryId && (
                                        <div>Id Parameter - {newsEntryId}</div>
                                    )}
                                    <NewsListErrorBoundary>
                                        <NewsList
                                            news={news}
                                            activeBackend={activeBackend}
                                            fetchNews={loadNews}
                                        />
                                    </NewsListErrorBoundary>
                                    {!newsEntryId ? (
                                        <div className="app__newsListContainer__btLoadMoreContainer">
                                            <Button
                                                disabled={
                                                    !isLoadMoreButtonEnabled
                                                }
                                                onClick={async () => {
                                                    await loadNews({
                                                        shouldLoadMore: true,
                                                    });
                                                }}
                                            >
                                                Mehr
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="app__newsListContainer__btLoadMoreContainer">
                                            <Button
                                                onClick={() =>
                                                    setNewsEntryId(null)
                                                }
                                            >
                                                Alle News anzeigen
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                'no news available.'
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

App.displayName = 'App';

export default App;
