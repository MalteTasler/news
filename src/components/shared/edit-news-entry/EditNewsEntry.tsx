import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Gallery, FileInput, Input, TextArea, Button } from 'chayns-components';
import imageUpload from 'chayns-components/lib/utils/imageUpload';
import { EditNewsEntryProps } from 'constants/types';
import './editNewsEntry.scss';

require('../../../constants/chayns.d');
require('../../../constants/chayns-components.d');

const EditNewsEntry = ({
    id,
    siteId,
    tappId,
    onPublish,
    initMessage,
    initTitle,
    initImageList,
    initIsHidden,
}: EditNewsEntryProps) => {
    const [message, setMessage] = useState<string>(initMessage);
    const [title, setTitle] = useState<string>(initTitle);
    const [images, setImages] = useState<Array<{ url: string }>>(
        initImageList.map((image: string) => ({ url: image }))
    );
    const [isHidden] = useState<boolean>(initIsHidden);
    const [displayPath, setDisplayPath] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    let imageURLs: string[] = [];

    async function handlePublish() {
        await postImages();
        onPublish({data: {
            id,
            siteId,
            tappId,
            imageList: imageURLs,
            headline: title,
            message,
            hidden: isHidden,
        }});
    }

    const onImageListChange = useCallback(
        (validFiles: {
            map: (
                arg0: (f: unknown) => { file: unknown }
            ) => ConcatArray<{ url: string }>;
        }) => {
            if (!isUploading) {
                setImages(images.concat(
                    validFiles.map(
                        (f) => ({ file: f })
                    )
                ));
            }
        },
        [images, setImages, isUploading]
    );

    const onImageListDelete = useCallback(
        (_image: unknown, index: number) => {
            const img = images.slice();
            img.splice(index, 1);
            setImages(img);
        },
        [images, setImages]
    );

    const onImageListDragEnd = useCallback(
        (imgs: React.SetStateAction<{ url: string; }[]>) => {
            setImages(imgs);
        },
        [setImages]
    );

    const onImageListClick = useCallback(async () => {
        const data = await chayns.dialog.mediaSelect({ multiselect: true });
        setImages(
            images.concat(data.selection.map((url: string) => ({ url })))
        );
    }, [images, setImages]);

    async function postImages() {
        setIsUploading(true);
        imageURLs = [];
        await Promise.all(
            images.map(async (image) => {
                const result = await imageUpload(
                    image.file || image.url,
                    'componentsTestUpload',
                    chayns.env.user.personId,
                    siteId
                );
                imageURLs.push(`${result.base}/${result.key}`);
                setDisplayPath(`${displayPath}${result.base}/${result.key}\n`);
            })
        );
        setIsUploading(false);
    }

    return (
        <div className="editNewsEntry">
            {images.length > 0 && (
                <Gallery
                    images={images}
                    deleteMode
                    onDelete={onImageListDelete}
                    dragMode
                    onDragEnd={onImageListDragEnd}
                />
            )}
            <FileInput
                items={[
                    {
                        types: FileInput.typePresets.TSIMG_CLOUD, // only images are allowed
                        maxFileSize: 4194304, // maximal file size is 4 MB
                        maxNumberOfFiles: 100, // maximal number of files
                        onChange: onImageListChange,
                        content: { text: 'Bild hochladen' },
                    },
                    {
                        onClick: onImageListClick,
                        content: {
                            text: 'Bild auswählen',
                            icon: 'ts-image',
                        },
                    },
                ]}
            />
            <div className="editNewsEntry__titleInputFrame">
                <Input 
                    placeholder="Title" 
                    value={title} 
                    onChange={setTitle} 
                />
            </div>
            <div className="editNewsEntry__messageInputFrame">
                <TextArea
                    placeholder="Enter your message here."
                    value={message}
                    onChange={setMessage}
                    autogrow
                />
            </div>
            <div className="editNewsEntry__btPublishContainer">
                <Button
                    className="editNewsEntry__btPublishContainer__btPublish"
                    onClick={() => handlePublish()}
                >
                    Veröffentlichen
                </Button>
            </div>
        </div>
    );
};

EditNewsEntry.propTypes = {
    id: PropTypes.number.isRequired,
    siteId: PropTypes.string.isRequired,
    tappId: PropTypes.number.isRequired,
    onPublish: PropTypes.func.isRequired,
    initMessage: PropTypes.string.isRequired,
    initTitle: PropTypes.string.isRequired,
    initImageList: PropTypes.arrayOf(PropTypes.string).isRequired,
    initIsHidden: PropTypes.bool.isRequired,
};

EditNewsEntry.DisplayName = 'EditNewsEntry';

export default EditNewsEntry;