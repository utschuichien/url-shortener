'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { login, logout } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            try {
                const userData = JSON.parse(userStr);
                login(userData, token);
            } catch (e) {
                logout();
            }
        } else {
            logout();
        }
        setIsInitialized(true);
    }, [login, logout]);

    // Tránh hydration mismatch bằng cách không render children cho đến khi auth state được check
    if (!isInitialized) return null;

    return <>{children}</>;
}
