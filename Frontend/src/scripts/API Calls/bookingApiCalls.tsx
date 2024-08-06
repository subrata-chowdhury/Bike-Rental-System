import { BookingData } from '../../components/AdminPage/Booking';
import logOut from '../logOut';
import apiUrl from './apiUrl';
const API_BASE_URL = apiUrl + '/api';

export const createBooking = async (bookingData: any) => {
    console.log(bookingData);
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
                // Add any additional headers if required
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            throw new Error('Failed to create booking');
        }

        // Return any response data if needed
        // const data = await response.json();
        // return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
};

export const getBookingThatHasToReturn = async () => {
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

        // Return the booking data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
}

export const getBookingHistoryByUserId = async () => {
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

        if (!response.ok) {
            throw new Error('Failed to get booking');
        }
        if (response.status === 401) {
            logOut();
        }

        // Return the booking data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
};

export const returnBikeByBikeId = async (bikeId: string | undefined) => {
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

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
};

export const getBookingDetailsThatHasToReturn = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/booking/bookingDetailsOfToday`, {
            headers: {
                'authorization': `${token}`,
                // Add any additional headers if required
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get booking');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        // Handle error
    }
}





// ADMIN API CALLS




export const getBookingByPage = async (page: number, bookingId: string = '', userId: string = '', onSuccess: (data: BookingData) => void = () => { }) => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/booking/page/${page}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({ bookingId, userId })
        });
        if (response.status === 401) {
        }
        const data = await response.json();
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

export const getBookingCount = async (bookingId: string = '', userId: string = '', onSuccess: (data: string | number) => void = () => { }) => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/booking/pages/count`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({ bookingId, userId })
        });
        if (response.status === 401) {
        }
        const data = await response.json();
        if (response.ok)
            onSuccess(data.total)
        if (response.status === 400) {
            alert("Invalid User ID")
            // throw new Error('Invalid User ID');
        }
        return data;
    } catch (error) {
        console.error(`Error getting bikes count`, error);
        throw error;
    }
}