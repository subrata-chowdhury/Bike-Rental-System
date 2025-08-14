import { User } from '../../Types';
import logOut from '../logOut';
import BASE_URL from './apiUrl';

const API_URL = `${BASE_URL}/api`;

// Get user details
export const getUser = async (): Promise<User | null> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user`, {
            headers: {
                'authorization': `${token}`
            }
        });

        if (!response.ok) {
            // logOut();
            return null
        }
        const data: User = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting user details:', error);
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

export const deleteUser = async (password: string, onDelete: () => void) => {
    try {
        const token = localStorage.getItem('token'); // Get token from local storage or state

        if (!token) {
            alert('User is not authenticated');
            return;
        }

        const response = await fetch(API_URL + `/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
            },
            body: JSON.stringify({ password })
        });

        if (response.ok) {
            onDelete(); // Update parent component or state
        } else {
            const data = await response.json();
            alert(data.message || 'Error deleting user');
        }
    } catch (err) {
        alert('Error deleting user');
    }
};




// ADMIN CALLS

export const getUsersByIndex = async (page: number, filterData: { email: string }, onSuccess: (data: { users: User[], totalUsers: number }) => void = () => { }) => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/user/page/${page}?filter=${JSON.stringify(filterData)}`, {
            headers: {
                'authorization': `${token}`
            },
        });
        if (response.status === 403 || response.status === 401) {
            logOut();
        }
        const data: { users: User[], totalUsers: number } = await response.json();
        if (response.ok)
            onSuccess(data);
        if (response.status === 400) {
            alert("Invalid email")
            // throw new Error('Invalid User ID');
        }
        return data;
    } catch (error) {
        console.error(`Error getting bikes with index ${page}:`, error);
        throw error;
    }
}

export const updateUserByAdmin = async (id: string, username: string, email: string, password: string, role: string, onSuccess: () => void, logout: () => void = () => { }): Promise<void> => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/user/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({ id, username, email, password, role })
        });
        if (!response.ok) {
            const msg = await response.json()
            alert(msg.message || 'Error updating user');
            throw new Error('Error updating user');
        }
        if (response.status === 401) {
            logout();
        }
        if (response.ok && onSuccess) onSuccess()
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const deleteUserByAdmin = async (userId: string, onDelete: () => void) => {
    try {
        const token = localStorage.getItem('adminToken'); // Get token from local storage or state
        const response = await fetch(API_URL + `/user/admin/deleteUser`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
            },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            onDelete(); // Update parent component or state
        } else {
            const data = await response.json();
            alert(data.message || 'Error deleting user');
        }
    } catch (err) {
        alert('Error deleting user');
    }
};