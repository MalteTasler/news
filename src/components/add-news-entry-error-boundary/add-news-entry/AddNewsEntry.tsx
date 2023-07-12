import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'chayns-components';
import { AddNewsEntryProps } from 'constants/types';
import EditNewsEntry from '../../shared/edit-news-entry/EditNewsEntry';
import './addNewsEntry.scss';

require('../../../constants/chayns.d');
require('../../../constants/chayns-components.d');

const AddNewsEntry = ({
    siteId,
    tappId,
    activeBackend,
    fetchNews
}: AddNewsEntryProps) => {
    const handlePublish = () => {
        void fetchNews({});
    }

    return (
        <Accordion head="Create News Entry">
            <div className="addNewsEntryFrame">
                <EditNewsEntry
                    id={0}
                    siteId={siteId}
                    tappId={tappId}
                    initMessage=""
                    initTitle=""
                    initImageList={[]}
                    initIsHidden={false}
                    onPublish={handlePublish}
                    activeBackend={activeBackend}
                />
            </div>
        </Accordion>
    );
}

AddNewsEntry.propTypes = {
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    activeBackend: PropTypes.number.isRequired,
    fetchNews: PropTypes.func.isRequired
};

AddNewsEntry.DisplayName = 'AddNewsEntry';

export default AddNewsEntry;