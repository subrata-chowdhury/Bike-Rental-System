import React, { useState } from 'react';
import { deleteBike, getBikeCounts, getBikesByIndex, updateBike } from '../../scripts/API Calls/bikeApiCalls';
import AddBike, { BikeDetailsInput, BikeDetailsModel } from './AddBike';
import Filter from '../Filter';
import Pages from '../Pages';
import { Bike, FilterData } from '../../Types';

const Bikes: React.FC = (): JSX.Element => {
    const [bikeData, setBikeData] = useState<Bike[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(3)

    const getBikesByPage = async (page: number, filterData?: FilterData, searchData?: string | undefined): Promise<void> => {
        if (page <= 0) return;
        getBikesByIndex((page - 1) * 6, filterData, searchData, (data) => {
            setBikeData(data as Bike[]);
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
                    {bikeData ? bikeData.map((bike: Bike) => (
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

const AdminBikeCard: React.FC<Bike> = ({
    _id,
    bikeModel,
    pricePerHour,
    isAvailable,
    brand,
    cc,
    horsePower,
    type,
    imageURL,
}): JSX.Element => {
    imageURL = imageURL ? ("http://localhost:5000/uploads/" + imageURL) : 'bike.svg';

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
        if (_id)
            updateBike(_id, formData).then(() => {
                alert("Bike updated Successfully");
            })
    }

    function onDeleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (_id)
            deleteBike(_id)
    }

    return (
        <>
            <div className='card bg-glass bg-mid-white mb-2 cursor-pointer'
                data-bs-toggle="modal"
                data-bs-target={"#editBikeDetails" + _id}>
                <div className='card-body'>
                    <div className='d-flex flex-row'>
                        <div className='flex-grow-1'>
                            <h5 className='m-0 p-0'>{bikeModel}</h5>
                            <span className='m-0'>{brand}</span>
                        </div>
                        <button className='btn p-0 cursor-pointer' onClick={onDeleteHandler}>
                            <img className='' src='delete.svg'></img>
                        </button>
                    </div>
                </div>
            </div>
            <BikeDetailsModel
                heading={"EDIT BIKE"}
                id={"editBikeDetails" + _id}
                bikeDetails={{
                    _id: _id,
                    bikeModel: bikeModel,
                    pricePerHour: pricePerHour,
                    isAvailable: isAvailable,
                    brand: brand,
                    cc: cc,
                    horsePower: horsePower,
                    type: type,
                    imageURL: imageURL
                }}
                onSubmit={onSubmitHandler}
                submitBtnLabel='UPDATE'
            />
        </>
    );
}

export default Bikes;