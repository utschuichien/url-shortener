import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { urlsService } from '@/services/urls.service';
import { toast } from 'sonner';

export interface Url {
    id: number;
    shortCode: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
}

export interface PaginatedUrls {
    data: Url[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export interface UrlStats {
    shortCode: string;
    originalUrl: string;
    totalClicks: number;
    clicksByDate: { date: string; count: number }[];
    topBrowsers: { browser: string; clicks: number }[];
}

export function useUrls(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ['urls', page, limit],
        queryFn: async () => {
            const res = await urlsService.getMyUrls(page, limit);
            return res as unknown as PaginatedUrls;
        },
    });
}

export function useCreateUrl() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ originalUrl, customAlias }: { originalUrl: string; customAlias?: string }) => {
            const res = await urlsService.createShortUrl(originalUrl, customAlias);
            return res.data as Url;
        },
        onSuccess: async () => {
            toast.success('Rút gọn URL thành công!');
            await queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message;
            const errorMessage = Array.isArray(msg) ? msg[0] : msg;
            toast.error(errorMessage || 'Có lỗi xảy ra khi rút gọn URL');
        },
    });
}

export function useUrlStats(shortCode: string) {
    return useQuery({
        queryKey: ['urls', shortCode, 'stats'],
        queryFn: async () => {
            const res = await urlsService.getStats(shortCode);
            return res.data as UrlStats;
        },
        enabled: !!shortCode,
    });
}

export function useDeleteUrl() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await urlsService.deleteUrl(id);
            return res;
        },
        onSuccess: async () => {
            toast.success('Xóa URL thành công!');
            await queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa URL');
        },
    });
}

export function useUpdateUrl() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, originalUrl }: { id: number; originalUrl: string }) => {
            const res = await urlsService.updateUrl(id, originalUrl);
            return res.data;
        },
        onSuccess: async () => {
            toast.success('Cập nhật URL thành công!');
            await queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message;
            const errorMessage = Array.isArray(msg) ? msg[0] : msg;
            toast.error(errorMessage || 'Có lỗi xảy ra khi cập nhật URL');
        },
    });
}
