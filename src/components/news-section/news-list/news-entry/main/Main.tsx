import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Gallery } from 'chayns-components';
import EditNewsEntry from 'components/shared/edit-news-entry/EditNewsEntry';
import { MainProps } from 'constants/types';
import { NEWS_ELEMENT_SHAPE } from 'constants/shapes';
import { MAX_MESSAGE_LENGTH } from 'constants/config';

const Main = ({
    isEditMode,
    newsElement,
    activeBackend,
    handlePublish,
}: MainProps) => {
    const { id, imageList, message, headline, isHidden } = newsElement;

    let isMessageLong = false;
    let cutMessage;

    const [IsMessageExtended, setMessageIsExtended] = useState(false);

    if (message.length >= MAX_MESSAGE_LENGTH && !IsMessageExtended) {
        isMessageLong = true;
        const truncated = message.substr(0, MAX_MESSAGE_LENGTH);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        const substring = truncated.substr(0, lastSpaceIndex);
        cutMessage = (
            <span>
                {substring}... &nbsp;
                <a
                    className="btLoadWholeMessage"
                    onClick={() => {
                        setMessageIsExtended(true);
                    }}
                >
                    Mehr
                </a>
            </span>
        );
    }

    return (
        <div className="main">
            {chayns.env.user.adminMode && isEditMode ? (
                <div>
                    <EditNewsEntry
                        id={id}
                        onPublish={handlePublish}
                        initMessage={message}
                        initTitle={headline}
                        initImageList={imageList}
                        initIsHidden={isHidden}
                        activeBackend={activeBackend}
                    />
                </div>
            ) : (
                <div>
                    {imageList && imageList.length !== 0 && (
                        <Gallery images={imageList} />
                    )}
                    <h2>{headline}</h2>
                    <div className="newsEntry__message">
                        {isMessageLong ? cutMessage : message}
                    </div>
                </div>
            )}
        </div>
    );
};

Main.propTypes = {
    newsElement: PropTypes.shape(NEWS_ELEMENT_SHAPE).isRequired,
    isEditMode: PropTypes.bool.isRequired,
    activeBackend: PropTypes.number.isRequired,
    handlePublish: PropTypes.func.isRequired,
};

Main.DisplayName = 'Main';

export default Main;
