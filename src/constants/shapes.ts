import PropTypes from 'prop-types';

export const NEWS_ELEMENT_SHAPE = {
    id: PropTypes.number.isRequired,
    headline: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    imageList: PropTypes.arrayOf(PropTypes.string).isRequired,
    publishTime: PropTypes.string.isRequired,
    publishTimestamp: PropTypes.number.isRequired,
    isHidden: PropTypes.bool.isRequired,
};

export const NEWS_NUMBERS_SHAPE = {
    numberOfDatabaseNews: PropTypes.number,
    numberOfDatabaseUnhiddenNews: PropTypes.number,
    numberOfFetchedNews: PropTypes.number,
};
