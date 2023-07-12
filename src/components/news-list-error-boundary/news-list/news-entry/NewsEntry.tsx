import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Gallery, ContextMenu } from 'chayns-components';
import { getTimeAgo } from 'utils/date';
import { NewsEntryProps } from 'constants/types';
import { MAX_MESSAGE_LENGTH } from 'constants/config';
import './newsEntry.scss';
import { BackendUrls } from 'constants/enums';
import { patchNewsEntry } from 'api/news/patch';
import { deleteNewsEntry } from 'api/news/delete';
import { NEWS_ELEMENT_SHAPE } from 'constants/shapes';
import Footer from './footer/Footer';
import EditNewsEntry from '../../../shared/edit-news-entry/EditNewsEntry';

require('../../../../constants/chayns.d');
require('../../../../constants/chayns-components.d');

interface ContextMenuItem {
    className: string | null | undefined;
    onClick: () => void | Promise<void> | void;
    text: string;
    icon: string;
};

const NewsEntry = ({
    newsElement,
    activeBackend,
    fetchNews,
}: NewsEntryProps) => {
    let isMessageLong = false;
    let cutMessage;
    const { id, imageList, message, publishTime, publishTimestamp, headline, isHidden } = newsElement;

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

    const handleHide = async({ shouldBeHidden }: { shouldBeHidden: boolean }) => {
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
            onClick: async() => {
                await handleHide({ shouldBeHidden: true });
            },
            text: 'Hide',
            icon: 'fa fa-eye-slash',
        },
        unhide: {
            className: null,
            onClick: async() => {
                await handleHide({ shouldBeHidden: false });
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
    newsElement: PropTypes.shape(NEWS_ELEMENT_SHAPE).isRequired,
    activeBackend: PropTypes.number.isRequired,
    fetchNews: PropTypes.func.isRequired,
};

NewsEntry.DisplayName = 'NewsEntry';

export default NewsEntry;
