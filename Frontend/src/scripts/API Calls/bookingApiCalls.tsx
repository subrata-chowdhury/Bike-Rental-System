import { AdminBookingData } from '../../components/AdminPage/Booking';
import { BookingData } from '../../Types';
import { Bike } from '../../Types';
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
            body: JSON.stringify({ bikeId, startTime, endTime }),
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

export const getBookingThatHasToReturn = async (onSuccess: (bikesData: Bike[]) => void) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking/returnBikes`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
                // Add any additional headers if required
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get booking');
        }
        if (response.status === 401) {
            logOut();
        }

        const data: Bike[] = await response.json();

        if (response.ok) {
            onSuccess(data)
        }

        // Return the booking data
        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
}

export const getBookingHistoryByUserId = async (onSuccess: (bikesData: BookingData[]) => void) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
                // Add any additional headers if required
            },
        });

        if (response.status === 401) {
            return null
        }

        if (!response.ok) {
            throw new Error('Failed to get booking');
        }

        // Return the booking data
        const data: BookingData[] = await response.json();

        if (response.ok) {
            onSuccess(data)
        }

        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
};

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

export const getBookingDetailsThatHasToReturnToday = async (onSuccess: (bikesData: Bike[]) => void) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking/bookingDetailsOfToday`, {
            headers: {
                'authorization': `${token}`,
                // Add any additional headers if required
            }
        });

        if (response.status === 401) {
            return null
        }

        if (!response.ok) {
            throw new Error('Failed to get booking');
        }

        const data: Bike[] = await response.json();

        if (response.ok) onSuccess(data)

        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
}





// ADMIN API CALLS




export const getBookingByPage = async (page: number, filterData: { userId: string }, onSuccess: (data: AdminBookingData) => void = () => { }) => {
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