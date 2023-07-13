import React, { FC, useEffect, useRef, useState } from 'react';
import { getParameters } from 'chayns-api';
import { processNews } from 'utils/fetch';
import './app.scss';
import { News, NewsNumbers } from '../constants/interfaces';
import Head from './head/Head';
import AdminControls from './admin-controls/AdminControls';
import NewsSection from './news-section/NewsSection';

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
        } = await processNews({
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
            <Head />
            {chayns.env.user.adminMode && (
                <AdminControls
                    newsNumbers={newsNumbers}
                    activeBackend={activeBackend}
                    setActiveBackend={setActiveBackend}
                    loadNews={loadNews}
                    shouldShowNews={shouldShowNews}
                    setShowNews={setShowNews}
                />
            )}
            <br />
            {shouldShowNews && (
                <NewsSection
                    news={news}
                    newsNumbers={newsNumbers}
                    activeBackend={activeBackend}
                    loadNews={loadNews}
                    newsEntryId={newsEntryId || 0}
                    setNewsEntryId={setNewsEntryId}
                    isLoadMoreButtonEnabled={isLoadMoreButtonEnabled}
                />
            )}
        </div>
    );
};

App.displayName = 'App';

export default App;
