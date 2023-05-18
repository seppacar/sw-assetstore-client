import axios from 'axios'

// Retrieve the base URL from the environment variables
const BASE_URL = process.env.REACT_APP_API_URL

// Create an axios instance with the base URL
const apiService = axios.create({
    baseURL: BASE_URL
});
const apiUploadService = axios.create({
    baseURL: BASE_URL
});

// Intercept the request and add the authentication token to the headers
apiService.interceptors.request.use((config) => {
    // Retrieve the authentication token from wherever you store it
    const token = localStorage.getItem('token');

    config.headers['Content-Type'] = 'application/json'
    // Add the token to the request headers
    config.headers.Authorization = `Bearer ${token}`;

    return config;
});

// Intercept the request and add the authentication token to the headers
apiUploadService.interceptors.request.use((config) => {
    // Retrieve the authentication token from wherever you store it
    const token = localStorage.getItem('token');

    config.headers['Content-Type'] = 'multipart/form-data'
    // Add the token to the request headers
    config.headers.Authorization = `Bearer ${token}`;

    return config;
});

/*
*
* Authentication
*
*/

/**
 * Logout the user by adding the JWT to the blacklist.
 */
export const authLogout = () => {
    console.log("get");
    return apiService.get(`auth/logout`);
};
/**
 * Authenticate the user by logging in with the provided credentials.
 * @param {object} loginCredentials - The user's login credentials.
 *     Format: { "email": "user@example.com", "password": "password123" }
 * @returns {Promise} - A promise that resolves to the login response.
 */
export const authLogin = (loginCredentials) => {
    return apiService.post(`auth/login`, loginCredentials);
}
/**
 * Register the user with the provided signup details.
 * @param {object} signupDetails - The user's signup details.
 *     Format: { "email": "user@example.com", "password": "password123", "firstName": "John", "lastName": "Doe" }
 * @returns {Promise} - A promise that resolves to the signup response.
 */
export const authSignup = (signupDetails) => {
    return apiService.post(`users`, signupDetails);
};

/*
*
* Assets
*
*/

// Fetches all assets
export const fetchAssets = () => {
    return apiService.get(`assets`)
}

export const fetchAssetPresentation = (assetId) => {
    return apiService.get(`assets/presentation/${assetId}`)
}

// Gets users owned assets, need to provide a token
export const getOwnedAssets = (userId) => {
    return apiService.get(`assets/ownedBy/${userId}`)
}

// TODO Change naming: 'upload -> create' everywehere
export const uploadAsset = (assetData) => {
    return apiUploadService.post('assets/upload', assetData)
}

/*
*
* Orders
*
*/

// Create order
export const createOrder = (orderData) => {
    return apiService.post('orders', orderData)
}

export default apiService;
