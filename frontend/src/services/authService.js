import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/accounts/';

const setAuthToken = (tokens) => {
    if (tokens) {
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
    }
};

const register = async (userData) => {
    try {
        const response = await axios.post(API_URL + 'register/', {
            email: userData.email,
            username: userData.email.split('@')[0], // Generate username from email
            password: userData.password,
            password2: userData.confirmPassword,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone_number: userData.phone
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Registration failed' };
    }
};

const login = async (credentials) => {
    try {
        const response = await axios.post(API_URL + 'login/', {
            email: credentials.email,
            password: credentials.password
        });
        
        if (response.data.access) {
            setAuthToken(response.data);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Login failed' };
    }
};

const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await axios.post(API_URL + 'logout/', {
                refresh_token: refreshToken
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        setAuthToken(null);
    }
};

const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(API_URL + 'login/refresh/', {
            refresh: refreshToken
        });

        if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        }
        return response.data;
    } catch (error) {
        setAuthToken(null);
        throw error;
    }
};

// Axios interceptor for automatic token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshAccessToken();
                return axios(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register,
    login,
    logout,
    refreshAccessToken,
    setAuthToken
};
