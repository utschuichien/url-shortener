# LinkFlow - URL Shortener Platform

LinkFlow là một hệ thống rút gọn đường dẫn (URL Shortener) hiện đại, tích hợp phân tích dữ liệu và quản lý người dùng, được thiết kế theo phong cách giao diện Neobrutalism.

## 🚀 Công nghệ sử dụng (Tech Stack)

### Frontend (`url-shortener-frontend/`)
- **Framework:** Next.js 14+ (App Router)
- **State Management:** Zustand, React Query
- **UI/Styling:** Tailwind CSS, Lucide React
- **Thiết kế:** Neobrutalism

### Backend (`url-shortener-backend/`)
- **Framework:** NestJS
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Caching:** Redis (`cache-manager-redis-yet`)
- **Security:** JWT Authentication, Rate Limiting (Throttler)

## 📁 Cấu trúc Monorepo
Dự án được chia làm 2 phần độc lập nhưng được quản lý chung trong cùng 1 repository:
- `url-shortener-backend`: API Server và kết nối Database.
- `url-shortener-frontend`: Giao diện người dùng Web.

## ⚙️ Hướng dẫn cài đặt và chạy thử (Local Development)

### 1. Chạy Backend
Mở terminal, di chuyển vào thư mục backend:
```bash
cd url-shortener-backend
npm install
```
Tạo file `.env` và cung cấp thông tin kết nối DB/Redis (Xem `.env.example`). Sau đó chạy:
```bash
npx prisma generate
npx prisma db push
npm run start:dev
```
Backend sẽ chạy ở `http://localhost:3001`

### 2. Chạy Frontend
Mở một terminal khác, di chuyển vào thư mục frontend:
```bash
cd url-shortener-frontend
npm install
npm run dev
```
Frontend sẽ chạy ở `http://localhost:3000`

---
*Dự án được xây dựng với mục đích học tập và tối ưu hiệu năng hệ thống (Load Testing đạt hàng trăm RPS).*
