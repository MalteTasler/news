import React from "react"
import PropTypes from "prop-types"
import { Accordion } from 'chayns-components'
import EditNewsEntry from "./EditNewsEntry"
import styles from "./AddNewsEntry.module.css"

const AddNewsEntry = ({tappId, onPublish, now}) => 
    <Accordion
        head = "Create News Entry"
    >
        <div id = {styles.addNewsEntryFrame}>
            <EditNewsEntry
                id=""
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
    tappId: PropTypes.number.isRequired,
    onPublish: PropTypes.func.isRequired,
    now: PropTypes.shape({
        getTime: PropTypes.func
    }).isRequired
}
export default AddNewsEntry