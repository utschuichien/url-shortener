# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Bắt buộc cho Prisma engine trên Alpine
RUN apk add --no-cache openssl 

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# Runner stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Bắt buộc cho Prisma engine trên Alpine
RUN apk add --no-cache openssl 

# Copy package files để cài prod dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy prisma schema và generate lại client (rất quan trọng cho Prod)
COPY prisma ./prisma
RUN npx prisma generate

# Copy thư mục dist đã được build
COPY --from=builder /app/dist ./dist

# Đặt quyền
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3001

# Chạy Migration để tạo các bảng trong DB trước, sau đó mới khởi động Server NestJS
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
