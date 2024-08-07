import React, { useState } from 'react';
import { createBike } from '../../scripts/API Calls/bikeApiCalls';
import Model from '../Model';
import { Bike } from '../../Types';

const AddBike: React.FC = (): JSX.Element => {
    function onSubmitHandler(bikeData: BikeDetailsInput) {
        const formData = new FormData();

        // Append JSON data
        formData.append('bikeModel', bikeData.bikeModel || '');
        formData.append('pricePerHour', bikeData.pricePerHour?.toString() || '');
        formData.append('isAvailable', bikeData.isAvailable ? 'true' : 'false');
        formData.append('brand', bikeData.brand || '');
        formData.append('cc', bikeData.cc?.toString() || '');
        formData.append('horsePower', bikeData.horsePower?.toString() || '');
        formData.append('type', bikeData.type || '');
        // Append file
        if (bikeData.image instanceof File) {
            formData.append('image', bikeData.image, bikeData.image.name);
        }
        createBike(formData).then(() => {
            alert("Bike Added Successfully");
        })
    }

    return (
        <>
            <button
                className='btn bg-glass bg-deep-white p-3 mt-auto position-fixed end-0 bottom-0 m-4 me-5'
                style={{ lineHeight: 1, zIndex: 15 }}
                data-bs-toggle="modal"
                data-bs-target={"#addBikeModel"}>
                <div className='btn-close' style={{ transform: 'rotate(45deg)' }}></div>
            </button>
            <BikeDetailsModel
                heading="ADD BIKE"
                id="addBikeModel"
                bikeDetails={{ _id: "", bikeModel: "", pricePerHour: 0, isAvailable: true, brand: "", cc: 0, horsePower: 0, type: "", imageURL: "" }}
                onSubmit={onSubmitHandler} />
        </>
    )
}

export type BikeDetailsInput = Bike & {
    image: File | null;
}

interface BikeDetailsModelProps {
    heading?: string;
    id: string;
    bikeDetails: Bike;
    onSubmit?: (bikeData: BikeDetailsInput) => void;
    submitBtnLabel?: string;
}

export const BikeDetailsModel: React.FC<BikeDetailsModelProps> = ({ heading = "Bike Model", id, bikeDetails, onSubmit = () => { }, submitBtnLabel = "SUBMIT" }): JSX.Element => {
    const [bikeData, setBikeData] = useState<BikeDetailsInput>({
        _id: bikeDetails._id || "",
        bikeModel: bikeDetails.bikeModel || "",
        pricePerHour: bikeDetails.pricePerHour || 0,
        isAvailable: bikeDetails.isAvailable || true,
        brand: bikeDetails.brand || "",
        cc: bikeDetails.cc || 0,
        horsePower: bikeDetails.horsePower || 0,
        type: bikeDetails.type || "",
        imageURL: bikeDetails.imageURL || "",
        image: null
    });
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(bikeDetails.imageURL || 'bike.svg');

    const handleBikeDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setBikeData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : (type === 'file' ? e.target.files?.[0] : value)
        }));

        if (type === 'file') {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                // Create a preview URL for the selected image
                const reader = new FileReader();
                reader.onload = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(selectedFile);
            }
        }
    };
    return (
        <Model heading={heading} id={id}>
            <div className='modal-body form d-flex flex-column px-5'>
                {bikeData._id && <label className='form-label'>
                    <input className='m-0 form-control' name="_id" value={bikeData._id} disabled readOnly placeholder="Bike ID" />
                </label>}
                <label className='form-label'>
                    <input type='text' className='m-0 form-control' name="bikeModel" value={bikeData.bikeModel} onChange={handleBikeDataChange} placeholder="Bike Model" />
                </label>
                <label className='form-label'>
                    <input type='text' className='m-0 form-control' name="pricePerHour" value={bikeData.pricePerHour} onChange={handleBikeDataChange} placeholder="Price (/hr)" />
                </label>
                <div className="form-check d-flex align-items-center ps-1 mb-2">
                    <label className="form-check-label me-2" htmlFor='isAvailable'>Is Available</label>
                    <input className='m-0 form-check-input' id='isAvailable' name="isAvailable" type='checkbox' checked={bikeData.isAvailable} onChange={handleBikeDataChange} />
                </div>
                <label className='form-label'>
                    <input type='text' className='m-0 form-control' name="brand" value={bikeData.brand} onChange={handleBikeDataChange} placeholder="Brand" />
                </label>
                <label className='form-label'>
                    <input type='number' className='m-0 form-control' name="cc" value={bikeData.cc} onChange={handleBikeDataChange} placeholder="CC" />
                </label>
                <label className='form-label'>
                    <input type='number' className='m-0 form-control' name="horsePower" value={bikeData.horsePower} onChange={handleBikeDataChange} placeholder="Horse Power" />
                </label>
                <label className='form-label'>
                    <input className='m-0 form-control' name="type" value={bikeData.type} onChange={handleBikeDataChange} placeholder="Type" />
                </label>
                <label className='form-label d-flex justify-content-center'>
                    <input type='file' name='image' accept='image/*' className='m-0' style={{ display: 'none' }} onChange={handleBikeDataChange}></input>
                    <img
                        style={{ background: `rgba(0, 0, 0, 0.1)`, objectFit: 'cover', objectPosition: 'center' }}
                        src={imagePreview ? (imagePreview as string) : 'bike.svg'}
                        className='rounded w-100'></img>
                </label>
            </div>
            <div className="modal-footer mx-auto">
                <button
                    type="button"
                    className="btn btn-outline-dark border-2 border-dark"
                    data-bs-dismiss="modal"
                >Close</button>
                <button type="button" className="btn btn-outline-dark border-2" onClick={() => {
                    setBikeData({
                        _id: bikeDetails._id,
                        bikeModel: "",
                        pricePerHour: 0,
                        isAvailable: true,
                        brand: "",
                        cc: 0,
                        horsePower: 0,
                        type: "",
                        imageURL: "",
                        image: null
                    })
                    setImagePreview('bike.svg');
                }} >Clear</button>
                <button type="button" className="btn border-2 btn-dark" onClick={e => {
                    e.preventDefault()
                    if (!bikeData.bikeModel || !bikeData.pricePerHour || !bikeData.brand || !bikeData.cc || !bikeData.horsePower || !bikeData.type) {
                        alert("Please fill in all the required fields");
                        return;
                    }
                    onSubmit(bikeData);
                }} >{submitBtnLabel}</button>
            </div>
        </Model>
    )
}

export default AddBike;