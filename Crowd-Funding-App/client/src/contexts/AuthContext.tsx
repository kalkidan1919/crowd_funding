import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';

/**
 * User interface represents the authenticated user.
 */
interface User {
    user_id: number;
    email: string;
    full_name: string;
    roles: string[];
    created_at: string;
    updated_at: string;
}

/**
 * AuthContextType defines the context structure for authentication.
 */
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (fullName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user: userData, token: authToken } = response.data;

            setUser(userData);
            setToken(authToken);
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (fullName: string, email: string, password: string) => {
        try {
            const response = await api.post('/auth/register', {
                full_name: fullName,
                email,
                password,
            });
            const { user: userData, token: authToken } = response.data;

            setUser(userData);
            setToken(authToken);
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        // Call logout endpoint (optional, fire and forget)
        api.post('/auth/logout').catch(() => { });
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ End of AuthProvider file
