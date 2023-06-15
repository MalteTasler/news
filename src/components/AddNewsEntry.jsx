import React, {useCallback, useState} from "react"
import PropTypes from "prop-types"
import { Accordion } from 'chayns-components'
import EditNewsEntry from "./EditNewsEntry"
import styles from "./AddNewsEntry.module.css"

const AddNewsEntry = ({onPublish, now}) => 
    <Accordion
        head = "Create News Entry"
    >
        <div id = {styles.addNewsEntryFrame}>
            <EditNewsEntry
                id=""
                onPublish = {onPublish}
                now = {now}
                initMessage = ""
                initTitle = ""
                initImageList = {[]}
            />
        </div>
    </Accordion>
AddNewsEntry.propTypes = {
    onPublish: PropTypes.func.isRequired,
    now: PropTypes.shape({
        getTime: PropTypes.func
    }).isRequired
}
export default AddNewsEntry