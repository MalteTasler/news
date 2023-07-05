import React from "react"
import PropTypes from "prop-types"
import { Accordion } from 'chayns-components'
import EditNewsEntry from "../../../shared/EditNewsEntry/EditNewsEntry"
import styles from "./AddNewsEntry.module.scss"

const AddNewsEntry = ({ siteId, tappId, onPublish, now }) => 
    <Accordion
        head = "Create News Entry"
    >
        <div className = {styles.addNewsEntryFrame}>
            <EditNewsEntry
                id = {0}
                siteId = {siteId as string}
                tappId = {tappId as number}
                onPublish = {onPublish as (id: number, title: string, message: string, imageList: string[], publishTime: string, publishTimestamp: number, hidden: boolean) => void}
                now = {now as {getTime: () => number}}
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

AddNewsEntry.DisplayName = "AddNewsEntry"

export default AddNewsEntry