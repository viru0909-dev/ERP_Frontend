import React, { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('erp-auth-token'));

    const login = (newToken) => {
        localStorage.setItem('erp-auth-token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('erp-auth-token');
        setToken(null);
    };

    const contextValue = useMemo(() => ({ token, login, logout }), [token]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};