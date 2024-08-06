import { Bike, FilterData } from '../../Types';
import logOut from '../logOut';
import BASE_URL from './apiUrl';

const API_URL = `${BASE_URL}/api`;

export const getBikeCounts = async (filterData?: FilterData, searchData?: string, isAdminReq: boolean = false): Promise<number> => {
    try {
        const token = isAdminReq ? localStorage.getItem('adminToken') : localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({ filterData: filterData, searchData: searchData })
        });
        if (response.status === 401) {
            logOut();
        }
        const data: number = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting all bikes:', error);
        throw error;
    }
};

// Get bikes by index and limit
export const getBikesByIndex = async (index: number, filterData?: FilterData, searchData?: string, onSuccess: (data: Bike[]) => void = () => { }, isAdminReq: boolean = false): Promise<any> => {
    try {
        const token = isAdminReq ? localStorage.getItem('adminToken') : localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes/${index}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({ filterData: filterData, searchData: searchData })
        });
        if (response.status === 401) {
            logOut();
        }
        const data: Bike[] = await response.json();
        onSuccess(data);
        return data;
    } catch (error) {
        console.error(`Error getting bikes with index ${index}:`, error);
        throw error;
    }
};

// Get all types
export const getTypes = async (): Promise<FilterData> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes`, {
            headers: {
                'authorization': `${token}`
            }
        });
        if (response.status === 401) {
            logOut();
        }
        const data: FilterData = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting all types:', error);
        throw error;
    }
};




//ADMIN CALLS




// Create a new bike
export const createBike = async (bikeData: FormData): Promise<any> => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/bikes/new/newBike`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'authorization': `${token}`
            },
            body: bikeData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating bike:', error);
        throw error;
    }
};

// Delete a bike by ID
export const deleteBike = async (bikeId: string, onSuccess: () => void = () => { }): Promise<any> => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/bikes/delete/${bikeId}`, {
            method: 'DELETE',
            headers: {
                'authorization': `${token}`
            }
        });
        if (response.ok) {
            alert("Bike deleted Successfully");
            onSuccess();
        } else {
            const data = await response.json();
            alert(data.message || 'Error deleting bike');
        }
    } catch (error) {
        console.error(`Error deleting bike with ID ${bikeId}:`, error);
        throw error;
    }
};

// Update a bike by ID
export const updateBike = async (bikeId: string, bikeData: FormData): Promise<any> => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/bikes/update/${bikeId}`, {
            method: 'PUT',
            headers: {
                'authorization': `${token}`
            },
            body: bikeData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error updating bike with ID ${bikeId}:`, error);
        throw error;
    }
};