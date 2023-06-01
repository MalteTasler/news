import React, {useCallback, useState} from "react"
import PropTypes from "prop-types"
import { Accordion, Input, Button, FileInput, Gallery } from 'chayns-components'
import imageUpload from "chayns-components/lib/utils/imageUpload"
import styles from "./AddNewsEntry.module.css"
import appStyles from "./App.module.css"

const AddNewsEntry = ({onPublish, now}) => {
    const [message, setMessage] = useState("")
    const [title, setTitle] = useState("")
    const [images, setImages] = useState([])
    const [imageSources, setImageSources] = useState([])
    const [displayPath, setDisplayPath] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    let imageURLs = [];

    async function handlePublish() {
        await postImages()
        console.log("finished uploading", imageSources)
        onPublish(
            {
                imageList: imageURLs,
                headline: title,
                message,
                publishTime: now,
                publishTimestamp: now.getTime()
            }
        )
    }
    const onChange = useCallback(
        (validFiles) => {
            if(!isUploading)
            {
                setImages(images.concat(validFiles.map((f) => ({ file: f }))))
                console.log("image files change ", images, validFiles)
            }
        },
        [images, setImages, isUploading]
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
    /*
    const upload = useCallback(async() => {
        await postImages()
    }, [images, setDisplayPath, postImages])
    */
    async function postImages() {
        setIsUploading(true)
        imageURLs = []
        await Promise.all(images.map(async (image) => {
            const result = await imageUpload(
                image.file || image.url,
                'componentsTestUpload',
                chayns.env.user.personId,
                chayns.env.site.id
                );
                imageURLs.push(`${result.base}/${result.key}`);
                setDisplayPath(`${displayPath}${result.base}/${result.key}\n`)
                console.log('Uploaded image', result, imageURLs);
            }));
        console.log("finished upload", imageURLs);
        setImageSources(imageURLs);
        console.log("images ", imageSources)
        setIsUploading(false);
    }

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
    now: PropTypes.shape({
        getTime: PropTypes.func
    }).isRequired
}
export default AddNewsEntry