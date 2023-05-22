import React from "react"
import PropTypes from "prop-types"
import { Accordion, Input, Button } from 'chayns-components'
import styles from "./AddNewsEntry.module.css"

const AddNewsEntry = ({onPublish}) => {
    const[message, setMessage] = React.useState("")
    return (
        <Accordion
            head = "Create News Entry"
        >
            <div id = {styles.addNewsEntryFrame}>
                <Input 
                    placeholder = "Enter your message here." 
                    value = {message}
                    onChange = {setMessage}
                />
                <Button id = {styles.btPublish} onClick={onPublish}>Publish</Button>
            </div>
            {message}
        </Accordion>
    )
}
AddNewsEntry.propTypes = {
    onPublish: PropTypes.func.isRequired
}
export default AddNewsEntry