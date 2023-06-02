import React from "react"
import PropTypes from "prop-types"
import NewsEntry from "./NewsEntry"

const NewsList = ({news, now, onDelete, frontendURL}) =>
    <div id = "news_list">
        {
            news.map(element =>
            {
                if(!element)
                    return ""
                return (element && element.headline && element.id && element.imageList && element.message && element.publishTime && element.publishTimestamp)
                ? <NewsEntry key={element.id} id={element.id} title = {element.headline} message = {element.message} imageList = {element.imageList} publishTimestamp = {element.publishTimestamp} onDelete = {onDelete} frontendURL = {frontendURL} now = {now} />
                : ""
            })
        }
    </div>
NewsList.propTypes = {
    news: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string
    })).isRequired,
    now: PropTypes.shape({}).isRequired,
    onDelete: PropTypes.func.isRequired,
    frontendURL: PropTypes.string.isRequired
}
export default NewsList