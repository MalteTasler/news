import React from "react"
import PropTypes from "prop-types"
import { SharingBar } from 'chayns-components'
import styles from "./Footer.module.css"

const Footer = ({date}) => 
        <div className = {styles.newsFooter}>
             <SharingBar link="abcdefghijk" linkText="a" />
             {date}
        </div>
Footer.propTypes = {
    date: PropTypes.string.isRequired
}
export default Footer