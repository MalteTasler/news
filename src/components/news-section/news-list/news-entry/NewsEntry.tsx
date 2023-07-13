import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getTimeAgo } from 'utils/date';
import { NewsEntryProps } from 'constants/types';
import './newsEntry.scss';
import { BackendUrls } from 'constants/enums';
import { patchNewsEntry } from 'api/news/patch';
import { NEWS_ELEMENT_SHAPE } from 'constants/shapes';
import Footer from './footer/Footer';
import Main from './main/Main';
import Header from './header/Header';

require('../../../../constants/chayns.d');
require('../../../../constants/chayns-components.d');

const NewsEntry = ({
    newsElement,
    activeBackend,
    loadNews,
}: NewsEntryProps) => {    
    const {
        id,
        imageList,
        message,
        publishTime,
        publishTimestamp,
        headline,
        isHidden,
    } = newsElement;

    const [isEditMode, setEditMode] = useState(false);    

    const handlePublish = async() => {
        setEditMode(!isEditMode);
        await loadNews({ shouldLoadMore: false });
    };

    const handleHide = async({
        shouldBeHidden,
    }: {
        shouldBeHidden: boolean;
    }) => {
        const fetchUrlWithParameters = `${BackendUrls[activeBackend]}/${id}`;
        await patchNewsEntry({
            data: {
                id,
                siteId: chayns.env.site.id,
                tappId: chayns.env.site.tapp.id,
                imageList,
                headline,
                message,
                isHidden: shouldBeHidden,
            },
            fetchUrlWithParameters,
        });
        await loadNews({ shouldLoadMore: false });
    };

    return (
        <div className="newsEntry">
            {(chayns.env.user.adminMode || !isHidden) && (
                <div>
                    <div className="content__card" id={`news_entry_${id}`}>
                        {chayns.env.user.adminMode && (
                            <Header
                                id={id}
                                isHidden={isHidden}
                                isEditMode={isEditMode}
                                activeBackend={activeBackend}
                                setEditMode={setEditMode}
                                handleHide={handleHide}
                                loadNews={loadNews}
                            />
                        )}
                        <Main
                            isEditMode={isEditMode}
                            newsElement={newsElement}
                            activeBackend={activeBackend}
                            handlePublish={handlePublish}                           
                        />
                        {!isEditMode && (                            
                            <Footer
                                date={getTimeAgo(
                                    publishTimestamp,
                                    new Date()
                                )}
                                dateAbsolute={publishTime}
                                id={id}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

NewsEntry.propTypes = {
    newsElement: PropTypes.shape(NEWS_ELEMENT_SHAPE).isRequired,
    activeBackend: PropTypes.number.isRequired,
    loadNews: PropTypes.func.isRequired,
};

NewsEntry.DisplayName = 'NewsEntry';

export default NewsEntry;
