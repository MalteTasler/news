import React from "react"
import PropTypes from "prop-types"
import { Accordion } from 'chayns-components'
import styles from "./DeveloperTools.module.css"

const DeveloperTools = ({numberOfDisplayedNews, numberOfFetchedNews, numberOfDatabaseNews}) =>
    <Accordion head = "Developer Tools" open dafaultOpened>
        <div className = {styles.developerToolsFrame}>  
            Number of News in the databse = {numberOfDatabaseNews}<br />
            Number of fetched News = {numberOfFetchedNews}<br />
            Number of displayed News = {numberOfDisplayedNews}
        </div>
    </Accordion>

DeveloperTools.propTypes = {
    numberOfDatabaseNews: PropTypes.number.isRequired,
    numberOfFetchedNews: PropTypes.number.isRequired,
    numberOfDisplayedNews: PropTypes.number.isRequired
}
export default DeveloperTools