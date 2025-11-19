/**
 * Utility functions for user authentication and data management
 */

/**
 * Safely get user data from localStorage
 * @returns {Object|null} User object or null if not found/invalid
 */
export const getUserFromLocalStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    // Remove corrupted data
    localStorage.removeItem('user');
    return null;
  }
};

/**
 * Get userId from localStorage
 * @returns {number|string|null} userId or null if not found
 */
export const getUserId = () => {
  const user = getUserFromLocalStorage();
  return user?.id || null;
};

/**
 * Get access token from localStorage
 * @returns {string|null} Access token or null if not found
 */
export const getAccessToken = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token && token !== 'undefined' && token !== 'null' ? token : null;
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isUserLoggedIn = () => {
  const user = getUserFromLocalStorage();
  const token = getAccessToken();
  return !!(user?.id && token);
};

/**
 * Save user data to localStorage
 * @param {Object} user - User object to save
 */
export const saveUserToLocalStorage = (user) => {
  if (user && typeof user === 'object') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

/**
 * Clear user data from localStorage
 */
export const clearUserFromLocalStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};
