
import logOut from '../logOut';
import BASE_URL from './apiUrl';

const API_URL = `${BASE_URL}/api`;

export const uploadFile = async (image: File): Promise<string> => {
    try {
        const token = localStorage.getItem('adminToken');
        const formData = new FormData();
        formData.append('image', image);

        const response = await fetch(`${API_URL}/bikes/upload/new`, {
            method: 'POST',
            headers: {
                'authorization': `${token}`
            },
            body: formData
        });
        if (response.status === 401) {
            logOut();
        }
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        const data = await response.json();
        return data.imagePath as string;
    } catch (error) {
        console.error('Error getting all bikes:', error);
        throw error;
    }
};

export const deleteImage = async (imageName: string, onSuccess: () => void, onFailed: () => void): Promise<void> => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/bikes/upload/${imageName}`, {
            method: 'DELETE',
            headers: {
                'authorization': `${token}`
            }
        });
        if (response.status === 401) {
            logOut();
        }
        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
        const data = await response.json();
        console.log(data.message);
        onSuccess();
    } catch (error) {
        console.error('Error deleting image:', error);
        onFailed();
    }
}