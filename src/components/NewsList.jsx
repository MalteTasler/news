import React from "react"
import PropTypes from "prop-types"
import NewsEntry from "./NewsEntry"

const NewsList = ({siteId, tappId, news, now, onPut, onPatch, onDelete, frontendURL}) =>
    <div id = "news_list">
        {
            news.map(element =>
            {
                if(!element)
                    return "no content"
                return (element && element.id && element.publishTime)
                ?
                    <NewsEntry
                        key={element.id}
                        id={element.id}
                        siteId={siteId}
                        tappId={tappId}
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
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    news: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number
    })).isRequired,
    now: PropTypes.shape({}).isRequired,
    onPut: PropTypes.func.isRequired,
    onPatch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    frontendURL: PropTypes.string.isRequired
}
export default NewsList