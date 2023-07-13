import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'chayns-components';
import NewsList from 'components/news-section/news-list/NewsList';
import NewsListErrorBoundary from 'components/news-section/news-list/news-list-error-boundary/NewsListErrorBoundary';
import { NEWS_ELEMENT_SHAPE, NEWS_NUMBERS_SHAPE } from 'constants/shapes';
import { NewsSectionProps } from 'constants/types';

const NewsSection = ({
    newsNumbers,
    news,
    activeBackend,
    loadNews,
    newsEntryId,
    setNewsEntryId,
    isLoadMoreButtonEnabled,
}: NewsSectionProps) => (
    <div className="news-section">
        {newsNumbers.numberOfDatabaseNews === null ? (
            <div className="app__loading">
                <br />
                waiting for news...
            </div>
        ) : (
            <div>
                {newsNumbers.numberOfDatabaseNews &&
                newsNumbers.numberOfFetchedNews > 0 ? (
                    <div className="app__newsListContainer">
                        {newsEntryId && <div>Id Parameter - {newsEntryId}</div>}
                        <NewsListErrorBoundary>
                            <NewsList
                                news={news}
                                activeBackend={activeBackend}
                                loadNews={loadNews}
                            />
                        </NewsListErrorBoundary>
                        {!newsEntryId ? (
                            <div className="app__newsListContainer__btLoadMoreContainer">
                                <Button
                                    disabled={!isLoadMoreButtonEnabled}
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
                                <Button onClick={() => setNewsEntryId(null)}>
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
);

NewsSection.propTypes = {
    newsNumbers: PropTypes.shape(NEWS_NUMBERS_SHAPE).isRequired,
    news: PropTypes.arrayOf(PropTypes.shape(NEWS_ELEMENT_SHAPE)).isRequired,
    activeBackend: PropTypes.number.isRequired,
    loadNews: PropTypes.func.isRequired,
    newsEntryId: PropTypes.number,
    setNewsEntryId: PropTypes.func.isRequired,
    isLoadMoreButtonEnabled: PropTypes.bool.isRequired,
};

NewsSection.DisplayName = 'NewsSection';

export default NewsSection;
