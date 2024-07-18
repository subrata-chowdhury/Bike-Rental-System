import React, { useEffect, useState } from 'react';
import './styles/HomePage.css';
import Footer from './Footer';
import Menubar from './Menubar';
import Filter from './Filter';

type HomePageProp = {
    setIsLogIn: (val: boolean) => void;
}

const HomePage: React.FC<HomePageProp> = ({ setIsLogIn }): JSX.Element => {

    return (
        <>
            <Menubar />
            <div className='row row-cols-1 row-cols-md-2 mx-auto mt-4 filter-result-container'>
                <Filter />
                <BikeResultsContainer />
            </div>
            <Footer />
        </>
    )
}

const BikeResultsContainer: React.FC = (): JSX.Element => {
    const [bikes, setBikes] = useState([])
    useEffect(() => {

    }, [])
    return (
        <div className='bikes-result scroll'>
            {
                [1, 2, 3, 4, 5].map((index: number) => (
                    <BikeCard
                        bikeModel='Bike Model'
                        pricePerHour={100}
                        isAvailable={true}
                        brand='Brand'
                        cc={150}
                        horsePower={150}
                        type='Type'
                        key={index} />
                ))
            }
            <BikeCard
                bikeModel='Bike Model'
                pricePerHour={100}
                isAvailable={false}
                brand='Brand'
                cc={150}
                horsePower={150}
                type='Type' />
        </div>
    )
}

type BikeCardProp = {
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
}

const BikeCard: React.FC<BikeCardProp> = ({
    bikeModel,
    pricePerHour,
    isAvailable,
    brand,
    cc,
    horsePower,
    type
}): JSX.Element => {
    return (
        <div className='card bg-glass bg-mid-white cursor-pointer'>
            <div className='card-body'>
                <h5 className='card-title'>{bikeModel}</h5>
                <h6 className='card-subtitle mb-2 text-muted'>{brand}</h6>
                <p className='card-text'>Price per hour: {pricePerHour}</p>
                <p className={'card-text' + (isAvailable ? " text-success" : " text-danger")}>{isAvailable ? 'Available ' : 'Not Available '}
                    {isAvailable && <img width={15} height={15} src='tick.svg'></img>}
                </p>
            </div>
        </div>
    )
}

export default HomePage;