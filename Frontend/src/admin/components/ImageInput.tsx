import React from 'react'
import { deleteImage, uploadFile } from '../../scripts/API Calls/imageApiCalls.ts';
import BASE_URL from '../../scripts/API Calls/apiUrl.ts';
import deleteIcon from '../../assets/delete.svg';

type Props = {
    values: string[];
    onChange: (images: string[]) => void;
}

const ImageInput = ({ values, onChange }: Props) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                uploadFile(files[i])
                    .then((imageUrl) => {
                        const imgUrl = imageUrl.split('\\').pop();
                        if (!imgUrl) {
                            console.error('Image URL is empty');
                            return;
                        }
                        onChange([...values, imgUrl]);
                    })
                    .catch((error) => {
                        console.error('Error uploading file:', error);
                    });
            }
            event.target.value = '';
            alert('Images uploaded successfully');
        } else {
            alert('No files selected');
        }
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                multiple
                className='mb-1 form-control'
                onChange={handleFileChange}
            />
            <div>
                {values.map((image, index) => (
                    <div className='d-inline-flex align-items-center mt-1 me-2' key={index}>
                        <img className='rounded border border-dark' src={BASE_URL + '/uploads/' + image} width={40} height={40} alt={`Uploaded preview ${index}`} />
                        <img
                            className='cursor-pointer mx-1'
                            onClick={() => {
                                deleteImage(image, () => {
                                    onChange(values.filter((img) => img !== image));
                                }, () => {
                                    alert('Failed to delete image');
                                });
                            }} width={20} height={20} src={deleteIcon}></img>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ImageInput