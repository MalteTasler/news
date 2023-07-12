import React from 'react';
import PropTypes from 'prop-types';
import { NewsListProps } from 'constants/types';
import NewsEntry from './news-entry/NewsEntry';

require('../../../constants/chayns.d');
require('../../../constants/chayns-components.d');

const NewsList = ({
    news,
    activeBackend,
    fetchNews,
}: NewsListProps) => (
    <div className="newsList">
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
                        id={element.id}
                        title={element.headline}
                        message={element.message}
                        imageList={element.imageList}
                        publishTime={element.publishTime}
                        publishTimestamp={element.publishTimestamp}
                        isHidden={element.isHidden}
                        activeBackend={activeBackend}
                        fetchNews={fetchNews}
                    />
                )
            );
        })}
    </div>
);

NewsList.propTypes = {
    news: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number, // try use INews[] instead
        })
    ).isRequired,
    activeBackend: PropTypes.number.isRequired,
    fetchNews: PropTypes.func.isRequired,
};

NewsList.DisplayName = 'NewsList';

export default NewsList;
