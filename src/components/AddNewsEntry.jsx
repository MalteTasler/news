import React, {useCallback, useState} from "react"
import PropTypes from "prop-types"
import { Accordion, Input, Button, FileInput, Gallery } from 'chayns-components'
import imageUpload from '../../node_modules/chayns-components/lib/utils/imageUpload'
import styles from "./AddNewsEntry.module.css"
import appStyles from "./App.module.css"

const AddNewsEntry = ({onPublish, now}) => {
    const [message, setMessage] = useState("")
    const [title, setTitle] = useState("")
    const [images, setImages] = useState([])
    const [displayPath, setDisplayPath] = useState('')

    let imageURLs = [];

    async function handlePublish() {
        console.log("begin upload")
        await upload()
        console.log("upload finished")
        onPublish(
            {
                imageList: images,
                headline: title,
                message,
                publishTime: now,
                publishTimestamp: now.getTime()
            },
            imageURLs
        )
    }
    const onChange = useCallback(
        (validFiles) => {
            setImages(images.concat(validFiles.map((f) => ({ file: f }))))
            console.log("image files change ", images, validFiles)
        },
        [images, setImages]
    )
    const onDelete = useCallback(
        (image, index) => {
            const img = images.slice()
            img.splice(index, 1)
            setImages(img)
        },
        [images, setImages]
    )
    const onDragEnd = useCallback(
        (imgs) => {
            setImages(imgs)
        },
        [setImages]
    )
    const onClick = useCallback(async () => {
        const data = await chayns.dialog.mediaSelect({ multiselect: true })
        setImages(images.concat(data.selection.map((url) => ({ url }))))
        console.log("image files ", images)
    }, [images, setImages])
    
    const upload = useCallback(async() => {
        imageURLs = []
        images.forEach(async(image) => {
            const result = await imageUpload(
                image.file || image.url,
                'componentsTestUpload',
                chayns.env.user.personId,
                chayns.env.site.id
            )
            imageURLs.push(result.base + result.key)
            console.log('Uploaded image', result)
            setDisplayPath(`${displayPath}${result.base}/${result.key}\n`)
        })
    }, [images, setDisplayPath])
    return (
        <Accordion
            head = "Create News Entry"
        >
            <div id = {styles.addNewsEntryFrame}>
                <p>{displayPath}</p>
                {images.length > 0 ? <Gallery
                    images = {images}
                    deleteMode
                    onDelete={onDelete}
                    dragMode
                    onDragEnd={onDragEnd}
                /> : "choose image"}
                <FileInput 
                    items = 
                    {[
                        {
                            types: FileInput.typePresets.TSIMG_CLOUD, // only images are allowed
                            maxFileSize: 4194304, // max file size is 4 MB
                            maxNumberOfFiles: 0, // no limit for number of files
                            onChange,
                            content: { text: 'Bild hochladen' },
                        },
                        {
                            onClick,
                            content: {
                                text: 'Bild auswählen',
                                icon: 'ts-image',
                            },
                        },
                    ]}
                    /* onClick = {() => console.log("file")} */
                />
                <div id = {styles.addNewsEntryInputFrame}>
                    <Input 
                        placeholder = "Title" 
                        value = {title}
                        onChange = {setTitle}
                    />
                </div>
                <div id = {styles.addNewsEntryInputFrame}>
                    <Input 
                        placeholder = "Enter your message here." 
                        value = {message}
                        onChange = {setMessage}
                    />
                </div>
                <div className = {appStyles.btContainer}>
                    <Button id = {styles.btPublish} onClick={() => handlePublish()}>
                        Publish
                    </Button>
                </div>
            </div>
        </Accordion>
    )
}
AddNewsEntry.propTypes = {
    onPublish: PropTypes.func.isRequired,
    now: PropTypes.shape({}).isRequired
}
export default AddNewsEntry