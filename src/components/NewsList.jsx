import React, { useState } from "react"
import PropTypes from "prop-types"
import NewsEntry from "./NewsEntry"

const NewsList = ({news, now, onPatch, onDelete, frontendURL}) =>
    <div id = "news_list">
        {
            news.map(element =>
            {
                if(!element)
                    return ""
                return (element && element.id && element.imageList && element.publishTime && element.publishTimestamp)
                ?
                    <NewsEntry
                        key={element.id}
                        id={element.id}
                        title = {element.headline}
                        message = {element.message}
                        imageList = {element.imageList}
                        publishTimestamp = {element.publishTimestamp}
                        onPatch = {onPatch}
                        onDelete = {onDelete}
                        frontendURL = {frontendURL}
                        now = {now}
                    />
                : 
                    ""
            })
        }
    </div>
NewsList.propTypes = {
    news: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string
    })).isRequired,
    now: PropTypes.shape({}).isRequired,
    onPatch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    frontendURL: PropTypes.string.isRequired
}
export default NewsList