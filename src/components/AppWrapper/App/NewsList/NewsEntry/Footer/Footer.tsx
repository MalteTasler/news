import React from "react"
import PropTypes from "prop-types"
import { SharingBar, Tooltip } from 'chayns-components'
import styles from "./Footer.module.scss"

const Footer = ({ date, dateAbsolute, id }) =>
    <div className = {styles.newsFooter}>
        <SharingBar 
            link = {`${FRONTEND_URLS[0]}?M=${id as number}`} 
            linkText="Link" 
            stopPropagation
        />
        <Tooltip
            content = {{
                text : `${new Date(dateAbsolute as string).toLocaleDateString("de-DE", {
                            weekday: "long", 
                            day: "numeric", 
                            month: "long", 
                            year: "numeric"
                        })}, ${new Date(dateAbsolute as string).toLocaleTimeString("de-DE")} Uhr`
            }}
            minWidth = {200}
            bindListeners
        >
            <div
                className = {styles.timeDisplay}
            >
                {date}
            </div>
        </Tooltip>
    </div>
   
Footer.propTypes = {
    date: PropTypes.string.isRequired,
    dateAbsolute: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
}

Footer.DisplayName = "Footer"

export default Footer