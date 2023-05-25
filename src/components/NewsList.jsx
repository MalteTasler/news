import React from "react"
import PropTypes from "prop-types"
import NewsEntry from "./NewsEntry"

const NewsList = ({news, now}) =>
    <div id = "news_list">
        {console.log("render news list ", news)}
        {news.map(element => <NewsEntry key={element.id} title = {element.headline} message = {element.message} imageList = {element.imageList} publishTimestamp = {element.publishTimestamp} now = {now} />)}
    </div>
NewsList.propTypes = {
    news: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string
    })).isRequired,
    now: PropTypes.shape({}).isRequired
}
export default NewsList