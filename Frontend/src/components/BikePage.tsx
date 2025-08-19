import { useParams } from 'react-router-dom';
import Footer from './Footer';
import Menubar from './Menubar';
import { useEffect, useState } from 'react';
import { Bike } from '../Types';
import { getBikesById } from '../scripts/API Calls/bikeApiCalls.ts';
import bikeIcon from '../assets/bike.svg';
import tickIcon from '../assets/tick.svg'
import { createBooking, returnBikeByBikeId } from '../scripts/API Calls/bookingApiCalls.ts';
import { useOrderdBikes } from '../contexts/OrderdBikesContext';
import { useSocket } from '../scripts/socket';

const BikePage = () => {
    const { id } = useParams(); // Access dynamic id
    const [bikeDetails, setBikeDetails] = useState<Bike | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showBookingPopup, setShowBookingPopup] = useState(false);
    const orderedBikes = useOrderdBikes();
    const socketRef = useSocket();

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on('bike_details_changed', (bike) => {
            bike = bike.bike;
            setBikeDetails(bike);
        });

        return () => {
            socketRef.current?.off('bike_details_changed');
        };
    }, [socketRef]);

    useEffect(() => {
        if (id) getBikesById(id, setBikeDetails);
    }, [id]);

    const [newStartTime, setStartTime] = useState<Date>(new Date());
    const [newEndTime, setEndTime] = useState<Date>(new Date());

    function toDatetimeLocal(date: Date): string {
        const pad = (n: number) => String(n).padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // months are 0-indexed
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    return (
        <>
            <Menubar />
            {bikeDetails ? <div className='container d-flex flex-grow-1 mt-4 mb-4'>
                <div className='me-4 d-flex flex-column gap-2'>
                    {bikeDetails.images.map((imageURL, i) => (
                        <img
                            key={imageURL}
                            src={'http://localhost:5000/uploads/' + imageURL}
                            width={50}
                            height={50}
                            style={{ background: `rgba(0, 0, 0, 0.1)`, objectFit: 'cover', objectPosition: 'center' }}
                            onClick={() => setActiveImageIndex(i)}
                            className={`border rounded-1 ${activeImageIndex === i ? 'border-secondary' : 'border-0'}`}
                        />
                    ))}
                </div>
                <div className='border'>
                    <img
                        src={bikeDetails.images[activeImageIndex] ? ('http://localhost:5000/uploads/' + bikeDetails.images[activeImageIndex]) : bikeIcon}
                        width={'100%'}
                        className='my-auto'
                        style={{ background: `rgba(0, 0, 0, 0.1)`, objectFit: 'cover', objectPosition: 'center', maxWidth: '45vw' }}
                        alt='bike' />
                </div>
                <div className='ms-4 flex-grow-1' style={{ maxWidth: '50vw' }}>
                    <h2 className='mb-0 fw-semibold'>{bikeDetails.bikeModel}</h2>
                    <p className='text-secondary fw-semibold'>{bikeDetails.brand}</p>
                    <div className='col'>
                        <p className='m-0'><b>CC:</b> {bikeDetails.cc}</p>
                        <p className='m-0'><b>Horse Power:</b> {bikeDetails.horsePower}</p>
                        <p className='m-0'><b>Type:</b> {bikeDetails.type}</p>
                        <p className={'d-flex align-items-center' + (bikeDetails.isAvailable ? " text-success" : " text-danger")}>
                            {bikeDetails.isAvailable ? 'Available ' : 'Not Available '}
                            {bikeDetails.isAvailable && <img width={15} height={15} className='ms-2' src={tickIcon}></img>}
                        </p>
                    </div>
                    <p className='mb-2'><span style={{ fontSize: '2rem', fontWeight: 700 }}>{bikeDetails.pricePerHour}</span>₹/hr</p>
                    {/* <div className='col'>
                        <label htmlFor='startDate'>Start Date:</label>
                        <input
                            type='date'
                            id='startDate'
                            className='form-control mt-1'
                            value={newStartTime.toISOString().split('T')[0]}
                            onChange={e => {
                                if (new Date(e.target.value) > new Date()) setStartTime(new Date(e.target.value))
                                if (new Date(e.target.value) > newEndTime) setEndTime(new Date(e.target.value))
                            }} />
                        <label htmlFor='returnDate' className=' mt-2'>Return Date:</label>
                        <input
                            type='date'
                            id='returnDate'
                            className='form-control mt-1'
                            value={newEndTime.toISOString().split('T')[0]}
                            onChange={e => {
                                if (new Date(e.target.value) > new Date()) setEndTime(new Date(e.target.value))
                                if (new Date(e.target.value) < newStartTime) setStartTime(new Date(e.target.value))
                            }} />
                    </div> */}
                    <div>
                        <button
                            disabled={!bikeDetails.isAvailable}
                            className={`btn rounded-1 border-2 w-100 btn-dark ${bikeDetails.isAvailable ? '' : 'disabled'}`}
                            onClick={() => setShowBookingPopup(val => !val)}>Book</button>
                        {orderedBikes.orderedBikes.some(booking => booking._id === bikeDetails._id) && <button
                            className='btn border-2 border-dark w-100 mt-2'
                            onClick={async () => {
                                if (!bikeDetails._id) {
                                    alert('Bike ID is missing');
                                    return;
                                }

                                await returnBikeByBikeId(bikeDetails._id, () => {
                                    orderedBikes.removeBike(bikeDetails._id || '');
                                    if (id) getBikesById(id, setBikeDetails);
                                })
                            }}>Return</button>}
                    </div>
                </div>
            </div> : <div>No bike details available</div>}
            <Footer />
            {
                showBookingPopup && bikeDetails && <div className='position-fixed top-0 start-0 d-flex justify-content-center align-items-center w-100' style={{ height: '100vh', zIndex: 50, background: 'rgba(0,0,0,0.1)' }} onClick={() => setShowBookingPopup(false)}>
                    <div className='bg-white p-4 rounded-2' onClick={e => e.stopPropagation()} style={{ width: '30vw', minWidth: '300px', maxWidth: '500px' }}>
                        <h4 className='mb-3'>Book {bikeDetails.bikeModel}</h4>
                        <div className='d-flex flex-column gap-2'>
                            <label htmlFor='startTime'>Start Time:</label>
                            <input
                                type="datetime-local"
                                id='startTime'
                                className='form-control'
                                value={toDatetimeLocal(newStartTime)}
                                onChange={e => { setStartTime(new Date(e.target.value)); console.log(e.target.value) }} />
                            <label htmlFor='endTime'>End Time:</label>
                            <input
                                type='datetime-local'
                                id='endTime'
                                className='form-control'
                                value={toDatetimeLocal(newEndTime)}
                                onChange={e => setEndTime(new Date(e.target.value))} />
                        </div>
                        <button
                            className='btn btn-primary mt-3 w-100'
                            onClick={async () => {
                                const currentData = new Date()
                                currentData.setHours(0, 0, 0, 0)
                                if (newStartTime < currentData) {
                                    alert('Start time cannot be in the past')
                                    return
                                }
                                if (newEndTime < currentData) {
                                    alert('End time cannot be in the past')
                                    return
                                }
                                if (newStartTime > newEndTime) {
                                    alert('Start time cannot be greater than end time')
                                    return
                                }
                                if (!bikeDetails._id) {
                                    alert('Bike ID is missing');
                                    return;
                                }

                                await createBooking(bikeDetails._id, newStartTime, newEndTime, () => {
                                    orderedBikes.addBike(bikeDetails);
                                    setShowBookingPopup(false);
                                    if (id) getBikesById(id, setBikeDetails);
                                })
                            }}>Book</button>
                    </div>
                </div>}
        </>
    );
}

export default BikePage