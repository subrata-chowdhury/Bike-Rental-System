import React from 'react';
import Pagination from './Pagination';
import { Bike } from '../Types';
import { useNavigate } from 'react-router-dom';
import bikeIcon from '../assets/bike.svg';
import tick from '../assets/tick.svg';

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
}): React.JSX.Element => {
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
            <Pagination onPageChange={onPageChange} noOfPages={noOfPages} />
        </div>
    )
}

const BikeCard: React.FC<BikeCardProp> = ({
    _id,
    bikeModel,
    pricePerHour,
    isAvailable,
    brand,
    images,
}): React.JSX.Element => {
    const navigate = useNavigate();

    return (
        <>
            <div
                className='card shadow-sm cursor-pointer'
                onClick={() => navigate(`/bike/${_id}`)}>
                <div className='d-flex flex-column'>
                    <img
                        src={images[0] ? ('http://localhost:5000/uploads/' + images[0]) : bikeIcon}
                        width={'100%'}
                        height={120}
                        className='my-auto'
                        style={{ background: `rgba(0, 0, 0, 0.1)`, objectFit: 'cover', objectPosition: 'center' }}
                        alt='bike' />
                </div>
                <div className='card-body'>
                    <div className='d-flex flex-column'>
                        <div className='flex-grow-1'>
                            <h5 className='card-title'>{bikeModel}</h5>
                            <h6 className='card-subtitle mb-1 text-muted fw-normal'>{brand}</h6>
                            <div className='d-flex justify-content-between align-items-center'>
                                <p className={'card-text d-flex align-items-center mb-0 ' + (isAvailable ? " text-success" : " text-danger")}>
                                    {isAvailable ? 'Available ' : 'Not Available '}
                                    {isAvailable && <img width={15} height={15} className='ms-2' src={tick}></img>}
                                </p>
                                <p className='card-text'><span style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.1 }}>{pricePerHour}</span>₹/hr</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BikeCardsContainer;