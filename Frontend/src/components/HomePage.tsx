import React, { useEffect, useState } from 'react';
import './styles/HomePage.css';
import Footer from './Footer';
import Menubar from './Menubar';
import Filter from './Filter';
import BikeCardsContainer, { BikeCardProp as Bike, sampleData } from './BikeCard';
import { getBikeCounts, getBikesByIndex } from '../scripts/API Calls/bikeApiCalls';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = (): JSX.Element => {
    const [bikeData, setBikeData] = useState<Bike[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(3)

    const navigator = useNavigate();

    function logOut() {
        localStorage.removeItem('token');
        navigator('/');
    }

    const getBikesByPage = (index: number): void => {
        if (index <= 0) return;
        getBikesByIndex((index - 1) * 6, (data: object[]) => {
            setBikeData(data as Bike[]);
        })
    }
    useEffect(() => {
        getBikesByPage(1);

        getBikeCounts(logOut).then((data: any) => {
            setNoOfPages(Math.ceil(data.total / 6));
        })
    }, [])
    return (
        <>
            <Menubar />
            <BikeFinder bikeData={bikeData} onPageChange={getBikesByPage} noOfPages={noOfPages} />
            <Footer />
        </>
    )
}

type BikeFinderProp = {
    bikeData: Bike[];
    header?: string;
    noOfPages?: number;
    onPageChange?: (index: number) => void;
}

export const BikeFinder: React.FC<BikeFinderProp> = ({ bikeData, header, noOfPages, onPageChange }): JSX.Element => {
    // const [bikeData, setBikeData] = useState<Bike[]>(sampleData);
    const [filteredData, setFilterdData] = useState<Bike[]>(bikeData);
    return (
        <>
            <div className='row row-cols-1 row-cols-md-2 mx-auto mt-4 mb-4 filter-result-container'>
                <Filter bikeData={bikeData} setBikeData={setFilterdData} />
                <BikeCardsContainer bikeData={filteredData} heading={header} noOfPages={noOfPages} onPageChange={onPageChange} />
            </div>
        </>
    )
}

export default HomePage;