import React from "react"
import PropTypes from "prop-types"
import { SharingBar } from 'chayns-components'
import styles from "./Footer.module.css"

const Footer = ({date, id, frontendURL}) => 
    <div className = {styles.newsFooter}>
        <SharingBar link={`${frontendURL}?M=${id}`} linkText="Link" stopPropagation />
        {date}
    </div>
Footer.propTypes = {
    date: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    frontendURL: PropTypes.string.isRequired
}
export default Footer