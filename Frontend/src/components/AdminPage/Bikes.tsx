import React, { useState } from 'react';
import { createBike, deleteBike, getBikesByIndex, updateBike } from '../../scripts/API Calls/bikeApiCalls';
import BikeDetailsModel, { BikeDetailsInput } from './BikeDetailsModel';
import Filter from '../Filter';
import Pages from '../Pages';
import { Bike, FilterData } from '../../Types';
import tick from '../../assets/tick.svg';

const Bikes: React.FC = (): React.JSX.Element => {
    const [bikeData, setBikeData] = useState<Bike[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(3)
    const [openedBike, setOpenedBike] = useState<number | null>(null);

    const getBikesByPage = async (page: number, filterData?: FilterData, searchData?: string | undefined): Promise<void> => {
        if (page <= 0) return;
        getBikesByIndex((page - 1) * 6, filterData, searchData, (data) => {
            setBikeData(data.bikes);
            setNoOfPages(Math.ceil(data.totalBikes / 6))
        })
    }

    function addBike(bikeData: BikeDetailsInput) {
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

    function updateBikeData(bikeData: BikeDetailsInput, _id: string) {
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

    return (
        <div className='row'>
            <div className='col-lg-4 col'>
                <Filter onChange={getBikesByPage} />
            </div>
            <div className='col ps-0 flex-grow-1'>
                <div className='scroll flex-grow-1' style={{ maxHeight: '88vh' }}>
                    {bikeData ? bikeData.map((bike: Bike, index) => (
                        <AdminBikeCard
                            {...bike}
                            key={bike._id}
                            onClick={() => setOpenedBike(index)}
                        />
                    )) : <h4 className='text-center'>Add a Bike First</h4>}
                </div>
                <Pages onPageChange={getBikesByPage} noOfPages={noOfPages} />
                <button
                    className='btn bg-glass bg-deep-white p-3 mt-auto position-fixed end-0 bottom-0 m-4 me-5'
                    style={{ lineHeight: 1, zIndex: 15 }}>
                    <div className='btn-close' style={{ transform: 'rotate(45deg)' }}
                        onClick={() => setOpenedBike(bikeData.length)}></div>
                </button>
                {openedBike !== null && <BikeDetailsModel
                    heading={bikeData[openedBike] ? "Edit Bike" : "Add Bike"}
                    bikeDetails={bikeData[openedBike]}
                    onSubmit={(newBikeData) => {
                        if (bikeData[openedBike]) {
                            updateBikeData(newBikeData, bikeData[openedBike]._id);
                        } else {
                            addBike(newBikeData);
                        }
                    }}
                    submitBtnLabel={bikeData[openedBike] ? 'SAVE' : 'ADD'}
                    onClose={() => setOpenedBike(null)} />}
            </div>
        </div>
    );
};

const AdminBikeCard: React.FC<Bike & { onClick: () => void }> = ({
    _id,
    bikeModel,
    isAvailable,
    brand,
    images,
    onClick
}): React.JSX.Element => {
    images = images ? images.map(image => ("http://localhost:5000/uploads/" + image)) : ['bike.svg'];

    function onDeleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (_id)
            deleteBike(_id)
    }

    return (
        <>
            <div className='card bg-white mb-2 cursor-pointer' onClick={onClick}>
                <div className='card-body'>
                    <div className='d-flex flex-row'>
                        <div className='flex-grow-1'>
                            <h5 className='m-0 p-0'>{bikeModel}</h5>
                            <span className='m-0'>{brand}{isAvailable && <span><img width={15} height={15} className='ms-2' src={tick}></img></span>}</span>
                        </div>
                        <button className='btn p-0 cursor-pointer' onClick={onDeleteHandler}>
                            <img className='' src='delete.svg'></img>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Bikes;