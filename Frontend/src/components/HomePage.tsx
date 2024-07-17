import React, { useEffect, useState } from 'react';

type HomePageProp = {
    setIsLogIn: (val: boolean) => void;
}

const HomePage: React.FC<HomePageProp> = ({ setIsLogIn }): JSX.Element => {

    return (
        <>
            <Menubar />
            <div>
                <Filter />
                <BikeResultsContainer />
            </div>
        </>
    )
}

const Filter: React.FC = (): JSX.Element => {
    return (
        <div className='card row'>
            <div className='col-12'>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control' placeholder='Search' />
                    <button className='btn btn-outline-secondary' type='button' id='button-addon2'>Search</button>
                </div>
            </div>
            <div className='col-12'>
                <div className=''>Filter By</div>
                <div className='tags'>
                    <div>Date</div>
                    <div>Model</div>
                </div>
            </div>
        </div>
    )
}

const BikeResultsContainer: React.FC = (): JSX.Element => {
    const [bikes, setBikes] = useState([])
    useEffect(() => {

    }, [])
    return (
        <div className='d-flex flex-row'>
            {
                [1, 2, 3, 4, 5].map((index) => (
                    <BikeCard bikeModel='Bike Model' brand='Brand' pricePerHour={100} isAvailable={true} key={index} />
                ))
            }
        </div>
    )
}

type BikeCardProp = {
    bikeModel: string;
    brand: string;
    pricePerHour: number;
    isAvailable: boolean;
}

const BikeCard: React.FC<BikeCardProp> = ({ bikeModel, brand, pricePerHour, isAvailable }): JSX.Element => {
    return (
        <div className='card cursor-pointer'>
            <div className='card-body'>
                <h5 className='card-title'>{bikeModel}</h5>
                <h6 className='card-subtitle mb-2 text-muted'>{brand}</h6>
                <p className='card-text'>Price per hour: {pricePerHour}</p>
                <p className='card-text'>{isAvailable ? 'Available' : 'Not Available'}</p>
            </div>
        </div>
    )
}

const Menubar: React.FC = (): JSX.Element => {

    const menus = [
        { name: 'Home', link: '#' },
        { name: 'About', link: '#' },
        { name: 'Booking History', link: '#' },
        { name: 'Footer', link: '#' },
        { name: 'Contact', link: '#' },
    ]

    return (
        <nav className="navbar navbar-expand-sm bg-glass bg-light-white navbar-light">
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <a className="navbar-brand ms-3 me-2" href="#">
                        <img src="data:image/png;base64,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" alt="Avatar Logo" width={40} className="rounded-pill" />
                    </a>
                    {
                        menus.map((menu, index) => (
                            <li className="nav-item ms-3" key={index}>
                                <a className="nav-link" href={menu.link}>{menu.name}</a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </nav>
    )
}

export default HomePage;