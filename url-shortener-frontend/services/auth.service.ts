import apiClient from './apiClient';
// Bạn có thể import các Type/Interface từ src/types/ nếu đã định nghĩa
// import { LoginPayload, LoginResponse } from '@/types/auth';

export const authService = {
    login: async (email: string, password: string) => {
        return await apiClient.post('/api/auth/login', { email, password });
    },

    register: async (email: string, password: string) => {
        return await apiClient.post('/api/auth/register', { email, password });
    },
};
