import React from "react"
import PropTypes from "prop-types"
import { SharingBar, Tooltip } from 'chayns-components'
import styles from "./Footer.module.css"

const Footer = ({date, dateAbsolute, id, frontendURL}) =>
    <div className = {styles.newsFooter}>
        <SharingBar link={`${frontendURL}?M=${id}`} linkText="Link" stopPropagation />
        <Tooltip
            content = {{
                text : `${new Date(dateAbsolute).toLocaleDateString("de-DE", {weekday: "long", day: "numeric", month: "long", year: "numeric"})}, ${new Date(dateAbsolute).toLocaleTimeString("de-DE")} Uhr`
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
    id: PropTypes.number.isRequired,
    frontendURL: PropTypes.string.isRequired
}
export default Footer