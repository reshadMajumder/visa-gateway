// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  API_VERSION: 'api',
  ENDPOINTS: {
    AUTH: 'accounts',
    VISA: 'v2'
  }
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint, path = '') => {
  const base = `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}`;
  return path ? `${base}/${endpoint}/${path}` : `${base}/${endpoint}/`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_BASE: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH),
  REGISTER: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH, 'register/'),
  LOGIN: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH, 'login/'),
  LOGOUT: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH, 'logout/'),
  REFRESH_TOKEN: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH, 'login/refresh/'),
  PROFILE: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH, 'profile/'),
  
  // Visa endpoints
  VISA_APPLICATIONS: buildApiUrl(API_CONFIG.ENDPOINTS.VISA, 'visa-applications/'),
  
  // Other endpoints
  COUNTRIES: `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}/countries`,
  VISA_TYPES: `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}/visa-types`,
  COUNTRY_VISA_TYPES: `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}/country-visa-types`,
};

// Helper function to build media URLs
export const buildMediaUrl = (path) => {
  return `${API_CONFIG.BASE_URL}${path}`;
};

export default API_CONFIG;
