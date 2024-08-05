import { FilterData } from '../../components/Filter';
import logOut from '../logOut';
import BASE_URL from './apiUrl';

const API_URL = `${BASE_URL}/api`;

// Get all bikes
export const getAllBikes = async (): Promise<any> => {
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting all bikes:', error);
        throw error;
    }
};

export const getBikeCounts = async (filterData?: FilterData, searchData?: string | undefined, isAdminReq: boolean = false): Promise<any> => {
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting all bikes:', error);
        throw error;
    }
}

// Get a single bike by ID
export const getBikeById = async (id: number): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes/${id}`, {
            headers: {
                'authorization': `${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error getting bike with ID ${id}:`, error);
        throw error;
    }
};

// Get bikes by index and limit
export const getBikesByIndex = async (index: number, filterData?: FilterData, searchData?: string | undefined, onSuccess: (data: object[]) => void = () => { }, isAdminReq: boolean = false): Promise<any> => {
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
        const data = await response.json();
        onSuccess(data);
        return data;
    } catch (error) {
        console.error(`Error getting bikes with index ${index}:`, error);
        throw error;
    }
};

// Get all types
export const getTypes = async (): Promise<any> => {
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
        const data = await response.json();
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
export const deleteBike = async (bikeId: string, onSuccess: () => void): Promise<any> => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/bikes/delete/${bikeId}`, {
            method: 'DELETE',
            headers: {
                'authorization': `${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            onSuccess();
        }
        return data;
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