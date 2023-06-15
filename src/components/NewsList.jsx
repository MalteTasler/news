import React, { useState } from "react"
import PropTypes from "prop-types"
import NewsEntry from "./NewsEntry"

const NewsList = ({news, now, onPut, onPatch, onDelete, frontendURL}) =>
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
                        publishTime = {element.publishTime}
                        publishTimestamp = {element.publishTimestamp}
                        onPut = {onPut}
                        onPatch = {onPatch}
                        onDelete = {onDelete}
                        frontendURL = {frontendURL}
                        now = {now}
                        hidden = {element.hidden}
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
    onPut: PropTypes.func.isRequired,
    onPatch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    frontendURL: PropTypes.string.isRequired
}
export default NewsList