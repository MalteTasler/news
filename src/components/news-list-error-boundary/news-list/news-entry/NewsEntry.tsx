import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Gallery, ContextMenu } from 'chayns-components';
import { getTimeAgo } from 'utils/date';
import { ContextMenuItem, NewsEntryProps } from 'constants/types';
import { MAX_MESSAGE_LENGTH } from 'constants/config';
import './newsEntry.scss';
import { BackendUrls } from 'constants/enums';
import { patchNewsEntry } from 'api/news/patch';
import { deleteNewsEntry } from 'api/news/delete';
import Footer from './footer/Footer';
import EditNewsEntry from '../../../shared/edit-news-entry/EditNewsEntry';

require('../../../../constants/chayns.d');
require('../../../../constants/chayns-components.d');

const NewsEntry = ({
    id,
    siteId,
    tappId,
    title,
    message,
    imageList,
    publishTime,
    publishTimestamp,
    isHidden,
    activeBackend,
    fetchNews,
}: NewsEntryProps) => {
    let isMessageLong = false;
    let cutMessage;

    const [isEditMode, setEditMode] = useState(false);
    const [IsMessageExtended, setMessageIsExtended] = useState(false);

    const handleDelete = async () => {
        await chayns.dialog
            .confirm(
                'Confirm',
                'Are you sure you want to delete that new entry?',
                [
                    {
                        text: 'YES',
                        buttonType: 1,
                    },
                    {
                        text: 'NO',
                        buttonType: 0,
                    },
                ]
            )
            .then(async (result) => {
                if (result === 1) {
                    const fetchUrlWithParameters = `${BackendUrls[activeBackend]}/${id}`;
                    await deleteNewsEntry({
                        fetchUrlWithParameters,
                    });
                    void fetchNews({ shouldLoadMore: false });
                }
            });
    };

    const handlePublish = () => {
        setEditMode(!isEditMode);
        void fetchNews({ shouldLoadMore: false });
    };

    const handleHide = ({ shouldBeHidden }: { shouldBeHidden: boolean }) => {
        const fetchUrlWithParameters = `${BackendUrls[activeBackend]}/${id}`;
        void patchNewsEntry({
            data: {
                id,
                siteId,
                tappId,
                imageList,
                headline: title,
                message,
                isHidden: shouldBeHidden,
            },
            fetchUrlWithParameters,
        });
        void fetchNews({ shouldLoadMore: false });
    };

    const contextMenuItems = {
        delete: {
            className: null,
            onClick: async () => {
                await handleDelete();
            },
            text: 'Delete',
            icon: 'fa fa-trash',
        },
        edit: {
            className: null,
            onClick: () => {
                setEditMode(!isEditMode);
            },
            text: 'Edit',
            icon: 'fa fa-edit',
        },
        view: {
            className: null,
            onClick: () => {
                setEditMode(!isEditMode);
            },
            text: 'View',
            icon: 'fa fa-check',
        },
        hide: {
            className: null,
            onClick: () => {
                handleHide({ shouldBeHidden: true });
            },
            text: 'Hide',
            icon: 'fa fa-eye-slash',
        },
        unhide: {
            className: null,
            onClick: () => {
                handleHide({ shouldBeHidden: false });
            },
            text: 'Unhide',
            icon: 'fa fa-eye',
        },
    };

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

    function buildContextMenuItems(): ContextMenuItem[] {
        const array: ContextMenuItem[] = [];
        array.push(contextMenuItems.delete);
        if (isEditMode) {
            array.push(contextMenuItems.view);
        } else {
            array.push(contextMenuItems.edit);
        }
        if (isHidden) {
            array.push(contextMenuItems.unhide);
        } else {
            array.push(contextMenuItems.hide);
        }

        return array;
    }

    return (
        <div className="newsEntry">
            {(chayns.env.user.adminMode || !isHidden) && (
                <div>
                    <div className="content__card" id={`news_entry_${id}`}>
                        {chayns.env.user.adminMode && (
                            <div className="newsEntry__header">
                                {isHidden && (
                                    <div className="newsEntry__header__hideDisplayLabel">
                                        Ausgeblendet
                                    </div>
                                )}
                                <div className="newsEntry__header__contextMenuFrame">
                                    <ContextMenu
                                        items={buildContextMenuItems()}
                                        className="newsEntry__header__contextMenuFrame__contextMenu"
                                    />
                                </div>
                            </div>
                        )}
                        {chayns.env.user.adminMode && isEditMode ? (
                            <div>
                                <EditNewsEntry
                                    id={id}
                                    siteId={siteId}
                                    tappId={tappId}
                                    onPublish={handlePublish}
                                    initMessage={message}
                                    initTitle={title}
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
                                <h2>{title}</h2>
                                <div className="newsEntry__message">
                                    {isMessageLong ? cutMessage : message}
                                </div>
                                <Footer
                                    date={getTimeAgo(
                                        publishTimestamp,
                                        new Date()
                                    )}
                                    dateAbsolute={publishTime}
                                    id={id}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

NewsEntry.propTypes = {
    id: PropTypes.number.isRequired,
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    imageList: PropTypes.arrayOf(PropTypes.string),
    publishTime: PropTypes.string.isRequired,
    publishTimestamp: PropTypes.number.isRequired,
    isHidden: PropTypes.bool.isRequired,
    activeBackend: PropTypes.number.isRequired,
    fetchNews: PropTypes.func.isRequired,
};

NewsEntry.defaultProps = {
    title: '',
    imageList: [],
};

NewsEntry.DisplayName = 'NewsEntry';

export default NewsEntry;
