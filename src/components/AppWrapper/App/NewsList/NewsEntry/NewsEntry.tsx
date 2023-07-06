import React, { useState } from "react"
import PropTypes from "prop-types"
import { Gallery, ContextMenu } from 'chayns-components'
import { getTimeAgo } from "utils/date"
import { ContextMenuItem, NewsEntryProps } from "constants/types"
import Footer from './Footer/Footer'
import styles from './NewsEntry.module.scss'
import EditNewsEntry from "../../../../shared/EditNewsEntry/EditNewsEntry"
import { MAX_MESSAGE_LENGTH } from "constants/config"

require('../../../../../constants/chayns.d')
require('../../../../../constants/chayns-components.d')

const NewsEntry = ({ id, siteId, tappId, title, message, imageList, publishTime, publishTimestamp, onPatch, onDelete, now, hidden } : NewsEntryProps) =>
{
    // console.log("render news entry ....................... ", publishTime, typeof publishTime)
    let messageIsLong = false
    let cutMessage
    
    const [editMode, setEditMode] = useState(false)
    const [messageIsExtended, setMessageIsExtended] = useState(false)

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
            ]).then((result) => {
                if(result === 1)
                {
                    onDelete(id)
                }
            }
            );
    }
    const handlePatch = (isHidden : boolean) => {
        onPatch(
            {
                id,
                siteId,
                tappId,
                imageList,
                headline: title,
                message,
                publishTime,
                publishTimestamp,
                hidden: isHidden
            }
            )
        }

        const contextMenuItems = 
            {
                delete: {
                    className: null,
                    onClick: handleDelete,
                    text: "Delete",
                    icon: "fa fa-trash"
                },
                edit: {
                    className: null,
                    onClick: () => {
                        setEditMode(!editMode)
                    },
                    text: "Edit",
                    icon: "fa fa-edit"
                },
                view: {
                    className: null,
                    onClick: () => {
                        setEditMode(!editMode)
                    },
                    text: "View",
                    icon: "fa fa-check"
                },
                hide: {
                    className: null,
                    onClick: handlePatch(true),
                    text: "Hide",
                    icon: "fa fa-eye-slash"
                },
                unhide: {
                    className: null,
                    onClick: handlePatch(false),
                    text: "Unhide",
                    icon: "fa fa-eye"
                }
            }
    
    if(message.length >= MAX_MESSAGE_LENGTH && !messageIsExtended)
    {
        messageIsLong = true
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
    function buildContextMenuItems() {
        const array : ContextMenuItem[] = []
        array.push(contextMenuItems.delete)
        if(editMode)
            array.push(contextMenuItems.view)
        else
            array.push(contextMenuItems.edit)
        if(hidden)
            array.push(contextMenuItems.unhide)
        else
            array.push(contextMenuItems.hide)
        return array
    }
    const handlePublish = (data) => {
        setEditMode(!editMode)
        onPatch(data)
    }
     
    return(
        <div>
            {(chayns.env.user.adminMode || !hidden)
            &&
                <div className = {styles.newsEntryFrame}>
                    <div 
                        className = "content__card" 
                        id = {id as string}
                    >
                        {chayns.env.user.adminMode &&
                            <div className = {styles.newsEntryHeader}>
                                {hidden && <div className = {styles.labelOnHide}>Ausgeblendet</div>}
                                <div className = {styles.contextMenuFrame}>
                                    <ContextMenu
                                        items = {
                                            buildContextMenuItems()
                                        }
                                        className = {styles.contextMenu}
                                    />
                                </div>
                            </div>
                        }
                        {(chayns.env.user.adminMode && editMode)
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
                                <div className = {styles.message}>
                                    {messageIsLong 
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