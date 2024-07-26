import React, { useRef, useState } from 'react';
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
    onPageChange?: (index: number) => Promise<void>;
}

type BikeCardsContainerProp = {
    bikeData: BikeCardProp[];
    heading?: string;
    showReturnBtn?: boolean;
    noOfPages?: number;
    onPageChange?: (index: number) => Promise<void>;
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
                                onPageChange={onPageChange}
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
    showReturnBtn = false,
    onPageChange = () => { }
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
                            {showReturnBtn && <button className='btn btn-warning float-end mt-2' onClick={async () => {
                                await returnBikeByBikeId(_id).then(() => {
                                    onPageChange(1)
                                })
                            }}>Return</button>}
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
                                <p className='m-0'><b>Brand:</b> {brand}</p>
                                <p className='m-0'><b>CC:</b> {cc}</p>
                                <p className='m-0'><b>Horse Power:</b> {horsePower}</p>
                                <p className='m-0'><b>Type:</b> {type}</p>
                                <p className='m-0'><b>Price per hour:</b> {pricePerHour}₹</p>
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
                            <button type="button" className="btn btn-primary" onClick={async () => {
                                await createBooking({ _id, startTime, endTime }).then(() => {
                                    closeBtn.current?.click()
                                    onPageChange(1)
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