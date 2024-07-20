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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting all bikes:', error);
        throw error;
    }
};

export const getBikeCounts = async (logOut: () => void): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes`, {
            headers: {
                'authorization': `${token}`
            }
        });
        if(response.status === 401) {
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
export const getBikesByIndex = async (index: number, onSuccess: (data: object[]) => void = (data: object[]) => { }): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes/${index}`, {
            headers: {
                'authorization': `${token}`
            }
        });
        const data = await response.json();
        onSuccess(data);
        return data;
    } catch (error) {
        console.error(`Error getting bikes with index ${index}:`, error);
        throw error;
    }
};

// Create a new bike
export const createBike = async (bikeData: any): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify(bikeData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating bike:', error);
        throw error;
    }
};

// Delete a bike by ID
export const deleteBike = async (bikeId: number): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes/${bikeId}`, {
            method: 'DELETE',
            headers: {
                'authorization': `${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error deleting bike with ID ${bikeId}:`, error);
        throw error;
    }
};

// Update a bike by ID
export const updateBike = async (bikeId: number, bikeData: any): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/bikes/${bikeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify(bikeData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error updating bike with ID ${bikeId}:`, error);
        throw error;
    }
};