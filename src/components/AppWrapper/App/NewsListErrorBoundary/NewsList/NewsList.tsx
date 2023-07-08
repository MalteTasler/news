import React from "react"
import PropTypes from "prop-types"
import { NewsListProps } from "constants/types"
import NewsEntry from "./NewsEntry/NewsEntry"

require('../../../../../constants/chayns.d')
require('../../../../../constants/chayns-components.d')

const NewsList = ({ siteId, tappId, news, now, onPatch, onDelete } : NewsListProps) =>
    <div id = "news_list">
        {
            news.map((element) =>
            {
                if(!element)
                    return "no content"
                return (
                    (element && element.id && element.publishTime)
                    &&
                        <NewsEntry
                            key = {element.id}
                            id = {element.id}
                            siteId = {siteId}
                            tappId = {tappId}
                            title = {element.headline}
                            message = {element.message}
                            imageList = {element.imageList}
                            publishTime = {element.publishTime}
                            publishTimestamp = {element.publishTimestamp}
                            onPatch = {onPatch}
                            onDelete = {onDelete}
                            now = {now}
                            hidden = {element.hidden || false}
                        />
                )
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
    onPatch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
}

NewsList.DisplayName = "NewsList"

export default NewsList