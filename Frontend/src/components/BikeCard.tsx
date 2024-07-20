import React, { useEffect, useRef, useState } from 'react';
import { createBike } from '../scripts/API Calls/bikeApiCalls';
import Pages from './Pages';
import { createBooking, returnBikeByBikeId } from '../scripts/API Calls/bookingApiCalls';

export type BikeCardProp = {
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
    showReturnBtn?: boolean;
}

export const sampleData: BikeCardProp[] = [
    {
        bikeModel: 'Bike Model 1',
        pricePerHour: 100,
        isAvailable: true,
        brand: 'Brand 1',
        cc: 150,
        horsePower: 150,
        type: 'Type 1'
    },
    {
        bikeModel: 'Bike Model 2',
        pricePerHour: 200,
        isAvailable: true,
        brand: 'Brand 2',
        cc: 200,
        horsePower: 200,
        type: 'Type 2'
    },
    {
        bikeModel: 'Bike Model 3',
        pricePerHour: 300,
        isAvailable: false,
        brand: 'Brand 3',
        cc: 250,
        horsePower: 250,
        type: 'Type 3'
    },
    {
        bikeModel: 'Bike Model 2',
        pricePerHour: 200,
        isAvailable: true,
        brand: 'Brand 2',
        cc: 200,
        horsePower: 200,
        type: 'Type 2'
    },
    {
        bikeModel: 'Bike Model 3',
        pricePerHour: 300,
        isAvailable: false,
        brand: 'Brand 3',
        cc: 250,
        horsePower: 250,
        type: 'Type 3'
    },
    {
        bikeModel: 'Bike Model 3',
        pricePerHour: 300,
        isAvailable: false,
        brand: 'Brand 3',
        cc: 250,
        horsePower: 250,
        type: 'Type 3'
    }
]

type BikeCardsContainerProp = {
    bikeData: BikeCardProp[];
    heading?: string;
    showReturnBtn?: boolean;
    noOfPages?: number;
    onPageChange?: (index: number) => void;
}

export const BikeCardsContainer: React.FC<BikeCardsContainerProp> = ({ bikeData, heading, showReturnBtn = false, noOfPages, onPageChange }): JSX.Element => {
    return (
        <div className='flex-grow-1 mb-4'>
            {heading ? <h3>{heading}</h3> : ""}
            <div className='bikes-result scroll align-items-start'>
                {
                    bikeData.length === 0 ? <h4>No bikes found</h4> :
                        bikeData.map((bike: BikeCardProp, index: number) => (
                            <BikeCard
                                _id={bike._id}
                                bikeModel={bike.bikeModel}
                                pricePerHour={bike.pricePerHour}
                                isAvailable={bike.isAvailable}
                                brand={bike.brand}
                                cc={bike.cc}
                                horsePower={bike.horsePower}
                                type={bike.type}
                                showReturnBtn={showReturnBtn}
                                key={index} />
                        ))
                }
            </div>
            <Pages onPageChange={onPageChange} noOfPages={noOfPages} />
        </div>
    )
}

const BikeCard: React.FC<BikeCardProp> = ({
    _id,
    bikeModel,
    pricePerHour,
    isAvailable,
    brand,
    cc,
    horsePower,
    type,
    showReturnBtn = false
}): JSX.Element => {
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());

    const closeBtn = useRef<HTMLButtonElement>(null)
    return (
        <>
            <div className='card bg-glass bg-mid-white cursor-pointer'>
                <div className='card-body'>
                    <div className='d-flex'>
                        <div className='flex-grow-1'>
                            <h5 className='card-title'>{bikeModel}</h5>
                            <h6 className='card-subtitle mb-2 text-muted'>{brand}</h6>
                            <p className='card-text'>Price per hour: {pricePerHour}₹</p>
                            <p className={'card-text d-flex align-items-center' + (isAvailable ? " text-success" : " text-danger")}>{isAvailable ? 'Available ' : 'Not Available '}
                                {isAvailable && <img width={15} height={15} className='ms-2' src='tick.svg'></img>}
                            </p>
                        </div>
                        <div className='d-flex flex-column'>
                            {isAvailable && <button className='btn btn-primary float-end' data-bs-toggle="modal" data-bs-target={"#" + _id}>Book</button>}
                            {showReturnBtn && <button className='btn btn-warning float-end mt-2' onClick={() => returnBikeByBikeId(_id)}>Return</button>}
                        </div>
                    </div>
                </div>
            </div>




            <div className='modal' id={_id} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title" id="exampleModalLabel">{bikeModel}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className='modal-body row mx-auto' style={{ whiteSpace: 'nowrap' }}>
                            <div className='col'>
                                <p className='m-0'>Brand: {brand}</p>
                                <p className='m-0'>CC: {cc}</p>
                                <p className='m-0'>Horse Power: {horsePower}</p>
                                <p className='m-0'>Type: {type}</p>
                                <p className='m-0'>Price per hour: {pricePerHour}₹</p>
                                <p className={'d-flex align-items-center' + (isAvailable ? " text-success" : " text-danger")}>{isAvailable ? 'Available ' : 'Not Available '}
                                    {isAvailable && <img width={15} height={15} className='ms-2' src='tick.svg'></img>}
                                </p>
                            </div>
                            <div className='col'>
                                <label htmlFor='startDate'>Start Date:</label>
                                <input type='date' id='startDate' className='form-control mt-1' value={startTime.toISOString().split('T')[0]} onChange={e => setStartTime(new Date(e.target.value))} />
                                <label htmlFor='returnDate' className=' mt-2'>Return Date:</label>
                                <input type='date' id='returnDate' className='form-control mt-1' value={endTime.toISOString().split('T')[0]} onChange={e => setEndTime(new Date(e.target.value))} />
                            </div>
                        </div>
                        <div className="modal-footer mx-auto">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={closeBtn}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                createBooking({ _id, startTime, endTime }).then(() => {
                                    closeBtn.current?.click()
                                })
                            }}>Book</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BikeCardsContainer;