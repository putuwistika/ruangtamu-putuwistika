/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Constants & Configuration (UPDATED WITH QR CODE!)
 * by PutuWistika
 */

// ============================================
// API Configuration
// ============================================

/**
 * Base URL untuk API n8n
 * @type {string}
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://servern8n.putuwistika.com';

/**
 * API Endpoints
 * Berdasarkan dokumentasi WEDDING_API_COMPLETE_DOCUMENTATION.md
 */
export const API_ENDPOINTS = {
  // 🔐 Authentication
  LOGIN: '/webhook/auth/login',
  
  // 👥 Guest Management
  GET_GUEST: '/webhook/1d3229bc-af4b-4a6b-bef1-b16b8760a05f/get-guest', // + /:uid
  SEARCH_GUESTS: '/webhook/search-guests',
  CREATE_GUEST: '/webhook/create-guest',
  GET_ALL_GUESTS: '/webhook/get-guests', // optional ?status=queue|done|not_arrived
  
  // ✅ Check-in
  CHECK_IN_GUEST: '/webhook/check-in-guest',
  
  // 🏃 Runner
  TAKE_GUEST: '/webhook/take-guest',
  GET_QUEUE: '/webhook/get-queue',
  RUNNER_COMPLETED: '/webhook/99572f92-6c4f-486b-b4e4-dd5df671e866/runner-completed', // + /:runnerId
};

// ============================================
// App Configuration
// ============================================

export const APP_NAME = 'RuangTamu';
export const APP_TAGLINE = 'by PutuWistika';
export const APP_VERSION = '1.0.0';

// ============================================
// Polling Intervals (milliseconds)
// ============================================

export const POLL_INTERVALS = {
  QUEUE: 3000,
  STATS: 5000,
  COMPLETED: 10000,
  CONNECTION: 30000,
};

// ============================================
// Guest Status
// ============================================

export const GUEST_STATUS = {
  NOT_ARRIVED: 'not_arrived',
  QUEUE: 'queue',
  DONE: 'done',
};

export const STATUS_LABELS = {
  [GUEST_STATUS.NOT_ARRIVED]: 'Not Arrived',
  [GUEST_STATUS.QUEUE]: 'In Queue',
  [GUEST_STATUS.DONE]: 'Completed',
};

export const STATUS_COLORS = {
  [GUEST_STATUS.NOT_ARRIVED]: 'bg-gray-100 text-gray-800 border-gray-300',
  [GUEST_STATUS.QUEUE]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [GUEST_STATUS.DONE]: 'bg-green-100 text-green-800 border-green-300',
};

export const STATUS_ICONS = {
  [GUEST_STATUS.NOT_ARRIVED]: 'UserX',
  [GUEST_STATUS.QUEUE]: 'Clock',
  [GUEST_STATUS.DONE]: 'CheckCircle',
};

// ============================================
// User Roles & Permissions
// ============================================

export const USER_ROLES = {
  ADMIN: 'admin',
  RUNNER: 'runner',
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.RUNNER]: 'Runner',
};

export const PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'search_guest',
    'create_guest',
    'check_in_guest',
    'view_all_guests',
    'view_queue',
    'view_statistics',
    'take_guest',
  ],
  [USER_ROLES.RUNNER]: [
    'view_queue',
    'take_guest',
    'view_completed',
    'view_all_guests',
  ],
};

// ============================================
// Local Storage Keys
// ============================================

export const STORAGE_KEYS = {
  USER: 'ruangtamu_user',
  TOKEN: 'ruangtamu_token',
  LAST_LOGIN: 'ruangtamu_last_login',
  REMEMBER_ME: 'ruangtamu_remember',
};

// ============================================
// Invitation & Gift Types
// ============================================

export const INVITATION_TYPES = [
  'VIP',
  'Regular',
  'Family',
  'Colleague',
  'Friend',
  'Other',
];

export const INVITATION_COLORS = {
  VIP: 'bg-purple-100 text-purple-800 border-purple-300',
  Regular: 'bg-blue-100 text-blue-800 border-blue-300',
  Family: 'bg-pink-100 text-pink-800 border-pink-300',
  Colleague: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  Friend: 'bg-green-100 text-green-800 border-green-300',
  Other: 'bg-gray-100 text-gray-800 border-gray-300',
};

export const GIFT_TYPES = [
  'Angpao',
  'Gift',
  'Flowers',
  'Hampers',
  'Other',
];

// ============================================
// QR Code Configuration (NEW!)
// ============================================

/**
 * QR Code Server Configuration
 * Using https://api.qrserver.com for QR generation
 * 
 * QR Code will contain URL to guest card page
 * Format: {BASE_APP_URL}/guest/{uid}
 */
export const QR_CODE_CONFIG = {
  // Base URL for QR generation API
  BASE_URL: 'https://api.qrserver.com/v1/create-qr-code/',
  
  // Size options (width x height in pixels)
  SIZES: {
    SMALL: '150x150',
    MEDIUM: '300x300',
    LARGE: '500x500',
    XLARGE: '1000x1000',
  },
  
  // Default size for QR code generation
  DEFAULT_SIZE: '300x300',
  
  // Error correction level
  // L = Low (7% of data bytes can be restored)
  // M = Medium (15% of data bytes can be restored) - DEFAULT
  // Q = Quartile (25% of data bytes can be restored)
  // H = High (30% of data bytes can be restored)
  ERROR_CORRECTION: 'M',
  
  // Default margin (quiet zone) around QR code
  MARGIN: 1,
  
  // Image format
  FORMAT: 'png',
};

/**
 * Generate QR Code URL for guest
 * @param {string} uid - Guest UID
 * @param {string} size - Size option (SMALL, MEDIUM, LARGE, XLARGE)
 * @returns {string} Complete QR code image URL
 * 
 * @example
 * getQRCodeURL('g_abc123', 'MEDIUM')
 * // Returns: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://yourapp.com/guest/g_abc123
 */
export const getQRCodeURL = (uid, size = 'MEDIUM') => {
  // Get size from config
  const qrSize = QR_CODE_CONFIG.SIZES[size] || QR_CODE_CONFIG.DEFAULT_SIZE;
  
  // Generate data URL (guest card page)
  const data = getGuestCardURL(uid);
  
  // Build QR code URL with parameters
  const params = new URLSearchParams({
    size: qrSize,
    data: data,
    margin: QR_CODE_CONFIG.MARGIN,
    format: QR_CODE_CONFIG.FORMAT,
  });
  
  return `${QR_CODE_CONFIG.BASE_URL}?${params.toString()}`;
};

/**
 * Get guest card URL
 * @param {string} uid - Guest UID
 * @returns {string} Guest card page URL
 * 
 * @example
 * getGuestCardURL('g_abc123')
 * // Returns: https://yourapp.com/guest/g_abc123
 */
export const getGuestCardURL = (uid) => {
  // Get current origin (works in both dev and production)
  const origin = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://ruangtamu.putuwistika.com';
  
  return `${origin}/guest/${uid}`;
};

// ============================================
// Routes
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  GUEST_CARD: '/guest/:uid',
  NOT_FOUND: '*',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SEARCH: '/admin/search',
  ADMIN_CREATE_GUEST: '/admin/create',
  ADMIN_ALL_GUESTS: '/admin/guests',
  ADMIN_QUEUE: '/admin/queue',
  
  // Runner Routes
  RUNNER_DASHBOARD: '/runner/dashboard',
  RUNNER_SEARCH: '/runner/search',
  RUNNER_QUEUE: '/runner/queue',
  RUNNER_MY_GUESTS: '/runner/completed',
};

export const ROUTE_LABELS = {
  [ROUTES.ADMIN_DASHBOARD]: 'Dashboard',
  [ROUTES.ADMIN_SEARCH]: 'Search Guest',
  [ROUTES.ADMIN_CREATE_GUEST]: 'Create Guest',
  [ROUTES.ADMIN_ALL_GUESTS]: 'All Guests',
  [ROUTES.ADMIN_QUEUE]: 'Queue',
  [ROUTES.RUNNER_DASHBOARD]: 'Dashboard',
  [ROUTES.RUNNER_SEARCH]: 'Search Guest',
  [ROUTES.RUNNER_QUEUE]: 'Queue',
  [ROUTES.RUNNER_MY_GUESTS]: 'My Guests',
};

// ============================================
// Animation Settings
// ============================================

export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  scaleIn: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
};

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
};

// ============================================
// Messages
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful! Welcome back.',
  LOGOUT: 'Logged out successfully.',
  GUEST_CREATED: 'Guest created successfully!',
  GUEST_CHECKED_IN: 'Guest checked in successfully!',
  GUEST_TAKEN: 'Guest taken to table successfully!',
  QR_DOWNLOADED: 'QR Code downloaded successfully!',
};

export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GUEST_NOT_FOUND: 'Guest not found.',
  ALREADY_CHECKED_IN: 'Guest already checked in.',
  INVALID_INPUT: 'Please fill in all required fields.',
  UNKNOWN_ERROR: 'An error occurred. Please try again.',
  QR_GENERATION_FAILED: 'Failed to generate QR code.',
};

// ============================================
// Validation
// ============================================

export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 3,
    MESSAGE: 'Password must be at least 3 characters',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    MESSAGE: 'Name must be between 2-100 characters',
  },
  PHONE: {
    PATTERN: /^(\+62|62|0)[0-9]{9,12}$/,
    MESSAGE: 'Please enter a valid Indonesian phone number',
  },
  UID: {
    PATTERN: /^[a-zA-Z0-9_-]+$/,
    MESSAGE: 'UID can only contain letters, numbers, dashes and underscores',
  },
};

// ============================================
// Lottie & Assets
// ============================================

export const LOTTIE_ANIMATIONS = {
  HERO: 'https://lottie.host/3794cb22-a094-4229-9a7d-8e7b70c56683/kL0wXsVqAN.lottie',
  SUCCESS: 'https://lottie.host/embed/success.json',
  LOADING: 'https://lottie.host/embed/loading.json',
};

// ============================================
// Misc
// ============================================

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

export const TABLE_CONFIG = {
  ITEMS_PER_PAGE: 10,
  ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
};

export const DATE_FORMATS = {
  FULL: 'PPpp',
  DATE_ONLY: 'PP',
  TIME_ONLY: 'p',
  SHORT: 'Pp',
  ISO: "yyyy-MM-dd'T'HH:mm:ss'Z'",
};

// ============================================
// Export All (DEFAULT)
// ============================================

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  APP_NAME,
  APP_TAGLINE,
  APP_VERSION,
  POLL_INTERVALS,
  GUEST_STATUS,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ICONS,
  USER_ROLES,
  ROLE_LABELS,
  PERMISSIONS,
  STORAGE_KEYS,
  INVITATION_TYPES,
  INVITATION_COLORS,
  GIFT_TYPES,
  QR_CODE_CONFIG,
  getQRCodeURL,
  getGuestCardURL,
  ROUTES,
  ROUTE_LABELS,
  ANIMATION_VARIANTS,
  ANIMATION_DURATION,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  VALIDATION,
  LOTTIE_ANIMATIONS,
  BREAKPOINTS,
  TABLE_CONFIG,
  DATE_FORMATS,
};