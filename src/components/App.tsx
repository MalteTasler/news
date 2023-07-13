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
import { News } from '../constants/interfaces';

require('../constants/chayns.d');
require('../constants/chayns-components.d');

const App: FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [activeBackend, setActiveBackend] = useState(1);
    const [newsEntryId, setNewsEntryId] = useState<number | null>(null); // id of the news entry to display, if null display multiple news
    const [shouldShowNews, setShowNews] = useState(true);
    const [numberOfFetchedNews, setNumberOfFetchedNews] = useState(0);
    const [numberOfDisplayedNews, setNumberOfDisplayedNews] = useState(0);
    const [numberOfDatabaseNews, setNumberOfDatabaseNews] = useState<
        number | null
    >(null);
    const [numberOfDatabaseUnhiddenNews, setNumberOfDatabaseUnhiddenNews] =
        useState<number | null>(null);
    const [isLoadMoreButtonEnabled, setLoadMoreButtonEnabled] = useState(false);
    const isFirstRender = useRef(true);

    const navigateToAllNews = () => {
        setNewsEntryId(null);
    };

    const loadNews = async ({ shouldLoadMore = false }) => {
        const fetchResult : {
            news: News[];
            numbers: {
                numberOfDatabaseNews: number;
                numberOfDatabaseUnhiddenNews: number;
                numberOfFetchedNews: number;
            };
        } =
        await fetchNews({
            shouldLoadMore,
            activeBackend,
            news,
            numberOfDatabaseNews: numberOfDatabaseNews || 0,
            numberOfDatabaseUnhiddenNews: numberOfDatabaseUnhiddenNews || 0,
            numberOfFetchedNews: numberOfFetchedNews || 0,
            newsEntryId: newsEntryId || 0,
        })
        setNews(fetchResult.news);
        setNumberOfDatabaseNews(fetchResult.numbers.numberOfDatabaseNews);
        setNumberOfDatabaseUnhiddenNews(fetchResult.numbers.numberOfDatabaseUnhiddenNews);
        setNumberOfFetchedNews(fetchResult.numbers.numberOfFetchedNews);
        setNumberOfDisplayedNews(fetchResult.numbers.numberOfFetchedNews);
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
            // Markiere den ersten Render als abgeschlossen
        } else {
            void loadNews({ shouldLoadMore: false });
        }
    }, [newsEntryId]);

    useEffect(() => {
        setLoadMoreButtonEnabled(
            numberOfDatabaseUnhiddenNews
                ? numberOfDisplayedNews < numberOfDatabaseUnhiddenNews
                : false
        );
    }, [
        numberOfDisplayedNews,
        numberOfDatabaseNews,
        numberOfDatabaseUnhiddenNews,
    ]);

    useEffect(() => {
        if (isFirstRender.current) {
            // Markiere den ersten Render als abgeschlossen
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
                        numberOfDisplayedNews={numberOfDisplayedNews}
                        numberOfFetchedNews={numberOfFetchedNews}
                        numberOfDatabaseNews={numberOfDatabaseNews || 0}
                        numberOfDatabaseUnhiddenNews={
                            numberOfDatabaseUnhiddenNews || 0
                        }
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
                    {numberOfDatabaseNews === null ? (
                        <div className="app__loading">
                            <br />
                            waiting for news...
                        </div>
                    ) : (
                        <div>
                            {numberOfDatabaseNews && news.length > 0 ? (
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
                                                    navigateToAllNews()
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
