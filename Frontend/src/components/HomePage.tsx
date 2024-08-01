import React, { useEffect, useState } from 'react';
import './styles/HomePage.css';
import Footer from './Footer';
import Menubar from './Menubar';
import Filter, { FilterData } from './Filter';
import BikeCardsContainer, { BikeCardProp as Bike } from './BikeCard';
import { getBikeCounts, getBikesByIndex } from '../scripts/API Calls/bikeApiCalls';
import { getBookingDetailsThatHasToReturn } from '../scripts/API Calls/bookingApiCalls';

const HomePage: React.FC = (): JSX.Element => {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertData, setAlertData] = useState<Bike[]>([]);
    useEffect(() => {
        getBookingDetailsThatHasToReturn().then((data) => {
            if (data.length === 0) {
                return;
            }
            setAlertData(data);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        })
    }, [])
    return (
        <>
            {showAlert && <div
                className='position-fixed t-0 mt-4 d-flex flex-column'
                style={{ left: '50%', transform: 'translate(-50%,0)', zIndex: 20 }}>
                {
                    alertData.map((booking: Bike) => (
                        <div key={booking._id} className="alert alert-danger d-flex" role="alert">
                            Bike with Model&nbsp;<b>{booking.bikeModel}</b>&nbsp;has to be returned today
                            <div
                                className='btn-close cursor-pointer ms-2'
                                data-bs-dismiss="alert"
                                aria-label="Close"></div>
                            {/* <div className={'bg-danger alert-time-bar'}></div> */}
                        </div>
                    ))
                }
            </div>}
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

    const getBikesByPage = async (page: number, filterData?: FilterData, searchData?: string | undefined): Promise<void> => {
        if (page <= 0) return;
        getBikesByIndex((page - 1) * 6, filterData, searchData, (data) => {
            setBikeData(data as Bike[]);
        })
        getBikeCounts(filterData, searchData).then((data: any) => {
            setNoOfPages(Math.ceil(data.total / 6));
        })
    }
    return (
        <>
            <div className='row row-cols-1 row-cols-md-2 mx-auto mt-4 mb-4 filter-result-container'>
                <Filter onChange={getBikesByPage} />
                <BikeCardsContainer
                    bikeData={bikeData}
                    heading={header}
                    noOfPages={noOfPages}
                    onPageChange={getBikesByPage} />
            </div>
        </>
    )
}

export default HomePage;