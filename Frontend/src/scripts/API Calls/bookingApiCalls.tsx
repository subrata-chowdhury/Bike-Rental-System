import apiUrl from './apiUrl';
const API_BASE_URL = apiUrl + '/api';

export const createBooking = async (bookingData: any) => {
    console.log(bookingData)
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