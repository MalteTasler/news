import React, { useState } from "react"
import PropTypes from "prop-types"
import { Gallery, ContextMenu } from 'chayns-components'
import Footer from './Footer'
import styles from './NewsEntry.module.css'
import EditNewsEntry from "./EditNewsEntry"

const NewsEntry = ({id, siteId, tappId, title, message, imageList, publishTime, publishTimestamp, onPut, onPatch, onDelete, frontendURL, now, hidden}) =>
{
    console.log("render news entry ....................... ", hidden, chayns.env.user.adminMode)
    const [editMode, setEditMode] = useState(false)
    const contextMenuItems = 
        {
            delete: {
                className: null,
                onClick: () => {
                    chayns.dialog.confirm('Confirm', 'Are you sure you want to delete that new entry?', [
                    {
                        text: 'YES',
                        buttonType: 1,
                    }, 
                    {
                        text: 'NO',
                        buttonType: 0,
                        collapseTime: 3
                    }
                    ]).then((result) => {
                        if(result === 1)
                        {
                            /* console.log("try to delete new entry now:", result, "key _ ", id) */
                            onDelete(id)
                        }
                    }
                    );
                },
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
                onClick: () => {
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
                            hidden: true
                        }
                    )
                },
                text: "Hide",
                icon: "fa fa-eye-slash"
            },
            unhide: {
                className: null,
                onClick: () => {
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
                            hidden: false
                        }
                    )
                },
                text: "Unhide",
                icon: "fa fa-eye"
            }
        }
    const maxLength = 220
    let messageIsLong = false
    let cutMessage

    const [messageIsExtended, setMessageIsExtended] = useState(false)
    
    if(message.length >= maxLength && !messageIsExtended)
    {
        messageIsLong = true
        const truncated = message.substr(0, maxLength)
        const lastSpaceIndex = truncated.lastIndexOf(" ")
        const substring = truncated.substr(0, lastSpaceIndex)
        cutMessage = <span>{substring} <a className="btLoadWholeMessage" onClick={displayWholeMessage}>Mehr</a></span>
    }
    function displayWholeMessage() {
        setMessageIsExtended(true)
    }
    function buildContextMenuItems() {
        const array = [contextMenuItems.delete];
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
    const handlePut = (data) => {
        setEditMode(!editMode)
        onPut(data)
    }
    const getTimeAgo = (timestamp) => {
        const diff = now.getTime() - timestamp

        // Eine Minute in Millisekunden
        const minute = 60 * 1000
        // Eine Stunde in Millisekunden
        const hour = 60 * minute
        // Ein Tag in Millisekunden
        const day = 24 * hour
        // Eine Woche in Millisekunden
        const week = 7 * day
        // Ein Monat in Millisekunden
        const month = 30 * day

        if (diff < minute) {
            return 'vor weniger als einer Minute'
        }
        if (diff < hour) {
            const minutesAgo = Math.floor(diff / minute)
            return `vor ${minutesAgo} Minute${minutesAgo > 1 ? 'n' : ''}`
        } if (diff < day) {
            const hoursAgo = Math.floor(diff / hour)
            return `vor ${hoursAgo} Stunde${hoursAgo > 1 ? 'n' : ''}`
        } if (diff < day * 2) {
            return 'gestern'
        } if (diff < week) {
            const daysAgo = Math.floor(diff / day)
            return `vor ${daysAgo} Tag${daysAgo > 1 ? 'en' : ''}`
        }
        if (diff < month) {
            const weeksAgo = Math.floor(diff / week)
            return `vor ${weeksAgo} Woche${weeksAgo > 1 ? 'n' : ''}`
        }
        const monthsAgo = Math.floor(diff / month)
        return `vor ${monthsAgo} Monat${monthsAgo > 1 ? 'en' : ''}`   
    } 
    return(
        <div>
            {(chayns.env.user.adminMode || !hidden)
            &&
                <div className = {styles.newsEntryFrame}>
                    <div className= "content__card" id = {id}>
                        <a name={id} />
                        {chayns.env.user.adminMode &&
                            <div className = {styles.newsEntryHeader}>
                                {hidden && <div className = {styles.labelOnHide}>Ausgeblendet</div>}
                                <div className = {styles.contextMenuFrame}>
                                    <ContextMenu
                                        items = {
                                            buildContextMenuItems()
                                        }
                                        className = {styles.contextMenu}
                                        /*
                                        onLayerClick = {
                                            (event) => {
                                                console.log("clicked layer ,", event)
                                            }
                                        }
                                        */
                                    />
                                </div>
                            </div>
                        }
                        {(chayns.env.user.adminMode && editMode)
                        ?   
                            <div>
                                <EditNewsEntry
                                    id = {id}
                                    siteId={siteId}
                                    tappId={tappId}
                                    onPublish = {handlePut}
                                    now = {now}
                                    initMessage = {message}
                                    initTitle = {title}
                                    initImageList = {imageList}
                                />
                            </div>
                        :
                            <div>
                                { imageList && imageList.length !== 0
                                ?
                                    <Gallery images={imageList} />
                                :
                                    ""
                                }
                                <h2>{title}</h2>
                                {messageIsLong ? cutMessage : message}
                                <Footer date = {getTimeAgo(publishTimestamp)} id = {id} frontendURL = {frontendURL} />
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
NewsEntry.propTypes = {
    id: PropTypes.string.isRequired,
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    imageList: PropTypes.arrayOf(PropTypes.string),
    publishTime: PropTypes.string.isRequired,
    publishTimestamp: PropTypes.number.isRequired,
    onPut: PropTypes.func.isRequired,
    onPatch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    frontendURL: PropTypes.string.isRequired,
    now: PropTypes.shape({
        getTime: PropTypes.func
    }).isRequired,
    hidden: PropTypes.bool.isRequired
}
NewsEntry.defaultProps = {
    title : "",
    imageList: []
}
export default NewsEntry