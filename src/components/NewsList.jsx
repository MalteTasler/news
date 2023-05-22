import React from "react"
import PropTypes from "prop-types"
import NewsEntry from "./NewsEntry"

const NewsList = ({news, now}) => 
{
    console.log(news)
    return(
        <div id = "news_list">
            {news.map(element => <NewsEntry key={element.id} title = {element.name} message = {element.message} imageList = {element.imageList} publishTimestamp = {element.publishTimestamp} now = {now} />)}
        </div>
    )
}

NewsList.propTypes = {
    news: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,

    })).isRequired,
    now: PropTypes.shape({}).isRequired
}
export default NewsList