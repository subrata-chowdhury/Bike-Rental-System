import BASE_URL from './apiUrl';

const API_URL = `${BASE_URL}/api`;

// Get all bikes
export const getUser = async (): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user`, {
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

export const updateUser = async (username: string, email: string, password: string, onSuccess: () => void): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({ username, email, password })
        });
        if (!response.ok) {
            throw new Error('Error updating user');
        }
        if (response.ok && onSuccess) onSuccess()
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}