import React, { useEffect, useRef, useState } from 'react';
import Pages from './Pages';
import { createBooking, returnBikeByBikeId } from '../scripts/API Calls/bookingApiCalls';
import { Bike } from '../Types';
import Model from './Model';

export interface BikeCardProp extends Bike {
    startTime?: Date;
    endTime?: Date;

    showReturnBtn?: boolean;
    onPageChange?: (index: number) => Promise<void>;
}

interface BikeCardsContainerProp {
    bikeData: Bike[];
    heading?: string;
    showReturnBtn?: boolean;
    noOfPages?: number;
    onPageChange?: (index: number) => Promise<void>;
}

export const BikeCardsContainer: React.FC<BikeCardsContainerProp> = ({
    bikeData,
    heading,
    showReturnBtn = false,
    noOfPages,
    onPageChange
}): JSX.Element => {
    return (
        <div className='flex-grow-1 mb-4'>
            {heading ? <h3>{heading}</h3> : ""}
            <div className='bikes-result scroll align-items-start'>
                {
                    bikeData.length === 0 ? <h4>No bikes found</h4> :
                        bikeData.map((bike: BikeCardProp, index: number) => (
                            <BikeCard
                                {...bike}
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
    imageURL,

    startTime,
    endTime,

    showReturnBtn = false,
    onPageChange = () => { }
}): JSX.Element => {
    const [newStartTime, setStartTime] = useState<Date>(startTime ? new Date(startTime) : new Date());
    const [newEndTime, setEndTime] = useState<Date>(endTime ? new Date(endTime) : new Date());

    useEffect(() => {
        setStartTime(startTime ? new Date(startTime) : new Date());
        setEndTime(endTime ? new Date(endTime) : new Date());
    }, [startTime, endTime])

    const closeBtn = useRef<HTMLButtonElement>(null)
    return (
        <>
            <div
                className='card bg-glass bg-mid-white cursor-pointer'
                data-bs-toggle="modal"
                data-bs-target={"#" + _id}>
                <div className='card-body'>
                    <div className='d-flex'>
                        <div className='flex-grow-1'>
                            <h5 className='card-title'>{bikeModel}</h5>
                            <h6 className='card-subtitle mb-2 text-muted'>{brand}</h6>
                            <p className='card-text'>Price: {pricePerHour}₹<span style={{ fontWeight: 600 }}>/hr</span></p>
                            <p className={'card-text d-flex align-items-center' + (isAvailable ? " text-success" : " text-danger")}>
                                {isAvailable ? 'Available ' : 'Not Available '}
                                {isAvailable && <img width={15} height={15} className='ms-2' src='tick.svg'></img>}
                            </p>
                        </div>
                        <div className='d-flex flex-column'>
                            <img
                                src={imageURL ? ('http://localhost:5000/uploads/' + imageURL) : 'bike.svg'}
                                width={120}
                                height={120}
                                className='my-auto rounded-2'
                                style={{ background: `rgba(0, 0, 0, 0.1)`, objectFit: 'cover', objectPosition: 'center' }}
                                alt='bike' />
                        </div>
                    </div>
                </div>
            </div>




            <Model heading={bikeModel} id={_id}>
                <div className='modal-body row mx-2' style={{ whiteSpace: 'nowrap' }}>
                    <div className='col'>
                        <p className='m-0'><b>Brand:</b> {brand}</p>
                        <p className='m-0'><b>CC:</b> {cc}</p>
                        <p className='m-0'><b>Horse Power:</b> {horsePower}</p>
                        <p className='m-0'><b>Type:</b> {type}</p>
                        <p className='m-0'><b>Price:</b> {pricePerHour}₹<span style={{ fontWeight: 600 }}>/hr</span></p>
                        <p className={'d-flex align-items-center' + (isAvailable ? " text-success" : " text-danger")}>
                            {isAvailable ? 'Available ' : 'Not Available '}
                            {isAvailable && <img width={15} height={15} className='ms-2' src='tick.svg'></img>}
                        </p>
                    </div>
                    <div className='col'>
                        <label htmlFor='startDate'>Start Date:</label>
                        <input
                            type='date'
                            id='startDate'
                            className='form-control mt-1'
                            value={newStartTime.toISOString().split('T')[0]}
                            onChange={e => setStartTime(new Date(e.target.value))} />
                        <label htmlFor='returnDate' className=' mt-2'>Return Date:</label>
                        <input
                            type='date'
                            id='returnDate'
                            className='form-control mt-1'
                            value={newEndTime.toISOString().split('T')[0]}
                            onChange={e => setEndTime(new Date(e.target.value))} />
                    </div>
                    <div className='d-flex flex-column'>
                        <img
                            src={imageURL ? ('http://localhost:5000/uploads/' + imageURL) : 'bike.svg'}
                            className='my-auto rounded-2'
                            style={{ background: `rgba(0, 0, 0, 0.1)`, objectFit: 'cover', objectPosition: 'center' }}
                            alt='bike' />
                    </div>
                </div>
                <div className="modal-footer mx-auto">
                    <button
                        type="button"
                        className="btn btn-outline-dark border-2 border-dark"
                        data-bs-dismiss="modal"
                        ref={closeBtn}>Close</button>
                    {!showReturnBtn && isAvailable && <button type="button" className="btn border-2 btn-dark" onClick={async () => {
                        await createBooking(_id, newStartTime, newEndTime).then(() => {
                            closeBtn.current?.click()
                            onPageChange(1)
                        })
                    }}>Book</button>}
                    {showReturnBtn && <button
                        className='btn btn-dark border-2 border-dark float-end mt-2'
                        onClick={async () => {
                            await returnBikeByBikeId(_id).then(() => {
                                closeBtn.current?.click()
                                onPageChange(1)
                            })
                        }}>Return</button>}
                </div>
            </Model>
        </>
    )
}

export default BikeCardsContainer;