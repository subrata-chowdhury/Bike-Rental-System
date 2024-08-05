import React, { useState } from 'react';
import { deleteBike, getBikeCounts, getBikesByIndex, updateBike } from '../../scripts/API Calls/bikeApiCalls';
import AddBike from './AddBike';
import Filter, { FilterData } from '../Filter';
import Pages from '../Pages';

interface Props {
    // Define your component props here
}

const Bikes: React.FC<Props> = (): JSX.Element => {
    const [bikeData, setBikeData] = useState<BikeCardProp[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(3)

    const getBikesByPage = async (page: number, filterData?: FilterData, searchData?: string | undefined): Promise<void> => {
        if (page <= 0) return;
        getBikesByIndex((page - 1) * 6, filterData, searchData, (data) => {
            setBikeData(data as BikeCardProp[]);
        }, true)
        getBikeCounts(filterData, searchData, true).then((data: any) => {
            setNoOfPages(Math.ceil(data.total / 6));
        })
    }
    return (
        <div className='row'>
            <div className='col-lg-4 col'>
                <Filter onChange={getBikesByPage} />
            </div>
            <div className='col flex-grow-1'>
                <div className='scroll flex-grow-1' style={{ maxHeight: '88vh' }}>
                    {bikeData ? bikeData.map((bike: BikeCardProp) => (
                        <AdminBikeCard
                            {...bike}
                            key={bike._id}
                        />
                    )) : <h4 className='text-center'>Add a Bike First</h4>}
                </div>
                <Pages onPageChange={getBikesByPage} noOfPages={noOfPages} />
                <AddBike />
            </div>
        </div>
    );
};

export type BikeInput = {
    bikeModel: string | undefined;
    pricePerHour: number | undefined;
    isAvailable: boolean | undefined;
    brand: string | undefined;
    cc: number | undefined;
    horsePower: number | undefined;
    type: string | undefined;
    image?: File | String | null;
}

type BikeCardProp = {
    _id?: string;
    // Bike (uniqeness)
    bikeModel: string;

    // Rental details
    pricePerHour: number;
    isAvailable: boolean;

    // Bike details
    brand: string;
    cc: number;
    horsePower: number;
    type: string;

    imageURL?: string;

    onChange?: (bikeData: BikeInput) => void
}

const AdminBikeCard: React.FC<BikeCardProp> = ({
    _id,
    bikeModel,
    pricePerHour,
    isAvailable,
    brand,
    cc,
    horsePower,
    type,
    imageURL,

    // showReturnBtn = false,
    // onPageChange = () => { }
}): JSX.Element => {
    imageURL = imageURL ? ("http://localhost:5000/uploads/" + imageURL) : 'bike.svg';
    const [showMoreDetails, setShowMoreDetails] = useState<boolean>(false);
    const [bikeData, setBikeData] = useState<BikeInput>({ bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type, image: "" });
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(imageURL as string);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    function onSubmitHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
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
        if (_id)
            updateBike(_id, formData).then(() => {
                alert("Bike updated Successfully");
            })
    }

    function onDeleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (_id)
            deleteBike(_id, () => {
                alert("Bike deleted Successfully");
            })
    }

    return (
        <div className='card bg-glass bg-mid-white mb-2'>
            <div className='card-body'>
                <div className='d-flex flex-row'>
                    <div className='flex-grow-1'>
                        <input className='m-0 fs-5 trans-ip' style={{ maxWidth: '10rem', fontWeight: 500, lineHeight: 1.1 }} name="bikeModel" value={bikeData.bikeModel} onChange={handleInputChange} />
                        <input className='m-0 trans-ip' name="brand" value={bikeData.brand} onChange={handleInputChange} />
                    </div>
                    <button className='btn p-0 cursor-pointer' onClick={onDeleteHandler}>
                        <img className='' src='delete.svg'></img>
                    </button>
                    <div className='d-flex mx-3 justify-content-center align-items-center cursor-pointer' onClick={() => setShowMoreDetails(val => !val)}>
                        <img src='arrow-right.svg' width={15} style={{ transform: showMoreDetails ? 'rotate(-90deg)' : 'rotate(90deg)' }}></img>
                    </div>
                </div>


                {showMoreDetails &&
                    <div className='d-flex bg-mid-white mx-1 rounded mt-2 p-2 row'>
                        <div className='flex-grow-1 d-flex flex-column col'>
                            <label>
                                <b>Price (/hr):</b> <input className='m-0 trans-ip' name="pricePerHour" value={bikeData.pricePerHour} onChange={handleInputChange} />
                            </label>
                            <label>
                                <b>Is Available:</b> <input className='m-0 trans-ip' type='checkbox' name="isAvailable" checked={bikeData.isAvailable} onChange={handleInputChange} />
                            </label>
                            <label>
                                <b>CC:</b> <input className='m-0 trans-ip' name="cc" value={bikeData.cc} onChange={handleInputChange} />
                            </label>
                            <label>
                                <b>Horse Power:</b> <input className='m-0 trans-ip' name="horsePower" value={bikeData.horsePower} onChange={handleInputChange} />
                            </label>
                            <label>
                                <b>Type:</b> <input className='m-0 trans-ip' name="type" value={bikeData.type} onChange={handleInputChange} />
                            </label>
                        </div>


                        <label className='d-flex justify-content-center align-items-center col'>
                            <input
                                type='file'
                                accept='image/*'
                                name='image'
                                className='m-0'
                                style={{ display: 'none', width: 100, height: 100 }}
                                onChange={handleInputChange}></input>
                            <img
                                width={120}
                                height={120}
                                style={{ background: `rgba(0, 0, 0, 0.1)`, objectFit: 'cover', objectPosition: 'center' }}
                                src={imagePreview ? (imagePreview as string) : 'bike.svg'}
                                className='rounded'></img>
                        </label>
                        <div className='d-flex justify-content-center align-items-center'>
                            <button className='btn btn-dark me-2' onClick={onSubmitHandler}>Update</button>
                        </div>
                    </div>}
            </div>
        </div>
    );
}

export default Bikes;