import React from "react"
import PropTypes from "prop-types"
import { Accordion } from 'chayns-components'
import { AddNewsEntryProps } from "constants/types"
import EditNewsEntry from "../../../shared/EditNewsEntry/EditNewsEntry"
import styles from "./AddNewsEntry.module.scss"

require('../../../../constants/chayns.d')
require('../../../../constants/chayns-components.d')

const AddNewsEntry = ({ siteId, tappId, onPublish, now } : AddNewsEntryProps) => 
    <Accordion
        head = "Create News Entry"
    >
        <div className = {styles.addNewsEntryFrame}>
            <EditNewsEntry
                id = {0}
                siteId = {siteId }
                tappId = {tappId }
                onPublish = {onPublish}
                now = {now}
                initMessage = ""
                initTitle = ""
                initImageList = {[]}
                initIsHidden = {false}
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