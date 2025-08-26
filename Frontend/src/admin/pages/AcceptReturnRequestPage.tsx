import React, { useEffect, useState } from 'react';
import { acceptReturnRequest, getBookingByPage } from '../../scripts/API Calls/bookingApiCalls.ts';
import Pagination from '../../components/Pagination.tsx';
import { Booking } from '../../Types.ts'
import Model from '../../components/Model.tsx';
import tick from '../../assets/tick.svg'
import { AdminPanel } from '../components/AdminPanel.tsx';

const AcceptReturnRequestPage = () => {
    return (
        <div className='d-flex flex-column flex-grow-1 flex-md-row h-100'>
            <AdminPanel />
            <div className='flex-grow-1'>
                <BookingComp />
            </div>
        </div>
    )
}

export default AcceptReturnRequestPage;

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

    const [searchBookingIdData, setSearchBookingIdData] = useState<string>('');

    async function downloadBookings(page: number) {
        getBookingByPage(page, { _id: searchBookingIdData, status: 'return requested' }, (data: AdminBookingData) => {
            setBookingData(data.bookingData)
            setNoOfPages(data.totalBookings / 7)
        })
    }

    useEffect(() => {
        downloadBookings(1)
    }, [])

    return (
        <>
            <div className='d-flex justify-content-between p-2 px-3 align-items-center gap-4 bg-white'>
                <div className='input-group my-auto mr-auto' style={{ maxWidth: '300px' }}>
                    <input
                        type='text'
                        className='form-control border-dark bg-white'
                        placeholder='Search by Booking ID'
                        value={searchBookingIdData}
                        onChange={e => setSearchBookingIdData(e.target.value)}
                        style={{ fontSize: '14px' }} />
                    <button className='btn btn-dark' type='button' style={{ fontSize: '14px', fontWeight: 600 }} onClick={() => downloadBookings(1)}>Search</button>
                </div>
            </div>
            {bookingData.length > 0 ? <div className='p-3'>
                {
                    bookingData.map((booking, i) => (
                        <BookingCard booking={booking} onClick={() => setOpenedBooking(i)} key={booking._id} />
                    ))
                }
                <Pagination onPageChange={downloadBookings} noOfPages={noOfPages} />
            </div> : <div className='d-flex flex-column justify-content-center align-items-center h-100'>
                <h5 className='text-muted'>No bookings found</h5>
            </div>}

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
                        <div><span style={{ fontWeight: 500 }}>Start Time:</span> {bookingData[openedBooking].startTime}</div>
                        <div><span style={{ fontWeight: 500 }}>End Time:</span> {bookingData[openedBooking].endTime}</div>
                        <div><span style={{ fontWeight: 500 }}>Status:</span> <span className='d-inline-flex align-items-center'>{bookingData[openedBooking].status} {bookingData[openedBooking].status === "returned" && <img src={tick} width={16} height={16} className='my-auto ms-1' />}</span></div>
                    </div>
                </div>
                <div className="modal-footer px-auto">
                    <button
                        type="button"
                        className="btn btn-outline-dark border-2 border-dark"
                        onClick={() => setOpenedBooking(null)}
                    >Close</button>
                    <button
                        type="button"
                        className="btn btn-dark border-2 border-dark"
                        onClick={() => acceptReturnRequest(bookingData[openedBooking].bikeId, () => { setOpenedBooking(null); downloadBookings(1); })}
                    >Accept</button>
                </div>
            </Model>}
        </>
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