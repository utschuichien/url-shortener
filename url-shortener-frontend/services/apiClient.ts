import axios from 'axios';

const apiClient = axios.create({
    // Đổi thành rỗng (relative path) để Next.js tự động nối thêm origin hiện tại (localhost hoặc linknip.click)
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // Kiểm tra xem code đang chạy trên trình duyệt (Client-side) hay Server (Next.js SSR)
        // Vì localStorage chỉ tồn tại trên trình duyệt.
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');

            // Nếu có token, tự động đính vào Header Authorization chuẩn Bearer
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        // Xử lý lỗi trước khi request rời khỏi máy client (hiếm gặp)
        return Promise.reject(error);
    },
);

// 3. RESPONSE INTERCEPTOR: Chặn response từ Server trả về trước khi đưa cho Component
apiClient.interceptors.response.use(
    (response) => {
        // Nếu gọi API thành công (Status 2xx), trả về luôn dữ liệu (.data) để Component đỡ phải gõ response.data.data
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung ở đây

        // Bắt lỗi 401 Unauthorized (Chưa đăng nhập, hoặc token hết hạn)
        if (error.response && error.response.status === 401) {
            console.error('Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');

            if (typeof window !== 'undefined') {
                // Xóa token cũ đi
                localStorage.removeItem('accessToken');
                // Đá người dùng văng ra màn hình đăng nhập (tuỳ chọn)
                // window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
