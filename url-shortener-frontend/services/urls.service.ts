import apiClient from './apiClient';

export const urlsService = {
    createShortUrl: async (originalUrl: string, customAlias?: string) => {
        return await apiClient.post('/api/urls', { originalUrl, customAlias });
    },
    getMyUrls: async (page: number = 1, limit: number = 10) => {
        return await apiClient.get(`/api/urls?page=${page}&limit=${limit}`);
    },
    getStats: async (shortCode: string) => {
        return await apiClient.get(`/api/urls/${shortCode}/stats`);
    },
    deleteUrl: async (id: number) => {
        return await apiClient.delete(`/api/urls/${id}`);
    },
    updateUrl: async (id: number, originalUrl: string) => {
        return await apiClient.put(`/api/urls/${id}`, { originalUrl });
    }
};
