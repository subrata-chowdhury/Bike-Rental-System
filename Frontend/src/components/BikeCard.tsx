import React, { useEffect, useState } from 'react';

export type BikeCardProp = {
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
}

export const BikeCardsContainer: React.FC<BikeCardsContainerProp> = ({ bikeData = sampleData, heading }): JSX.Element => {
    return (
        <div className='flex-grow-1 mb-4'>
            {heading ? <h3>{heading}</h3> : ""}
            <div className='bikes-result scroll align-items-start'>
                {
                    bikeData.map((bike: BikeCardProp, index: number) => (
                        <BikeCard
                            bikeModel={bike.bikeModel}
                            pricePerHour={bike.pricePerHour}
                            isAvailable={bike.isAvailable}
                            brand={bike.brand}
                            cc={bike.cc}
                            horsePower={bike.horsePower}
                            type={bike.type}
                            key={index} />
                    ))
                }
            </div>
            <Pages />
        </div>
    )
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
                <div className='d-flex'>
                    <div className='flex-grow-1'>
                        <h5 className='card-title'>{bikeModel}</h5>
                        <h6 className='card-subtitle mb-2 text-muted'>{brand}</h6>
                        <p className='card-text'>Price per hour: {pricePerHour}₹</p>
                        <p className={'card-text d-flex align-items-center' + (isAvailable ? " text-success" : " text-danger")}>{isAvailable ? 'Available ' : 'Not Available '}
                            {isAvailable && <img width={15} height={15} className='ms-2' src='tick.svg'></img>}
                        </p>
                    </div>
                    <div>
                        <button className='btn btn-primary float-end'>Book</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Pages: React.FC = (): JSX.Element => {
    const [noOfPages, setNoOfPages] = useState<number>(3)
    const [currentPage, setCurrentPage] = useState<number>(1)
    let pages: JSX.Element[] = [];
    for (let index = 1; index <= noOfPages; index++) {
        pages.push(
            <Page page={index} key={index} isActive={(currentPage === index ? true : false)} setCurrentPage={setCurrentPage} />
        )
    }
    function pageOnClickHanlder() {
        console.log(currentPage)
    }
    useEffect(() => {
        pageOnClickHanlder()
    }, [currentPage])
    return (
        <div className='d-flex justify-content-center mt-3'>
            <div className='rounded-circle bg-white pages mx-1 cursor-pointer' onClick={() => {
                let newPage = currentPage;
                newPage--
                if (newPage > 0)
                    setCurrentPage(newPage)
            }}>{'<'}</div>
            {pages}
            <div className='rounded-circle bg-white pages mx-1 cursor-pointer' onClick={() => {
                let newPage = currentPage;
                newPage++
                if (newPage <= noOfPages)
                    setCurrentPage(newPage)
            }}>{'>'}</div>
        </div>
    )
}

type PageProp = {
    page: number,
    isActive?: boolean,
    setCurrentPage: (val: number) => void,
}

const Page: React.FC<PageProp> = ({ page, isActive = false, setCurrentPage }): JSX.Element => {
    return (
        <div className={'rounded-circle pages mx-1 cursor-pointer' + (isActive ? ' bg-primary text-light' : ' bg-white text-primary')} onClick={() => {
            setCurrentPage(page)
        }}>{page}</div>
    )
}

export default BikeCardsContainer;