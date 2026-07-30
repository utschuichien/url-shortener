import http from 'k6/http';
import { check } from 'k6';

// Cấu hình bài test tương tự như Autocannon: 100 kết nối đồng thời trong 10 giây
export const options = {
  vus: 100, // Số người dùng ảo (Virtual Users)
  duration: '10s',
};

export default function () {
  // Cấu hình không tự động chạy theo link redirect (maxRedirects: 0)
  // để chỉ đo tốc độ phản hồi của Server nhà mình, không đo server đích (DeepSeek)
  const params = {
    redirects: 0, 
  };

  // Chạy trực tiếp trên Windows nên dùng lại localhost bình thường
  const res = http.get('http://localhost:3001/s', params);

  // Kiểm tra xem server có trả về mã 302 Found thành công không
  check(res, {
    'is status 302': (r) => r.status === 302,
  });
}
