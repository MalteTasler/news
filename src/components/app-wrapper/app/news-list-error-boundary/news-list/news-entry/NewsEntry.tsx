import React, { useState } from "react"
import PropTypes from "prop-types"
import { Gallery, ContextMenu } from 'chayns-components'
import { getTimeAgo } from "utils/date"
import { ContextMenuItem, NewsEntryProps } from "constants/types"
import { MAX_MESSAGE_LENGTH } from "constants/config"
import { INewsBase } from "constants/interfaces"
import Footer from './footer/Footer'
import stylesNewsEntry from './newsEntry.module.scss'
import EditNewsEntry from "../../../../../shared/edit-news-entry/EditNewsEntry"

require('../../../../../../constants/chayns.d')
require('../../../../../../constants/chayns-components.d')

const NewsEntry = ({ id, siteId, tappId, title, message, imageList, publishTime, publishTimestamp, onPatch, onDelete, now, hidden } : NewsEntryProps) =>
{
    let isMessageLong = false
    let cutMessage
    
    const [isEditMode, setEditMode] = useState(false)
    const [IsMessageExtended, setMessageIsExtended] = useState(false)

    const handleDelete = async() => {
        await chayns.dialog.confirm('Confirm', 'Are you sure you want to delete that new entry?', [
            {
                text: 'YES',
                buttonType: 1
            }, 
            {
                text: 'NO',
                buttonType: 0
            }
        ]
        ).then((result) => {
            if(result === 1)
            {
                onDelete(id)
            }
        }
        );
    }
    const handlePublish = (data : INewsBase) => {
        // console.log("++++++++ patching...#################################", data)
        setEditMode(!isEditMode)
        onPatch(data)
    }
    const handleHide = (shouldBeHidden : boolean) => {
        onPatch({
            id,
            siteId,
            tappId,
            imageList,
            headline: title,
            message,
            hidden: shouldBeHidden
        })
    }

    const contextMenuItems = 
        {
            delete: {
                className: null,
                onClick: async() => {
                    await handleDelete()
                },
                text: "Delete",
                icon: "fa fa-trash"
            },
            edit: {
                className: null,
                onClick: () => {
                    setEditMode(!isEditMode)
                },
                text: "Edit",
                icon: "fa fa-edit"
            },
            view: {
                className: null,
                onClick: () => {
                    setEditMode(!isEditMode)
                },
                text: "View",
                icon: "fa fa-check"
            },
            hide: {
                className: null,
                onClick: () => {
                    handleHide(true)
                },
                text: "Hide",
                icon: "fa fa-eye-slash"
            },
            unhide: {
                className: null,
                onClick: () => {
                    handleHide(false)
                },
                text: "Unhide",
                icon: "fa fa-eye"
            }
        }
    
    if(message.length >= MAX_MESSAGE_LENGTH && !IsMessageExtended)
    {
        isMessageLong = true
        const truncated = message.substr(0, MAX_MESSAGE_LENGTH)
        const lastSpaceIndex = truncated.lastIndexOf(" ")
        const substring = truncated.substr(0, lastSpaceIndex)
        cutMessage = <span>
            {substring}...
            &nbsp;
            <a 
                className = "btLoadWholeMessage" 
                onClick = {displayWholeMessage}
            >
                Mehr    
            </a>
        </span>
    }
    function displayWholeMessage() {
        setMessageIsExtended(true)
    }
    function buildContextMenuItems() : ContextMenuItem[] {
        const array : ContextMenuItem[] = []
        array.push(contextMenuItems.delete)
        if(isEditMode)
            array.push(contextMenuItems.view)
        else
            array.push(contextMenuItems.edit)
        if(hidden)
            array.push(contextMenuItems.unhide)
        else
            array.push(contextMenuItems.hide)
        return array
    }
     
    return(
        <div className = {stylesNewsEntry.newsEntry}>
            {(chayns.env.user.adminMode || !hidden)
            &&
                <div>
                    <div 
                        className = "content__card" 
                        id = {`news_entry_${id}`}
                    >
                        {chayns.env.user.adminMode &&
                            <div className = {stylesNewsEntry.newsEntry__header}>
                                {hidden && <div className = {stylesNewsEntry.newsEntry__header__hideDisplayLabel}>Ausgeblendet</div>}
                                <div className = {stylesNewsEntry.newsEntry__header__contextMenuFrame}>
                                    <ContextMenu
                                        items = {
                                            buildContextMenuItems()
                                        }
                                        className = {stylesNewsEntry.newsEntry__header__contextMenuFrame__contextMenu}
                                    />
                                </div>
                            </div>
                        }
                        {(chayns.env.user.adminMode && isEditMode)
                        ?   
                            <div>
                                <EditNewsEntry
                                    id = {id}
                                    siteId = {siteId}
                                    tappId = {tappId}
                                    onPublish = {handlePublish}
                                    now = {now}
                                    initMessage = {message}
                                    initTitle = {title}
                                    initImageList = {imageList}
                                    initIsHidden = {hidden}
                                />
                            </div>
                        :
                            <div>
                                { imageList && imageList.length !== 0
                                &&
                                    <Gallery
                                        images = {imageList} 
                                    />                                
                                }
                                <h2>
                                    {title}
                                </h2>
                                <div className = {stylesNewsEntry.newsEntry__message}>
                                    {isMessageLong 
                                    ?
                                        cutMessage 
                                    : 
                                        message
                                    }
                                </div>
                                <Footer 
                                    date = {getTimeAgo(publishTimestamp, now)} 
                                    dateAbsolute = {publishTime}
                                    id = {id}  
                                />
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

NewsEntry.propTypes = {
    id: PropTypes.number.isRequired,
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    imageList: PropTypes.arrayOf(PropTypes.string),
    publishTime: PropTypes.string.isRequired,
    publishTimestamp: PropTypes.number.isRequired,
    onPatch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    now: PropTypes.shape({
        getTime: PropTypes.func
    }).isRequired,
    hidden: PropTypes.bool.isRequired
}

NewsEntry.defaultProps = {
    title : "",
    imageList: []
}

NewsEntry.DisplayName = "NewsEntry"

export default NewsEntry