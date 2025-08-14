import React, { useEffect, useState } from 'react';
import { getBookingByPage } from '../../scripts/API Calls/bookingApiCalls';
import Pages from '../Pages';
import { Booking } from '../../Types'
import Model from '../Model';
import tick from '../../assets/tick.svg'

interface BookingProps {
    // Define your props here
}

type BookingData = Booking & {
    startTime: string,
    endTime: string,
    userId: {
        _id: string;
        username: string;
        email: string;
        role: string;
    }
}

const BookingComp: React.FC<BookingProps> = () => {
    const [bookingData, setBookingData] = useState<BookingData[]>([])
    const [noOfPages, setNoOfPages] = useState<number>(0);
    const [openedBooking, setOpenedBooking] = useState<number | null>(null);

    const [searchUserIdData, setSearchUserIdData] = useState<string>('');

    async function downloadBookings(page: number) {
        getBookingByPage(page, { userId: searchUserIdData }, (data: AdminBookingData) => {
            setBookingData(data.bookingData)
            setNoOfPages(data.totalBookings / 7)
        })
    }

    useEffect(() => {
        downloadBookings(1)
    }, [])

    return (
        <div>
            <div className='d-flex'>
                {/* <div className='input-group mb-3'>
                    <input type='text' className='form-control border-dark bg-deep-white' placeholder='Search by Bike Model' value={searchBookingIdData} onChange={e => setSearchBookingIdData(e.target.value)} />
                    <button className='btn btn-dark' type='button' id='button-addon2'>Search</button>
                </div> */}

                <div className='input-group mb-3'>
                    <input type='text' className='form-control border-dark bg-deep-white' placeholder='Search by User ID' value={searchUserIdData} onChange={e => setSearchUserIdData(e.target.value)} />
                    <button className='btn btn-dark' type='button' onClick={() => downloadBookings(1)}>Search</button>
                </div>
            </div>
            {
                bookingData.map((booking, i) => (
                    <BookingCard booking={booking} onClick={() => setOpenedBooking(i)} key={booking._id} />
                ))
            }

            <Pages onPageChange={downloadBookings} noOfPages={noOfPages} />

            {openedBooking !== null && <Model heading="Booking Details" onClose={() => setOpenedBooking(null)}>
                <div className='modal-body form d-flex flex-column px-5'>
                    <div>
                        <h5>User Details:</h5>
                        <div><span style={{ fontWeight: 500 }}>UserID:</span> {bookingData[openedBooking].userId._id}</div>
                        <div><span style={{ fontWeight: 500 }}>Username:</span> {bookingData[openedBooking].userId.username}</div>
                        <div><span style={{ fontWeight: 500 }}>Email:</span> {bookingData[openedBooking].userId.email}</div>
                        <div><span style={{ fontWeight: 500 }}>Role:</span> {bookingData[openedBooking].userId.role}</div>
                    </div>
                    <div className='mt-3'>
                        <h5>Booking Details:</h5>
                        <div><span style={{ fontWeight: 500 }}>Bike Model:</span> {bookingData[openedBooking].bike.bikeModel}</div>
                        <div className='d-grid' style={{ gridAutoFlow: 'column' }}>
                            <div><span style={{ fontWeight: 500 }}>Brand:</span> {bookingData[openedBooking].bike.brand}</div>
                            <div><span style={{ fontWeight: 500 }}>Type:</span> {bookingData[openedBooking].bike.type}</div>
                        </div>
                        <div className='d-grid' style={{ gridAutoFlow: 'column' }}>
                            <div><span style={{ fontWeight: 500 }}>CC:</span> {bookingData[openedBooking].bike.cc}</div>
                            <div><span style={{ fontWeight: 500 }}>Price (₹/hr):</span> {bookingData[openedBooking].bike.pricePerHour}</div>
                        </div>
                        <div><span style={{ fontWeight: 500 }}>Start Time:</span> {bookingData[openedBooking].startTime.split('T')[0]}</div>
                        <div><span style={{ fontWeight: 500 }}>End Time:</span> {bookingData[openedBooking].endTime.split('T')[0]}</div>
                        <div><span style={{ fontWeight: 500 }}>Status:</span> {bookingData[openedBooking].status} {bookingData[openedBooking].status === "returned" && <span className='d-inline-flex align-items-center ms-1'><img src={tick} width={16} height={16} /></span>}</div>
                    </div>
                </div>
                <div className="modal-footer mx-auto">
                    <button
                        type="button"
                        className="btn btn-outline-dark border-2 border-dark"
                        onClick={() => setOpenedBooking(null)}
                    >Close</button>
                </div>
            </Model>}
        </div>
    );
};

interface BookingCardProps {
    booking: BookingData;
    onClick: () => void;
}

export type AdminBookingData = {
    bookingData: BookingData[];
    totalBookings: number;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick }) => {
    return (
        <>
            <div className='card bg-white mb-2 cursor-pointer' onClick={onClick}>
                <div className='card-body d-grid' style={{ gridAutoFlow: 'column' }}>
                    <span className='row'>
                        <span className='col' style={{ fontWeight: 500, fontSize: '1rem' }}>{booking.bike.bikeModel}</span>
                        <span className='ms-4 col'>{booking.bike.brand}</span>
                    </span>
                    <span className='row'>
                        <span className='ms-4 col'>{booking.startTime.split('T')[0]}</span>
                        <span className='ms-4 col'>{booking.endTime.split('T')[0]}</span>
                    </span>
                    <span className='d-flex flex-column'>
                        <span className={'ms-4' + (booking.status === 'returned' ? " text-success" : " text-danger")}>{booking.status}</span>
                    </span>
                </div>
            </div>
        </>
    );
};

export default BookingComp;