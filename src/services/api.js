/**
 * 🎊 RuangTamu - Wedding Check-in System
 * API Service Layer (UPDATED WITH CHECK-IN DATA!)
 * by PutuWistika
 */

import axios from 'axios';

// ============================================
// CONFIGURATION
// ============================================

const BASE_URL = 'https://servern8n.putuwistika.com';

console.log('🔧 API Configuration:', {
  baseURL: BASE_URL,
  loginEndpoint: `${BASE_URL}/webhook/auth/login`,
});

// ============================================
// Create Axios Instance
// ============================================

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Request Interceptor
// ============================================

api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor (UNIVERSAL FIX!)
// ============================================

api.interceptors.response.use(
  (response) => {
    console.log('📥 Raw API Response:', response.data);
    
    let data = response.data;
    
    // Handle array response (e.g., login returns [{...}])
    if (Array.isArray(data) && data.length > 0) {
      console.log('🔄 Array response detected, extracting first element');
      data = data[0];
    }
    
    console.log('✅ Processed Response:', data);
    return data;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return Promise.reject(new Error('Unable to connect to server'));
    }

    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// ============================================
// AUTH ENDPOINTS
// ============================================

/**
 * Login user
 * Endpoint: POST /webhook/auth/login
 */
export const login = async (email, password) => {
  try {
    console.log('🔐 Attempting login...', { email });
    
    const response = await api.post('/webhook/auth/login', { email, password });
    
    console.log('✅ Login response:', response);
    return response;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
};

// ============================================
// GUEST ENDPOINTS
// ============================================

/**
 * Get all guests
 * Endpoint: GET /webhook/get-guests
 */
export const getAllGuests = async () => {
  try {
    const response = await api.get('/webhook/get-guests');
    
    console.log('📋 Get all guests response:', response);
    
    // ✅ Extract guests array if exists
    if (response.guests) {
      return {
        success: response.success,
        data: response.guests,
        total: response.total || response.guests.length,
      };
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single guest by UID
 * Endpoint: GET /webhook/1d3229bc-af4b-4a6b-bef1-b16b8760a05f/get-guest/:uid
 */
export const getGuestByUID = async (uid) => {
  try {
    const response = await api.get(`/webhook/1d3229bc-af4b-4a6b-bef1-b16b8760a05f/get-guest/${uid}`);
    
    console.log('👤 Get guest by UID response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Search guests (fuzzy search)
 * Endpoint: POST /webhook/search-guests
 */
export const searchGuests = async (query) => {
  try {
    const response = await api.post('/webhook/search-guests', { query });
    
    console.log('🔍 Search response:', response);
    
    // ✅ Extract guests array if exists
    if (response.guests) {
      return {
        success: response.success,
        data: response.guests,
        total: response.total || response.guests.length,
        query: response.query,
      };
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new guest
 * Endpoint: POST /webhook/create-guest
 */
export const createGuest = async (guestData) => {
  try {
    console.log('➕ Creating guest:', guestData);
    
    const response = await api.post('/webhook/create-guest', guestData);
    
    console.log('✅ Create guest response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Check-in guest (UPDATED WITH OPTIONAL DATA!)
 * Endpoint: POST /webhook/check-in-guest
 * 
 * @param {string} uid - Guest UID (required)
 * @param {object} checkInData - Optional check-in data
 * @param {number} checkInData.companion_count - Number of companions
 * @param {string} checkInData.gift_type - Type of gift (Angpao, Gift, Flowers, etc)
 * @param {string} checkInData.gift_notes - Notes about the gift
 * 
 * @returns {Promise} Response with guest data and check-in status
 * 
 * Response Success (200):
 * {
 *   "_error": false,
 *   "success": true,
 *   "message": "GUEST CHECK-IN SUCCESS",
 *   "statusCode": 200,
 *   "guest": { ...complete guest data with QR code... }
 * }
 * 
 * Response Already Checked In (400):
 * {
 *   "_error": true,
 *   "success": false,
 *   "message": "Guest already checked in",
 *   "guest": { ...existing guest data... },
 *   "statusCode": 400
 * }
 * 
 * Response Not Found (404):
 * {
 *   "_error": true,
 *   "success": false,
 *   "message": "Guest not found",
 *   "statusCode": 404
 * }
 */
export const checkInGuest = async (uid, checkInData = {}) => {
  try {
    console.log('🎫 Checking in guest:', { uid, checkInData });
    
    // Prepare payload
    const payload = {
      uid,
      ...checkInData,
    };

    // Remove undefined/null values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });
    
    const response = await api.post('/webhook/check-in-guest', payload);
    
    console.log('✅ Check-in response:', response);
    
    // Return response with proper structure
    return {
      success: response.success || !response._error,
      message: response.message,
      statusCode: response.statusCode,
      guest: response.guest,
      _error: response._error,
    };
  } catch (error) {
    console.error('❌ Check-in error:', error);
    throw error;
  }
};

/**
 * Take guest from queue (Runner)
 * Endpoint: POST /webhook/take-guest
 */
export const takeGuest = async (uid, takeData) => {
  try {
    console.log('🚀 Taking guest to table:', { uid, takeData });

    const response = await api.post('/webhook/take-guest', {
      uid,
      ...takeData,
    });

    console.log('✅ Take guest response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

// ============================================
// QUEUE ENDPOINTS
// ============================================

/**
 * Get queue list
 * Endpoint: GET /webhook/get-queue
 */
export const getQueue = async () => {
  try {
    const response = await api.get('/webhook/get-queue');
    
    console.log('📋 Queue response:', response);
    
    // ✅ Extract guests/queue array if exists
    if (response.guests) {
      return {
        success: response.success,
        data: response.guests,
        total: response.total || response.guests.length,
      };
    }
    
    if (response.queue) {
      return {
        success: response.success,
        data: response.queue,
        total: response.total || response.queue.length,
      };
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ Alias for backward compatibility
export const getQueueList = getQueue;

/**
 * Get runner's completed guests
 * Endpoint: GET /webhook/99572f92-6c4f-486b-b4e4-dd5df671e866/runner-completed/:runnerId
 */
export const getRunnerCompleted = async (runnerId) => {
  try {
    const response = await api.get(`/webhook/99572f92-6c4f-486b-b4e4-dd5df671e866/runner-completed/${runnerId}`);
    
    console.log('✅ Runner completed response:', response);
    
    // ✅ Extract guests array if exists
    if (response.guests) {
      return {
        success: response.success,
        data: response.guests,
        total: response.total || response.guests.length,
      };
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;