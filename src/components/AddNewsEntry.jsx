import React from "react"
import PropTypes from "prop-types"
import { Accordion } from 'chayns-components'
import EditNewsEntry from "./EditNewsEntry"
import styles from "./AddNewsEntry.module.css"

const AddNewsEntry = ({siteId, tappId, onPublish, now}) => 
    <Accordion
        head = "Create News Entry"
    >
        <div id = {styles.addNewsEntryFrame}>
            <EditNewsEntry
                id=""
                siteId={siteId}
                tappId = {tappId}
                onPublish = {onPublish}
                now = {now}
                initMessage = ""
                initTitle = ""
                initImageList = {[]}
            />
        </div>
    </Accordion>
AddNewsEntry.propTypes = {
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    onPublish: PropTypes.func.isRequired,
    now: PropTypes.shape({
        getTime: PropTypes.func
    }).isRequired
}
export default AddNewsEntry