import React from "react"
import PropTypes from "prop-types"
import { Accordion, Checkbox } from 'chayns-components'
import styles from "./DeveloperTools.module.css"

const DeveloperTools = ({numberOfDisplayedNews, numberOfFetchedNews, numberOfDatabaseNews, showNews, cbShowNewsOnChange, useDevBackend, cbUseDevBackendOnChange}) =>
    <Accordion head = "Developer Tools" open dafaultOpened>
        <div className = {styles.developerToolsFrame}>  
            Number of News in the databse = {numberOfDatabaseNews}<br />
            Number of fetched News = {numberOfFetchedNews}<br />
            Number of displayed News = {numberOfDisplayedNews}
            <Checkbox
                checked = {useDevBackend}
                onChange = {cbUseDevBackendOnChange}
                className = {styles.cbShowMore}
            >
                Use Dev Backend
            </Checkbox>
            <Checkbox
                checked = {showNews}
                onChange = {cbShowNewsOnChange}
                className = {styles.cbShowMore}
            >
                Show news
            </Checkbox>
            <br />
            <u>Sources: </u>
            <ul>
                <li>
                    Frontend Code: <a href="https://github.com/MalteTasler/news" target="_blank" rel="noreferrer">GitHub</a>
                </li>
                <li>
                    Backend Code: <a href="https://schule.chayns.site/admin/code-editor?backendId=f11828e3" target="_blank" rel="noreferrer">chayns.Codes</a>
                </li>
            </ul>
        </div>
    </Accordion>

DeveloperTools.propTypes = {
    numberOfDatabaseNews: PropTypes.number.isRequired,
    numberOfFetchedNews: PropTypes.number.isRequired,
    numberOfDisplayedNews: PropTypes.number.isRequired,
    showNews: PropTypes.bool.isRequired,
    cbShowNewsOnChange: PropTypes.func.isRequired,
    useDevBackend: PropTypes.bool.isRequired,
    cbUseDevBackendOnChange: PropTypes.func.isRequired
}
export default DeveloperTools