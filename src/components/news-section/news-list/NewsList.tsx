import React from 'react';
import PropTypes from 'prop-types';
import { NewsListProps } from 'constants/types';
import NewsEntry from './news-entry/NewsEntry';
import NewsListErrorBoundary from './news-list-error-boundary/NewsListErrorBoundary';
import { NEWS_ELEMENT_SHAPE } from '../../../constants/shapes';

require('../../../constants/chayns.d');
require('../../../constants/chayns-components.d');

const NewsList = ({ news, activeBackend, loadNews }: NewsListProps) => (
    <div className="newsList">
        <NewsListErrorBoundary>
            {news.map((element) => {
                if (!element) {
                    return 'no content';
                }

                return (
                    element &&
                    element.id &&
                    element.publishTime && (
                        <NewsEntry
                            key={element.id}
                            newsElement={element}
                            activeBackend={activeBackend}
                            loadNews={loadNews}
                        />
                    )
                );
            })}
        </NewsListErrorBoundary>
    </div>
);

NewsList.propTypes = {
    news: PropTypes.arrayOf(PropTypes.shape(NEWS_ELEMENT_SHAPE)).isRequired,
    activeBackend: PropTypes.number.isRequired,
    loadNews: PropTypes.func.isRequired,
};

NewsList.DisplayName = 'NewsList';

export default NewsList;
