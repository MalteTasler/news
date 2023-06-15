import React from "react"
import PropTypes from "prop-types"
import { Accordion, Checkbox } from 'chayns-components'
import styles from "./DeveloperTools.module.css"

const DeveloperTools = ({numberOfDisplayedNews, numberOfFetchedNews, numberOfDatabaseNews, showNews, cbShowNewsOnChange}) =>
    <Accordion head = "Developer Tools" open dafaultOpened>
        <div className = {styles.developerToolsFrame}>  
            Number of News in the databse = {numberOfDatabaseNews}<br />
            Number of fetched News = {numberOfFetchedNews}<br />
            Number of displayed News = {numberOfDisplayedNews}
            <Checkbox
                checked = {showNews}
                onChange = {cbShowNewsOnChange}
                className = {styles.cbShowMore}
            >
                Show news
            </Checkbox>
        </div>
    </Accordion>

DeveloperTools.propTypes = {
    numberOfDatabaseNews: PropTypes.number.isRequired,
    numberOfFetchedNews: PropTypes.number.isRequired,
    numberOfDisplayedNews: PropTypes.number.isRequired,
    showNews: PropTypes.bool.isRequired,
    cbShowNewsOnChange: PropTypes.func.isRequired
}
export default DeveloperTools