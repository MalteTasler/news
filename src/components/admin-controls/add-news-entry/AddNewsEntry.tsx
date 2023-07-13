import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'chayns-components';
import { AddNewsEntryProps } from 'constants/types';
import EditNewsEntry from '../../shared/edit-news-entry/EditNewsEntry';
import './addNewsEntry.scss';
import AddNewsEntryErrorBoundary from './add-news-entry-error-boundary/AddNewsEntryErrorBoundary';

require('../../../constants/chayns.d');
require('../../../constants/chayns-components.d');

const AddNewsEntry = ({ activeBackend, loadNews }: AddNewsEntryProps) => {
    const handlePublish = async () => {
        await loadNews({});
    };

    return (
        <div className="addNewsEntry">
            <AddNewsEntryErrorBoundary>
                <Accordion head="Create News Entry">
                    <div className="addNewsEntryFrame">
                        <EditNewsEntry
                            id={0}
                            initMessage=""
                            initTitle=""
                            initImageList={[]}
                            initIsHidden={false}
                            onPublish={handlePublish}
                            activeBackend={activeBackend}
                        />
                    </div>
                </Accordion>
            </AddNewsEntryErrorBoundary>
        </div>
    );
};

AddNewsEntry.propTypes = {
    activeBackend: PropTypes.number.isRequired,
    loadNews: PropTypes.func.isRequired,
};

AddNewsEntry.DisplayName = 'AddNewsEntry';

export default AddNewsEntry;
