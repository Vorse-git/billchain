/**
 * @file axiosClient.js
 * @description This file configures and exports a centralized Axios instance.
 *              It's designed to automatically handle API base URLs and, most importantly,
 *              inject Firebase authentication tokens into outgoing requests and manage
 *              global authentication errors (like 401 Unauthorized).
 * @author Your Name/Team
 */
import axios from 'axios';
import { auth } from '../firebase/config'; // Import the Firebase auth instance.
import { signOut } from 'firebase/auth';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Define the base URL for the API. Using an environment variable is a best practice
// as it allows for different URLs in development, staging, and production environments.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

/**
 * @description A pre-configured Axios instance.
 *              Centralizing this ensures all API calls share the same base settings,
 *              making the application easier to maintain and update.
 */
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// ============================================================================
// GLOBAL LOGOUT HANDLER
// ============================================================================

/**
 * @description Handles global logout when authentication fails.
 *              This function can be customized based on your app's routing/state management.
 */
const handleGlobalLogout = async () => {
    try {
        // Sign out from Firebase
        await signOut(auth);
        console.log("User signed out due to authentication error");

        // Clear any local storage or session storage if needed
        localStorage.removeItem('user');
        sessionStorage.clear();

        // Redirect to login page
        // Option 1: Using window.location (works everywhere)
        window.location.href = '/login';

        // Option 2: If using React Router, you could dispatch a custom event
        // window.dispatchEvent(new CustomEvent('auth-logout'));

        // Option 3: If using a state management library, trigger logout action
        // store.dispatch(logoutAction());

    } catch (error) {
        console.error("Error during global logout:", error);
        // Force redirect even if Firebase signOut fails
        window.location.href = '/login';
    }
};

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * @description This interceptor runs *before* each request is sent from the application.
 *              Its primary purpose is to dynamically inject the user's Firebase
 *              authentication token into the request headers.
 */
axiosClient.interceptors.request.use(
    async (config) => {
        // Get the currently signed-in user from the Firebase SDK.
        const user = auth.currentUser;

        // Only add token if user is logged in.
        if (user) {
            try {
                // Get the user's ID token (JWT) with force refresh to ensure it's valid
                const token = await user.getIdToken(true);

                // Attach token using Bearer format.
                config.headers.Authorization = `Bearer ${token}`;
                console.log("Firebase ID token attached to request headers.");
            } catch (error) {
                console.error("Error getting Firebase ID token:", error);
                // If we can't get the token, the user might not be properly authenticated
                // Consider redirecting to login
                if (error.code === 'auth/user-token-expired' ||
                    error.code === 'auth/invalid-user-token') {
                    await handleGlobalLogout();
                }
            }
        }

        // Return modified config.
        return config;
    },
    (error) => {
        // Handle errors during request setup.
        console.error("Error in request interceptor:", error);
        return Promise.reject(error);
    }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

/**
 * @description This interceptor runs *after* a response is received from the server.
 *              It allows for global handling of responses and errors, which is ideal
 *              for managing authentication state.
 */
axiosClient.interceptors.response.use(
    (response) => {
        // Pass successful responses through.
        return response;
    },
    async (error) => {
        // Destructure status with fallback.
        const { status } = error.response || {};

        // Handle 401 Unauthorized globally
        if (status === 401) {
            console.error("401 Unauthorized: Token invalid or expired. Initiating global logout.");

            // Prevent multiple logout attempts
            if (!axiosClient._isLoggingOut) {
                axiosClient._isLoggingOut = true;

                try {
                    await handleGlobalLogout();
                } finally {
                    // Reset flag after a delay to allow for navigation
                    setTimeout(() => {
                        axiosClient._isLoggingOut = false;
                    }, 1000);
                }
            }
        }

        // Handle other common HTTP errors globally if needed
        if (status === 403) {
            console.error("403 Forbidden: Access denied");
            // You could show a global notification here
        }

        if (status === 500) {
            console.error("500 Internal Server Error: Server error occurred");
            // You could show a global error message here
        }

        // Network errors
        if (!error.response) {
            console.error("Network Error: Unable to connect to server");
            // You could show a connectivity error message here
        }

        // Re-throw error for local handling
        return Promise.reject(error);
    }
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * @description Helper function to manually refresh the authentication token
 *              Useful for long-running applications
 */
export const refreshAuthToken = async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            await user.getIdToken(true); // Force refresh
            console.log("Auth token refreshed successfully");
            return true;
        } catch (error) {
            console.error("Error refreshing auth token:", error);
            return false;
        }
    }
    return false;
};

/**
 * @description Helper function to check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!auth.currentUser;
};

export default axiosClient;