import React from 'react';
import PropTypes from 'prop-types';
import { NEWS_NUMBERS_SHAPE } from 'constants/shapes';
import { AdminControlsProps } from 'constants/types';
import DeveloperTools from './developer-tools/DeveloperTools';
import AddNewsEntryErrorBoundary from './add-news-entry/add-news-entry-error-boundary/AddNewsEntryErrorBoundary';
import AddNewsEntry from './add-news-entry/AddNewsEntry';

const AdminControls = ({
    newsNumbers,
    activeBackend,
    setActiveBackend,
    loadNews,
    shouldShowNews,
    setShowNews,
}: AdminControlsProps) => (
    
    <div className="admin-controls">
        <AddNewsEntryErrorBoundary>
            <AddNewsEntry activeBackend={activeBackend} loadNews={loadNews} />
        </AddNewsEntryErrorBoundary>
        <DeveloperTools
            newsNumbers={newsNumbers}
            showNews={shouldShowNews}
            setShowNews={setShowNews}
            activeBackend={activeBackend}
            setActiveBackend={setActiveBackend}
        />
    </div>
);

AdminControls.propTypes = {
    newsNumbers: PropTypes.shape(NEWS_NUMBERS_SHAPE).isRequired,
    activeBackend: PropTypes.number.isRequired,
    setActiveBackend: PropTypes.func.isRequired,
    loadNews: PropTypes.func.isRequired,
    shouldShowNews: PropTypes.bool.isRequired,
    setShowNews: PropTypes.func.isRequired,
};

AdminControls.DisplayName = 'AdminControls';

export default AdminControls;
