import React, { useEffect, useState } from 'react';
import { getBookingByPage } from '../../scripts/API Calls/bookingApiCalls.ts';
import Pagination from '../../components/Pagination.tsx';
import { Booking } from '../../Types.ts'
import Model from '../../components/Model.tsx';
import tick from '../../assets/tick.svg'
import Plus from '../../assets/reactIcons/Plus.tsx';
import { AdminPanel } from '../components/AdminPanel.tsx';

const AdminBookingPage = () => {
    return (
        <div className='d-flex flex-column flex-grow-1 flex-md-row h-100'>
            <AdminPanel />
            <div className='flex-grow-1'>
                <BookingComp />
            </div>
        </div>
    )
}

export default AdminBookingPage;

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
        downloadBookings(0)
    }, [])

    return (
        <>
            <div className='d-flex justify-content-between p-2 px-3 align-items-center gap-4 bg-white'>
                <div className='input-group my-auto mr-auto' style={{ maxWidth: '300px' }}>
                    <input
                        type='text'
                        className='form-control border-dark bg-white'
                        placeholder='Search by User ID'
                        value={searchUserIdData}
                        onChange={e => setSearchUserIdData(e.target.value)}
                        style={{ fontSize: '14px' }} />
                    <button className='btn btn-dark' type='button' style={{ fontSize: '14px', fontWeight: 600 }} onClick={() => downloadBookings(1)}>Search</button>
                </div>
                <div className='btn btn-dark d-flex justify-content-center align-items-center px-3 py-2 ps-2' style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }} onClick={() => setOpenedBooking(bookingData.length)}>
                    <span className='me-2 ps-1'><Plus size={20} /></span>New Booking
                </div>
            </div>
            <div className='p-3'>
                {
                    bookingData.map((booking, i) => (
                        <BookingCard booking={booking} onClick={() => setOpenedBooking(i)} key={booking._id} />
                    ))
                }
                <Pagination onPageChange={downloadBookings} noOfPages={noOfPages} />
            </div>

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
                <div className="modal-footer mx-auto">
                    <button
                        type="button"
                        className="btn btn-outline-dark border-2 border-dark"
                        onClick={() => setOpenedBooking(null)}
                    >Close</button>
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
            <div className='card card-body d-flex flex-row justify-content-between align-items-center mb-2 text-decoration-none' key={booking._id} onClick={onClick}>
                <div>
                    <h6 className='mb-0'>{booking.bike.bikeModel}</h6>
                    <div>{booking.bike.brand}</div>
                    <div>{new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}</div>
                </div>
                <h6 className={'ms-4' + (booking.status === 'returned' ? " text-success" : " text-danger")}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</h6>
                <h5 className='mb-0 me-2'>{(booking.bike.pricePerHour/60).toFixed(2)}₹/min</h5>
            </div>
        </>
    );
};