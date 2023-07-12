import React, { FC, useEffect, useRef, useState } from 'react';
import { getParameters } from 'chayns-api';
import { AnimationWrapper, Button } from 'chayns-components';
import { getNews } from 'api/news/get';
import { FETCH_COUNT } from 'constants/config';
import { BackendUrls } from 'constants/enums';
import DeveloperTools from './developer-tools/DeveloperTools';
import NewsListErrorBoundary from './news-list-error-boundary/NewsListErrorBoundary';
import NewsList from './news-list-error-boundary/news-list/NewsList';
import AddNewsEntryErrorBoundary from './add-news-entry-error-boundary/AddNewsEntryErrorBoundary';
import AddNewsEntry from './add-news-entry-error-boundary/add-news-entry/AddNewsEntry';
import './app.scss';
import { ListResponse, News } from '../constants/interfaces';

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

    const getTimestamp = ({ newest = false }): string | number => {
        if (!news || !Array.isArray(news) || news.length <= 1 || newest) {
            // if no news entries are loaded yet or the parmeter "newest" is set to true,
            // just use the current timestamp (timestamp when the page was loaded) which can
            // be done by setting it to 0
            return new Date().getTime();
        }

        //  if entries are already loaded take the timestamp of the oldest
        const oldestLoadedNewsEntry: News = news[news.length - 1];
        if (oldestLoadedNewsEntry) {
            return oldestLoadedNewsEntry.publishTimestamp;
        }

        return new Date().getTime();
    };

    const fetchNews = async ({ shouldLoadMore = false }) => {

        // if no id parameter for a news entry is used, load multiple entries
        if (newsEntryId === null) {
            // reset local counter variables if shouldLoadMore is false
            if (!shouldLoadMore) {
                setNumberOfFetchedNews(0);
                setNumberOfDisplayedNews(0);                
            }

            // generate fetchURL with parameters
            let fetchURLWithParameters = BackendUrls[activeBackend];
            fetchURLWithParameters += `?siteId=${chayns.env.site.id}`;
            fetchURLWithParameters += `&tappId=${chayns.env.site.tapp.id}`;
            fetchURLWithParameters += `&timestamp=${getTimestamp({
                newest: !shouldLoadMore,
            })}`;
            fetchURLWithParameters += `&count=${FETCH_COUNT}`;
            fetchURLWithParameters += `&adminMode=${(
                chayns.env.user.adminMode || false
            ).toString()}`;

            const response = await getNews({
                fetchUrlWithParameters: fetchURLWithParameters,
            });
            switch (response.status) {
                // Bad Request
                case 400: {
                    console.error('Bad Request');
                    break;
                }
                // No Content
                case 204: {
                    setNumberOfDatabaseNews(0);
                    setNumberOfDatabaseUnhiddenNews(0);
                    setNumberOfFetchedNews(0);
                    setNumberOfDisplayedNews(0);
                    break;
                }
                default: {
                    const parsedResponse =
                        (await response.json()) as ListResponse;
                    const { itemList, fullLength, length } = parsedResponse;
                    setNews((prevState: News[]): News[] => {
                        // if shouldLoadMore is true, 
                        // last value of news itemList array gets popped (offset of one)
                        if (shouldLoadMore) {
                            itemList.shift();

                            return prevState.concat(itemList);
                        }

                        return itemList;
                    });
                    setNumberOfDatabaseNews(fullLength);
                    setNumberOfDatabaseUnhiddenNews(length);
                    const number = itemList.length; // number of new fetched entries
                    setNumberOfFetchedNews((prevState) => prevState + number);
                    if (number > FETCH_COUNT) {
                        setNumberOfDisplayedNews(
                            (prevState) => prevState + FETCH_COUNT
                        );
                    } else {
                        setNumberOfDisplayedNews(
                            (prevState) => prevState + number
                        );
                    }
                }
            }
        }

        // otherwise fetch only the news entry with the id defined in parameter
        else {
            // generate fetchURL with parameters
            const fetchURLWithParameters = `${BackendUrls[activeBackend]}/${newsEntryId}`;
            const response = await getNews({
                fetchUrlWithParameters: fetchURLWithParameters,
            });
            const parsedResponse = (await response.json()) as News;
            setNews([parsedResponse]);
        }
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
            void fetchNews({ shouldLoadMore: false });
        }
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            // Markiere den ersten Render als abgeschlossen
        } else {
            void fetchNews({ shouldLoadMore: false });
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
            void fetchNews({ shouldLoadMore: false });
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
                            siteId={chayns.env.site.id}
                            tappId={chayns.env.site.tapp.id}
                            activeBackend={activeBackend}
                            fetchNews={fetchNews}
                        />
                    </AddNewsEntryErrorBoundary>
                    <DeveloperTools
                        siteId={chayns.env.site.id}
                        tappId={chayns.env.site.tapp.id}
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
                            {numberOfDatabaseNews &&                                                        
                            news.length > 0 ? (
                                <div className="app__newsListContainer">
                                    {newsEntryId && (
                                        <div>Id Parameter - {newsEntryId}</div>
                                    )}
                                    <NewsListErrorBoundary>
                                        <NewsList
                                            siteId={chayns.env.site.id}
                                            tappId={chayns.env.site.tapp.id}
                                            news={news}
                                            activeBackend={activeBackend}
                                            fetchNews={fetchNews}
                                        />
                                    </NewsListErrorBoundary>
                                    {!newsEntryId ? (
                                        <div className="app__newsListContainer__btLoadMoreContainer">
                                            <Button
                                                disabled={
                                                    !isLoadMoreButtonEnabled
                                                }
                                                onClick={async () => {
                                                    await fetchNews({ shouldLoadMore: true });
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
