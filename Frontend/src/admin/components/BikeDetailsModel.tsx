import React, { useState } from 'react';
import Model from '../../components/Model';
import { Bike } from '../../Types';

export type BikeDetailsInput = Bike & {
    image: File | null;
}

interface BikeDetailsModelProps {
    heading?: string;
    bikeDetails: Bike;
    onSubmit?: (bikeData: BikeDetailsInput) => void;
    onClose: () => void;
    submitBtnLabel?: string;
}

const BikeDetailsModel: React.FC<BikeDetailsModelProps> = ({ heading = "Bike Model", bikeDetails, onSubmit = () => { }, onClose, submitBtnLabel = "SUBMIT" }): React.JSX.Element => {
    const [bikeData, setBikeData] = useState<BikeDetailsInput>({
        _id: bikeDetails?._id || "",
        bikeModel: bikeDetails?.bikeModel || "",
        pricePerHour: bikeDetails?.pricePerHour || 0,
        isAvailable: bikeDetails?.isAvailable || true,
        brand: bikeDetails?.brand || "",
        cc: bikeDetails?.cc || 0,
        horsePower: bikeDetails?.horsePower || 0,
        type: bikeDetails?.type || "",
        images: bikeDetails?.images || [],
        image: null
    });
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(bikeDetails?.images[0] || 'bike.svg');

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
        <Model heading={heading} onClose={onClose}>
            <div className='modal-body form d-flex flex-column px-5'>
                {bikeData?._id && <label className='form-label'>
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
                    onClick={onClose}
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
                        images: [],
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

export default BikeDetailsModel;