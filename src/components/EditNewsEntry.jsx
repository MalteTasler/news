import React, {useCallback, useState} from "react"
import PropTypes from "prop-types"
import { Gallery, FileInput, Input, Button } from 'chayns-components'
import imageUpload from "chayns-components/lib/utils/imageUpload"
import styles from "./EditNewsEntry.module.css"
import appStyles from "./App.module.css"

const EditNewsEntry = ({id, siteId, tappId, onPublish, now, initMessage, initTitle, initImageList}) =>
{
    const [message, setMessage] = useState(initMessage)
    const [title, setTitle] = useState(initTitle)
    const [images, setImages] = useState(initImageList.map((image) => ({ url: image})))
    const [displayPath, setDisplayPath] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    let imageURLs = [];

    async function handlePublish() {
        await postImages()
        onPublish(
            {
                id,
                siteId,
                tappId,
                imageList: imageURLs,
                headline: title,
                message,
                publishTime: now,
                publishTimestamp: now.getTime(),
                hidden: false
            }
        )
    }
    const onChange = useCallback(
        (validFiles) => {
            if(!isUploading)
            {
                setImages(images.concat(validFiles.map((f) => ({ file: f }))))
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
    }, [images, setImages])
    async function postImages() {
        // console.log("images list ", images)
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
            }));
        setIsUploading(false);
    }
    return(
        <div>
            <p>{displayPath}</p>
            {images.length > 0 
            ? 
                <Gallery
                    images = {images}
                    deleteMode
                    onDelete={onDelete}
                    dragMode
                    onDragEnd={onDragEnd}
                />
            : 
                "choose image"
            }
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
    )
}
EditNewsEntry.propTypes = {
    id: PropTypes.string.isRequired,
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    onPublish: PropTypes.func.isRequired,
    now: PropTypes.shape({
        getTime: PropTypes.func
    }).isRequired,
    initMessage: PropTypes.string.isRequired,
    initTitle: PropTypes.string.isRequired,
    initImageList: PropTypes.arrayOf(PropTypes.string).isRequired
}
export default EditNewsEntry