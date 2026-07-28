import { create } from 'zustand';
interface User {
    id: number;
    email: string;
    role: string;
}
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean; 
    login: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (status: boolean) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, 

    // Hàm xử lý đăng nhập thành công
    login: (userData, token) => {
        // Lưu token vào localStorage ở đây thay vì ở Component (giúp code sạch hơn)
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        set({ user: userData, isAuthenticated: true, isLoading: false });
    },
    logout: () => {
        // Xóa dữ liệu cũ
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
    },
    setLoading: (status) => set({ isLoading: status }),
}));
