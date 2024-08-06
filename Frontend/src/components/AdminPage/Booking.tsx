import React, { useEffect, useState } from 'react';
import { getBookingByPage, getBookingCount } from '../../scripts/API Calls/bookingApiCalls';
import Pages from '../Pages';
import { User, Booking } from '../../Types'

interface BookingProps {
    // Define your props here
}

type BookingData = Booking & {
    startTime: string,
    endTime: string
}

const BookingComp: React.FC<BookingProps> = () => {
    const [bookingData, setBookingData] = useState<BookingData[]>([])
    const [usersData, setUsersData] = useState<User[]>([])
    const [noOfPages, setNoOfPages] = useState<number>(0);

    const searchBookingIdData = '';
    const [searchUserIdData, setSearchUserIdData] = useState<string>('');

    async function downloadBookings(page: number) {
        getBookingByPage(page, searchBookingIdData, searchUserIdData, (data: AdminBookingData) => {
            setBookingData(data.bookingData)
            setUsersData(data.usersData)
            getBookingCount(searchBookingIdData, searchUserIdData, (count) => {
                setNoOfPages(count / 7)
            })
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
                    <BookingCard booking={booking} user={usersData[i]} key={booking._id} />
                ))
            }
            <Pages onPageChange={downloadBookings} noOfPages={noOfPages} />
        </div>
    );
};

interface BookingCardProps {
    booking: BookingData;
    user: User;
}

export type AdminBookingData = {
    bookingData: BookingData[];
    usersData: User[];
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, user }) => {
    return (
        <>
            <div className='card bg-glass bg-mid-white mb-2'
                data-bs-toggle="modal"
                data-bs-target={"#bookingDetails" + booking._id}>
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

            <div className='modal' aria-labelledby="exampleModalLabel" aria-hidden="true" id={"bookingDetails" + booking._id}>
                <div className="modal-dialog">
                    <div className="modal-content bg-glass bg-deep-white rounded rounded-2">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title" id="exampleModalLabel">All Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className='modal-body form d-flex flex-column px-5'>
                            <div>
                                <h5>User Details:</h5>
                                <div><span style={{ fontWeight: 500 }}>UserID:</span> {booking.userId}</div>
                                <div><span style={{ fontWeight: 500 }}>Username:</span> {user.username}</div>
                                <div><span style={{ fontWeight: 500 }}>Email:</span> {user.email}</div>
                                <div><span style={{ fontWeight: 500 }}>Role:</span> {user.role}</div>
                            </div>
                            <div className='mt-3'>
                                <h5>Booking Details:</h5>
                                <div><span style={{ fontWeight: 500 }}>Bike Model:</span> {booking.bike.bikeModel}</div>
                                <div className='d-grid' style={{ gridAutoFlow: 'column' }}>
                                    <div><span style={{ fontWeight: 500 }}>Brand:</span> {booking.bike.brand}</div>
                                    <div><span style={{ fontWeight: 500 }}>Type:</span> {booking.bike.type}</div>
                                </div>
                                <div className='d-grid' style={{ gridAutoFlow: 'column' }}>
                                    <div><span style={{ fontWeight: 500 }}>CC:</span> {booking.bike.cc}</div>
                                    <div><span style={{ fontWeight: 500 }}>Price (₹/hr):</span> {booking.bike.pricePerHour}</div>
                                </div>
                                <div><span style={{ fontWeight: 500 }}>Start Time:</span> {booking.startTime.split('T')[0]}</div>
                                <div><span style={{ fontWeight: 500 }}>End Time:</span> {booking.endTime.split('T')[0]}</div>
                                <div><span style={{ fontWeight: 500 }}>Status:</span> {booking.status}</div>
                            </div>
                        </div>
                        <div className="modal-footer mx-auto">
                            <button
                                type="button"
                                className="btn btn-outline-dark border-2 border-dark"
                                data-bs-dismiss="modal"
                            >Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingComp;