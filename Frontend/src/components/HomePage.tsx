import React, { useState } from 'react';
import './styles/HomePage.css';
import Footer from './Footer';
import Menubar from './Menubar';
import Filter from './Filter';
import BikeCardsContainer, { BikeCardProp as Bike, sampleData } from './BikeCard';

const HomePage: React.FC = (): JSX.Element => {
    return (
        <>
            <Menubar />
            <BikeFinder bikeData={sampleData} header="Book a Bike" />
            <Footer />
        </>
    )
}

type BikeFinderProp = {
    bikeData: Bike[];
    header?: string;
}

export const BikeFinder: React.FC<BikeFinderProp> = ({ bikeData, header }): JSX.Element => {
    // const [bikeData, setBikeData] = useState<Bike[]>(sampleData);
    const [filteredData, setFilterdData] = useState<Bike[]>(bikeData)
    return (
        <>
            <div className='row row-cols-1 row-cols-md-2 mx-auto mt-4 filter-result-container'>
                <Filter bikeData={bikeData} setBikeData={setFilterdData} />
                <BikeCardsContainer bikeData={filteredData} heading={header} />
            </div>
        </>
    )
}

export default HomePage;