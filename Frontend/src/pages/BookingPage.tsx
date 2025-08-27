import React, { useEffect, useState } from 'react'
import { Booking } from '../Types'
import Menubar from '../components/Menubar'
import { getBookings } from '../scripts/API Calls/bookingApiCalls'
import Pagination from '../components/Pagination'
import { Link } from 'react-router-dom'
import logOut from '../scripts/logOut'

const BookingPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const tabs = [{
        name: 'Booking History',
        component: <BookingHistory />
    }, {
        name: 'Bike to Return',
        component: <BikeToReturn />
    }, {
        name: 'Return Requested',
        component: <ReturnRequestedBikes />
    }, {
        name: 'Need to Pick Up',
        component: <BikesThatNeedToPickedUp />
    }]

    return (
        <div className="h-100 d-flex flex-column">
            <Menubar />
            <div className="container mt-4 d-flex flex-column flex-md-row h-100">
                <ul className="nav nav-pills flex-column me-3">
                    {tabs.map((tab, index) => (
                        <li className="nav-item mb-2" key={index}>
                            <div
                                className={`nav-link cursor-pointer ${activeTab === index ? 'active bg-dark' : ' text-dark bg-white'}`}
                                onClick={() => setActiveTab(index)}>{tab.name}</div>
                        </li>
                    ))}
                </ul>
                <div className="flex-grow-1">
                    {tabs[activeTab].component}
                </div>
            </div>
        </div>
    )
}

export default BookingPage;



const BookingHistory: React.FC = (): React.JSX.Element => {
    const [bookingData, setBookingData] = useState<Booking[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(0);

    useEffect(() => {
        getBookingData(0)
    }, [])

    async function getBookingData(index: number) {
        const res = await getBookings(index, { status: { $in: ['returned', 'cancelled'] } }, (data) => {
            setBookingData(data.bookings);
            setNoOfPages(Math.ceil(data.totalBookings / 6))
        })
        if (res === null) {
            logOut();
        }
    }

    return (
        <div className='pb-4 h-100'>
            {bookingData.length > 0 ? <>
                {bookingData.map(booking => <BookingCard key={booking._id} booking={booking} />)}
                <Pagination noOfPages={noOfPages} onPageChange={getBookingData} />
            </> : <div className='d-flex flex-column justify-content-center align-items-center h-100'>
                <h5 className='text-muted'>No bookings found</h5>
            </div>}
        </div>
    )
}

const BookingCard = ({ booking, onClick = () => { } }: { booking: Booking, onClick?: (booking: Booking) => void }) => {
    return (
        <Link to={'/bookings/' + booking._id} state={booking} className='card card-body d-flex flex-row justify-content-between align-items-center mb-2 text-decoration-none' key={booking._id} onClick={() => onClick(booking)}>
            <div>
                <h3 className='mb-0'>{booking.bike.bikeModel}</h3>
                <div>{booking.bike.brand}</div>
                <div>{new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}</div>
            </div>
            <h2 className='mb-0 me-2'>{booking.bike.pricePerHour}₹</h2>
        </Link>
    )
}

const BikeToReturn: React.FC = (): React.JSX.Element => {
    const [bookingData, setBookingData] = useState<Booking[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(0);

    useEffect(() => {
        getBookingData(0)
    }, [])

    function getBookingData(index: number) {
        getBookings(index, { status: 'picked up' }, (data) => {
            setBookingData(data.bookings);
            setNoOfPages(Math.ceil(data.totalBookings / 6))
        })
    }

    return (
        <div className='pb-4 h-100'>
            {bookingData.length > 0 ? <>
                {bookingData.map(booking => <BookingCard key={booking._id} booking={booking} />)}
                <Pagination noOfPages={noOfPages} onPageChange={getBookingData} />
            </> : <div className='d-flex flex-column justify-content-center align-items-center h-100'>
                <h5 className='text-muted'>No bookings found</h5>
            </div>}

        </div>
    )
}


const ReturnRequestedBikes: React.FC = (): React.JSX.Element => {
    const [bookingData, setBookingData] = useState<Booking[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(0);

    useEffect(() => {
        getBookingData(0)
    }, [])

    function getBookingData(index: number) {
        getBookings(index, { status: 'return requested' }, (data) => {
            setBookingData(data.bookings);
            setNoOfPages(Math.ceil(data.totalBookings / 6))
        })
    }

    return (
        <div className='pb-4 h-100'>
            {bookingData.length > 0 ? <>
                {bookingData.map(booking => <BookingCard key={booking._id} booking={booking} />)}
                <Pagination noOfPages={noOfPages} onPageChange={getBookingData} />
            </> : <div className='d-flex flex-column justify-content-center align-items-center h-100'>
                <h5 className='text-muted'>No bookings found</h5>
            </div>}
        </div>
    )
}

const BikesThatNeedToPickedUp: React.FC = (): React.JSX.Element => {
    const [bookingData, setBookingData] = useState<Booking[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(0);

    useEffect(() => {
        getBookingData(0)
    }, [])

    function getBookingData(index: number) {
        getBookings(index, { status: 'booked' }, (data) => {
            setBookingData(data.bookings);
            setNoOfPages(Math.ceil(data.totalBookings / 6))
        })
    }

    return (
        <div className='pb-4 h-100'>
            {bookingData.length > 0 ? <>
                {bookingData.map(booking => <BookingCard key={booking._id} booking={booking} />)}
                <Pagination noOfPages={noOfPages} onPageChange={getBookingData} />
            </> : <div className='d-flex flex-column justify-content-center align-items-center h-100'>
                <h5 className='text-muted'>No bookings found</h5>
            </div>}
        </div>
    )
}