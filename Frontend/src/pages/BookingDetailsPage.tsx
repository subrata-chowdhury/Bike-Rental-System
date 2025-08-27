import { useLocation } from 'react-router-dom'
import Menubar from '../components/Menubar';
import { Booking } from '../Types';
import bikeIcon from '../assets/bike.svg';
import tickIcon from '../assets/tick.svg';
import { pickBikeByBikeId, returnBikeByBikeId } from '../scripts/API Calls/bookingApiCalls';
import { useSocket } from '../scripts/socket';
import { useEffect, useState } from 'react';

const BookingDetailsPage = () => {
    const location = useLocation();
    const [bookingData, setBookingDetails] = useState<Booking>(location.state);
    const socketRef = useSocket();

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on('booking_details_changed', (booking) => {
            booking = booking.booking;
            setBookingDetails(booking);
        });

        return () => {
            socketRef.current?.off('booking_details_changed');
        };
    }, [socketRef]);

    return (
        <>
            <Menubar />
            <div className='p-4'>
                <div>Booking ID: {bookingData._id.toUpperCase()}</div>
                <div className='card card-body d-flex flex-row justify-content-between mt-2'>
                    <div>
                        <h3 className='mb-0'>{bookingData.bike.bikeModel}</h3>
                        <div>{bookingData.bike.brand}</div>
                        <div>{bookingData.bike.type}</div>
                        <h2 className='mb-0 mt-3'>{bookingData.bike.pricePerHour}₹/hr</h2>
                    </div>
                    <div>
                        <img width={80} height={80} src={bookingData.bike.images[0] ? 'http://localhost:5000/uploads/' + bookingData.bike.images[0] : bikeIcon} />
                    </div>
                </div>
                {bookingData.statusLogs?.length > 0 && <div className='card card-body mt-2'>
                    <h6>Status Logs</h6>
                    {bookingData.statusLogs.map((log, i) => (
                        <div>
                            {i + 1}. {log.status} at {new Date(log.timestamp).toLocaleString()}
                        </div>
                    ))}
                </div>}
                <div className='card card-body mt-2'>
                    <div>Pick up time: {new Date(bookingData.startTime).toLocaleString()}</div>
                    <div>Return time: {new Date(bookingData.endTime).toLocaleString()}</div>
                    <div>Booking Created at: {new Date(bookingData.createdAt).toLocaleString()}</div>
                    <div>Order Modified at: {new Date(bookingData.updatedAt).toLocaleString()}</div>
                </div>
                <div className='d-flex justify-content-end mt-2'>
                    {bookingData.status === 'booked' && <button className='btn btn-dark' onClick={() => { if (bookingData?.bike?._id) pickBikeByBikeId(bookingData.bike._id) }}>Pick Up</button>}
                    {bookingData.status === 'picked up' && <button className='btn btn-dark' onClick={() => { if (bookingData?.bike?._id) returnBikeByBikeId(bookingData.bike._id) }}>Request Return</button>}
                    {bookingData.status === 'return requested' && <div>Return Requested</div>}
                    {bookingData.status === 'returned' && <div className='d-flex alight-items-center gap-2 me-2'><img src={tickIcon} width={20} height={20} className='my-auto' />Bike Returned</div>}
                    {bookingData.status === 'canceled' && <div>Booking Canceled</div>}
                </div>
            </div>
        </>
    )
}

export default BookingDetailsPage