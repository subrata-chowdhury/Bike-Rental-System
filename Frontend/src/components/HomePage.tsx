import React, { useEffect, useState } from 'react';
import './styles/HomePage.css';
import Footer from './Footer';
import Menubar from './Menubar';
import Filter, { FilterData } from './Filter';
import BikeCardsContainer, { BikeCardProp as Bike } from './BikeCard';
import { getBikeCounts, getBikesByIndex } from '../scripts/API Calls/bikeApiCalls';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = (): JSX.Element => {
    return (
        <>
            <Menubar />
            <BikeFinder />
            <Footer />
        </>
    )
}

type BikeFinderProp = {
    header?: string;
}

export const BikeFinder: React.FC<BikeFinderProp> = ({ header }): JSX.Element => {
    // const [bikeData, setBikeData] = useState<Bike[]>(sampleData);
    const [bikeData, setBikeData] = useState<Bike[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(3)

    const navigator = useNavigate();

    function logOut() {
        localStorage.removeItem('token');
        navigator('/');
    }

    const getBikesByPage = async (page: number, filterData?: FilterData, searchData?: string | undefined): Promise<void> => {
        if (page <= 0) return;
        getBikesByIndex((page - 1) * 6, filterData, searchData, (data) => {
            setBikeData(data as Bike[]);
        })
        getBikeCounts(logOut, filterData, searchData).then((data: any) => {
            setNoOfPages(Math.ceil(data.total / 6));
        })
    }
    return (
        <>
            <div className='row row-cols-1 row-cols-md-2 mx-auto mt-4 mb-4 filter-result-container'>
                <Filter getBikesByPage={getBikesByPage} />
                <BikeCardsContainer bikeData={bikeData} heading={header} noOfPages={noOfPages} onPageChange={getBikesByPage} />
            </div>
        </>
    )
}

export default HomePage;