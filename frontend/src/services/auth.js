import api from './api';

export const validateToken = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const response = await api.get('/auth/me');
        return response.data.success;
    } catch (error) {
        console.error('Token validation failed:', error);
        return false;
    }
};