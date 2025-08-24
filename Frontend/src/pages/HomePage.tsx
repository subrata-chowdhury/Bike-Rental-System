import React, { useEffect, useState } from 'react';
import '../styles/HomePage.css';
import Footer from '../components/Footer.tsx';
import Menubar from '../components/Menubar.tsx';
import Filter from '../components/Filter.tsx';
import BikeCardsContainer, { BikeCardProp as Bike } from '../components/BikeCard.tsx';
import { getBikesByIndex } from '../scripts/API Calls/bikeApiCalls.ts';
import { FilterData } from '../Types.ts';
import { useOrderdBikes } from '../contexts/OrderdBikesContext.tsx';
import { useSocket } from '../scripts/socket.ts';

const HomePage: React.FC = (): React.JSX.Element => {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const orderedBikes = useOrderdBikes();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        setShowAlert(true);
        timer = setTimeout(() => {
            setShowAlert(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [orderedBikes.orderedBikes])

    return (
        <>
            {showAlert && <div
                className='position-fixed t-0 mt-4 d-flex flex-column'
                style={{ left: '50%', transform: 'translate(-50%,0)', zIndex: 20 }}>
                {
                    orderedBikes.orderedBikes.map((booking: Bike) => (
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

interface BikeFinderProp {
    header?: string;
}

export const BikeFinder: React.FC<BikeFinderProp> = ({ header }): React.JSX.Element => {
    // const [bikeData, setBikeData] = useState<Bike[]>(sampleData);
    const [bikeData, setBikeData] = useState<Bike[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(3)
    const socketRef = useSocket();

    const getBikesByPage = async (page: number, filterData?: FilterData, searchData?: string): Promise<void> => {
        if (page <= 0) return;
        getBikesByIndex((page - 1) * 6, filterData, searchData, (data) => {
            setBikeData(data.bikes);
            setNoOfPages(Math.ceil(data.totalBikes / 6))
        })
    }

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on('bike_details_changed', (changeBikeData) => {
            changeBikeData = changeBikeData.bike;
            bikeData.map((bike, i) => {
                if (bike._id === changeBikeData._id) {
                    let newBikeData = [...bikeData];
                    newBikeData[i] = changeBikeData;
                    setBikeData(newBikeData);
                }
            })
        });

        return () => {
            socketRef.current?.off('bike_details_changed');
        };
    }, [socketRef, bikeData]);

    return (
        <>
            <div className='bikes-filter-container mx-auto mt-4 mb-4 filter-result-container'>
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