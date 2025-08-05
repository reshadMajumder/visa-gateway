
const API_BASE_URL = 'https://spring.rexhad.co/api/admin';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const requestOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  // If unauthorized, try to refresh token
  if (response.status === 401 && token) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry request with new token
      const newToken = localStorage.getItem('adminToken');
      requestOptions.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    } else {
      // Refresh failed, redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      window.location.reload();
      return null;
    }
  }

  return response;
};

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('adminRefreshToken');
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('adminToken', data.access);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};
