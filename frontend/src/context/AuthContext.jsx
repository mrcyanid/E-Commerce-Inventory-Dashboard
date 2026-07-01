import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('🔍 Checking localStorage:', { token: !!token, user: !!storedUser });

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('✅ User restored from localStorage:', parsedUser.name);
            } catch (error) {
                console.error('❌ Error parsing user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('📝 Attempting login for:', email);
            
            const response = await api.post('/auth/login', { email, password });
            
            console.log('📥 Login response:', response.data);
            
            const { token, user } = response.data;
            
            // ✅ Store token and user
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // ✅ Set default Authorization header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            toast.success(`Welcome back, ${user.name}! 🎉`);
            return { success: true };
        } catch (error) {
            console.error('❌ Login error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        toast.success('Logged out successfully');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};