import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

// Create a new context object
export const AuthContext = createContext();

// Create a component that will hold the state and logic for authentication
export const AuthProvider = ({ children }) => {
    // Declare state variables
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            // Check if a token exists in localStorage
            const token = localStorage.getItem('token');

            // If token exists, check if it expired if not decode it and set the user
            if (token) {
                const decoded = jwt_decode(token);
                const currentTime = Date.now();
                const expirationTime = new Date(0);
                expirationTime.setUTCSeconds(decoded.exp);
                const isTokenExpired = currentTime > expirationTime;

                if (!isTokenExpired) {
                    setUser(decoded);
                } else {
                    setUser(null)
                    localStorage.removeItem('token');
                }
            }
        }
        catch (error){
            console.log('Error loading user from localStorage:', error);
        }
        finally {
            setLoading(false); // Set loading to false when user loading is complete
        }
    }, []);

    // Function to handle login
    const login = (token) => {
        // Decode the token and set the user
        const decoded = jwt_decode(token);
        setUser(decoded);

        // Store the token in localStorage
        localStorage.setItem('token', token);
    };

    // Function to handle logout
    const logout = () => {
        // Remove the token from localStorage and reset the user
        localStorage.removeItem('token');
        setUser(null);
    };

    // Function to check if the user has the admin role
    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    // Provide the user, login, and logout values to the child components
    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};