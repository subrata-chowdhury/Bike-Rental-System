import { AdminBookingData } from '../../admin/pages/BookingPage';
import { Booking } from '../../Types';
import logOut from '../logOut';
import apiUrl from './apiUrl';
const API_BASE_URL = apiUrl + '/api';

export const createBooking = async (bikeId: string, startTime: Date, endTime: Date, onSuccess: () => void = () => { }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
                // Add any additional headers if required
            },
            body: JSON.stringify({ bikeId, startTime: startTime.toISOString(), endTime: endTime.toISOString() }),
        });

        if (response.status === 401) {
            alert("Log in to book");
            window.location.href = '/login'
        }

        if (response.ok) {
            onSuccess();
            alert("Bike Booked Successfully")
        }

        // Return any response data if needed
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getBookings = async (page: number = 0, filterData: { [key: string]: string | { [key: string]: string | string[] } }, onSuccess: (data: { bookings: Booking[], totalBookings: number }) => void): Promise<{ bookings: Booking[], totalBookings: number } | null> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking/${page}?filter=${JSON.stringify({ ...filterData })}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
                // Add any additional headers if required
            },
        });

        if (response.status === 401) {
            return null;
        }
        if (!response.ok) {
            return null;
        }

        const data: { bookings: Booking[], totalBookings: number  } = await response.json();

        if (response.ok) {
            onSuccess(data)
        }

        // Return the booking data
        return data;
    } catch (error) {
        console.error(error);
        return null
        // Handle error
    }
}

export const returnBikeByBikeId = async (bikeId: string, onSuccess: () => void = () => { }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking/bike/${bikeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
                // Add any additional headers if required
            }
        });

        if (!response.ok) {
            throw new Error('Failed to update booking');
        }

        if (response.ok) {
            onSuccess();
            alert("Bike Returned Successfully")
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
};


export const pickBikeByBikeId = async (bikeId: string, onSuccess: () => void = () => { }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking/bike/pick/${bikeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
                // Add any additional headers if required
            }
        });

        if (!response.ok) {
            throw new Error('Failed to update booking');
        }

        if (response.ok) {
            onSuccess();
            alert("Bike Picked Successfully")
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
};





// ADMIN API CALLS




export const getBookingByPage = async (page: number, filterData: { [key: string]: string }, onSuccess: (data: AdminBookingData) => void = () => { }) => {
    for (const key in filterData) {
        if (!filterData[key]) {
            delete filterData[key];
        }
    }
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/booking/page/${page}?filter=${JSON.stringify(filterData)}`, {
            headers: {
                'authorization': `${token}`
            },
        });
        if (response.status === 403 || response.status === 401) {
            logOut();
        }
        const data: AdminBookingData = await response.json();
        if (response.ok)
            onSuccess(data)
        if (response.status === 400) {
            alert("Invalid User ID")
            // throw new Error('Invalid User ID');
        }
        return data;
    } catch (error) {
        console.error(`Error getting bikes with index ${page}:`, error);
        throw error;
    }
}

export async function acceptReturnRequest(bikeId: string, onSuccess: () => void = () => { }) {
    try {
        const res = await fetch(API_BASE_URL + '/booking/accept-return/' + bikeId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${localStorage.getItem('adminToken')}`,
            }
        });
        if (res.ok) {
            alert("Return Request Accepted");
            onSuccess();
        }
    } catch (error) {
        console.error(error);
        alert("Failed to accept return request");
    }
}