import React, { FC, useEffect, useState } from 'react';
import { getParameters } from 'chayns-api';
import { AnimationWrapper, Button } from 'chayns-components';
import { getNews } from 'api/news/get';
import { postNewsEntry } from 'api/news/post';
import { patchNewsEntry } from 'api/news/patch';
import { deleteNewsEntry } from 'api/news/delete';
import { BACKEND_URLS, FETCH_COUNT } from 'constants/config';
import DeveloperTools from './developer-tools/DeveloperTools';
import NewsListErrorBoundary from './news-list-error-boundary/NewsListErrorBoundary';
import NewsList from './news-list-error-boundary/news-list/NewsList';
import AddNewsEntryErrorBoundary from './add-news-entry-error-boundary/AddNewsEntryErrorBoundary';
import AddNewsEntry from './add-news-entry-error-boundary/add-news-entry/AddNewsEntry';
import './app.scss';
import {
    ListResponse,
    News,
    NewsBase,
    Parameters,
} from '../constants/interfaces';

require('../constants/chayns.d');
require('../constants/chayns-components.d');

const App: FC = () => { 
    const [news, setNews] = useState<News[]>([]);
    const [useBackend, setUseBackend] = useState(1);
    const [URLparam, setURLparam] = useState<Parameters>();
    const [newsEntryId, setNewsEntryId] = useState<number | null>(null); // id of the news entry to display, if null display multiple news
    const [shouldShowNews, setShowNews] = useState(true);
    const [, setCounter] = useState(0);
    const [numberOfFetchedNews, setNumberOfFetchedNews] = useState(0);
    const [numberOfDisplayedNews, setNumberOfDisplayedNews] =
        useState(0);
    const [numberOfDatabaseNews, setNumberOfDatabaseNews] = useState<
        number | null
    >(null);
    const [numberOfDatabaseUnhiddenNews, setNumberOfDatabaseUnhiddenNews] =
        useState<number | null>(null);
    const [isLoadMoreButtonEnabled, setLoadMoreButtonEnabled] =
        useState(false);

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
    }

    const fetchNews = async ({ offset = false }) => {
        // if offset is true, last value of current news array gets popped
        if (newsEntryId === null) {
            // if no id parameter for a news entry is used, load multiple entries
            // generate fetchURL with parameters            
            let fetchURLWithParameters = BACKEND_URLS[useBackend]
            fetchURLWithParameters += `?siteId=${chayns.env.site.id}`
            fetchURLWithParameters += `&tappId=${chayns.env.site.tapp.id}`
            fetchURLWithParameters += `&timestamp=${getTimestamp({ newest: !offset })}`
            fetchURLWithParameters += `&count=${FETCH_COUNT}`
            fetchURLWithParameters += `&adminMode=${(chayns.env.user.adminMode).toString()}`

            const response = await getNews(
                {
                    fetchUrlWithParameters : fetchURLWithParameters
                }
            );
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
                        if (offset) {
                            itemList.shift();

                            return prevState.concat(itemList);
                        }

                        return itemList;
                    });
                    setNumberOfDatabaseNews(fullLength);
                    setNumberOfDatabaseUnhiddenNews(length);
                    const number = itemList.length; // number of new fetched entries
                    if (offset) {
                        setNumberOfFetchedNews(
                            (prevState) => prevState + number
                        );
                        if (number > FETCH_COUNT) {
                            setNumberOfDisplayedNews(
                                (prevState) => prevState + FETCH_COUNT
                            );
                        }
                        else {
                            setNumberOfDisplayedNews(
                                (prevState) => prevState + number
                            );
                        }
                    }
                    
                    else {
                        setNumberOfFetchedNews(number);
                        if (number > FETCH_COUNT) {
                            setNumberOfDisplayedNews(FETCH_COUNT);
                        }

                        else {
                            setNumberOfDisplayedNews(number);
                        }
                    }
                }
            }
        }
        
        // otherwise fetch only the news entry with the id defined in parameter
        else {            
            // generate fetchURL with parameters
            const fetchURLWithParameters = `${BACKEND_URLS[useBackend]}/${newsEntryId}`;
            const response = await getNews(
                {
                    fetchUrlWithParameters : fetchURLWithParameters            
                }
            );
            const parsedResponse = (await response.json()) as News;
            setNews([parsedResponse]);
        }
    };

    const publish = async ({ data } : { data: NewsBase }) => {
        // if the Id of the -entry to publish is already present in fetched data, do patch, otherwise do post
        if (news.find((entry) => entry.id === data.id)) {
            const fetchUrlWithParameters = `${BACKEND_URLS[useBackend]}/${
                data.id as number
            }`;
            await patchNewsEntry(
                {
                    fetchUrlWithParameters,
                    data
                }
            );
        } 
        
        else {
            const fetchUrlWithParameters = `${BACKEND_URLS[useBackend]}`;
            await postNewsEntry(
                {
                    fetchUrlWithParameters,
                    data
                }
            );
        }
        setCounter((prevState) => prevState + 1);
        await fetchNews({ offset: false});
    };

    const deleteEntry = async ({ id } : { id: number }) => {
        const fetchUrlWithParameters = `${BACKEND_URLS[useBackend]}/${id}`;
        await deleteNewsEntry(
            {
                fetchUrlWithParameters                
            }
        );
        setCounter((prevState) => prevState + 1);
        await fetchNews({ offset: false });
    };

    useEffect(() => {
        const getItems = async () => {
            await fetchNews({ offset: false });
        };
        const params: {
            [key: string]: string;
            [key: symbol]: string;
        } = getParameters();
        // check if paramters are valid
        if (params.M !== undefined) 
        {
            setNewsEntryId(params.M as unknown as number);
        }

        else 
        {
            void fetchNews({ offset: false });
        }
    }, []);

    useEffect(() => {
        void fetchNews({ offset: false });
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
        numberOfDatabaseUnhiddenNews
    ]);

/*     useEffect(() => {
        const getItems = async () => {
            await fetchNews({ offset: false });
        };
        void getItems();
    }, []); */

    useEffect(() => {
        // ! redundancy? test
        const getItems = async () => {
            await fetchNews({ offset: false });
        };
        void getItems();
    }, [useBackend]);

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
                            onPublish={publish}
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
                        useBackend={useBackend}
                        setUseBackend={setUseBackend}
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
                            news &&
                            Array.isArray(news) &&
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
                                            onPatch={publish}
                                            onDelete={deleteEntry}
                                        />
                                    </NewsListErrorBoundary>
                                    {!newsEntryId ? (
                                        <div
                                            className="app__newsListContainer__btLoadMoreContainer"
                                        >
                                            <Button
                                                disabled={
                                                    !isLoadMoreButtonEnabled
                                                }
                                                onClick={async() => {await fetchNews({ offset: true })}}
                                            >
                                                Mehr
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="app__newsListContainer__btLoadMoreContainer"
                                        >
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