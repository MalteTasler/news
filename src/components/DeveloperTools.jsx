import React, { useState } from "react"
import PropTypes from "prop-types"
import { Accordion, SelectButton, Checkbox } from 'chayns-components'
import styles from "./DeveloperTools.module.css"

const DeveloperTools = ({siteId, tappId, numberOfDisplayedNews, numberOfFetchedNews, numberOfDatabaseNews, showNews, cbShowNewsOnChange, useBackend, setUseBackend}) => {
    // console.log("render dev tools, provides ", useBackend)
    const sbBackendList = [
            {
                id: '0',
                name: 'chayns.codes',
                isSelected: useBackend === 0
            },
            {
                id: '1',
                name: 'ASP.NET lokal',
                isSelected: useBackend === 1
            }
    ]
    const [copiedSiteId, setCopiedSiteId] = useState(false)
    const [copiedTappId, setCopiedTappId] = useState(false)
    const copySiteId = () => {
        navigator.clipboard.writeText(siteId)
        setCopiedSiteId(true)
    }
    const copyTappId = () => {
        navigator.clipboard.writeText(tappId)
        setCopiedTappId(true)
    }
    return(
        <Accordion head = "Developer Tools" open dafaultOpened>
            <div className = {styles.developerToolsFrame}>  
                <div className = {styles.IdDisplay} onClick={copySiteId}>
                    <div className = {styles.IdLabel}>    
                        SiteId = {siteId}
                    </div>
                    <i className = "fa fa-copy" />
                    {
                        copiedSiteId &&
                        <div className = {styles.IdCopiedLabel}>
                            ✅ Copied to clipboard.
                        </div>
                    }
                    <br />
                </div>
                <div className = {styles.IdDisplay} onClick={copyTappId}>
                    <div className = {styles.IdLabel}>    
                        TappId = {tappId}
                    </div>
                    <i className = "fa fa-copy" />
                    {
                        copiedTappId &&
                        <div className = {styles.IdCopiedLabel}>
                            ✅ Copied to clipboard.
                        </div>
                    }
                    <br />
                </div>
                Number of News in the databse = {numberOfDatabaseNews}<br />
                Number of fetched News = {numberOfFetchedNews}<br />
                Number of displayed News = {numberOfDisplayedNews}
                <div 
                    className = {styles.selectBackend}
                >
                    Backend:
                    <SelectButton
                        label = "Select one"
                        title = "Select the backend"
                        list = {sbBackendList}
                        onSelect = {(data) => setUseBackend(data.selection[0].id)}
                        listKey = "id"
                        listValue = "name"
                        selectedFlag = "isSelected"
                        showSelection = {true}
                        className = {styles.selectButton}
                    />
                </div>
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
                        Backend Code: 
                        <ul>
                            <li>
                                <a href="https://schule.chayns.site/admin/code-editor?backendId=f11828e3" target="_blank" rel="noreferrer">chayns.Codes</a>
                            </li>
                            <li>
                                <a href="https://gitlab.tobit.com/MTasler/news-backend2" target="_blank" rel="noreferrer">GitLab (Tobit members only)</a>
                            </li>
                            <li>
                                <a href="https://github.com/MalteTasler/news-backend" target="_blank" rel="noreferrer">GitHub (Private - ask for permissions)</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </Accordion>
    )
}
DeveloperTools.propTypes = {
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    numberOfDatabaseNews: PropTypes.number,
    numberOfFetchedNews: PropTypes.number.isRequired,
    numberOfDisplayedNews: PropTypes.number.isRequired,
    showNews: PropTypes.bool.isRequired,
    cbShowNewsOnChange: PropTypes.func.isRequired,
    useBackend: PropTypes.number.isRequired,
    setUseBackend: PropTypes.func.isRequired
}
DeveloperTools.defaultProps = {
    numberOfDatabaseNews: null
}
export default DeveloperTools