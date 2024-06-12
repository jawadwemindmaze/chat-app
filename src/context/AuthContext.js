import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const storedAuth = JSON.parse(localStorage.getItem('isAuthenticated'));
        if (storedAuth) {
            setIsAuthenticated(storedAuth);
        }
        setIsAuthChecked(true);
    }, []);

    useEffect(() => {
        if (isAuthChecked) {
            localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
        }
    }, [isAuthenticated, isAuthChecked]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAuthChecked }}>
            {children}
        </AuthContext.Provider>
    );
};
