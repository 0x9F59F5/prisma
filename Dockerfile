# ===================================
# Stage 1: Build
# ===================================
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 설치를 위한 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production=false

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# ===================================
# Stage 2: Production
# ===================================
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일을 Nginx로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 8080

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
