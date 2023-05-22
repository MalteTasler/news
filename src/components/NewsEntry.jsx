import React from "react"
import PropTypes from "prop-types"
import { Gallery, SharingBar } from 'chayns-components'
import Footer from './Footer'

const NewsEntry = ({title, message, imageList, publishTimestamp, now}) =>
{
    const getTimeAgo = (timestamp) => {
        const diff = now.getTime() - timestamp;

        // Eine Minute in Millisekunden
        const minute = 60 * 1000;
        // Eine Stunde in Millisekunden
        const hour = 60 * minute;
        // Ein Tag in Millisekunden
        const day = 24 * hour;
        // Eine Woche in Millisekunden
        const week = 7 * day;
        // Ein Monat in Millisekunden
        const month = 30 * day;

        if (diff < minute) {
            return 'vor weniger als einer Minute';
        }
        if (diff < hour) {
            const minutesAgo = Math.floor(diff / minute);
            return `vor ${minutesAgo} Minute${minutesAgo > 1 ? 'n' : ''}`;
        } if (diff < day) {
            const hoursAgo = Math.floor(diff / hour);
            return `vor ${hoursAgo} Stunde${hoursAgo > 1 ? 'n' : ''}`;
        } if (diff < day * 2) {
            return 'gestern';
        } if (diff < week) {
            const daysAgo = Math.floor(diff / day);
            return `vor ${daysAgo} Tag${daysAgo > 1 ? 'en' : ''}`;
        }
        if (diff < month) {
            const weeksAgo = Math.floor(diff / week);
            return `vor ${weeksAgo} Woche${weeksAgo > 1 ? 'n' : ''}`;
        }
        const monthsAgo = Math.floor(diff / month);
        return `vor ${monthsAgo} Monat${monthsAgo > 1 ? 'en' : ''}`;   
    }

    return(
        <div className = "news content__card">
            <Gallery images={imageList} />
            <h2>{title}</h2>
            {message}
            <Footer date = {getTimeAgo(publishTimestamp)} />
        </div>
    )
}
NewsEntry.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    imageList: PropTypes.arrayOf(PropTypes.string),
    publishTimestamp: PropTypes.number.isRequired,
    now: PropTypes.shape({}).isRequired
}
NewsEntry.defaultProps = {
    title : "",
    imageList: []
}
export default NewsEntry