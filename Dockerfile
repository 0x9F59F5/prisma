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

# envsubst를 위한 gettext 설치
RUN apk add --no-cache gettext

# Nginx 설정 템플릿 복사
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# 빌드된 파일을 Nginx로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 시작 스크립트 생성
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'export PORT=${PORT:-8080}' >> /start.sh && \
    echo 'envsubst "\$PORT" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# 포트 노출 (환경 변수로 설정 가능)
EXPOSE 8080

# 시작 스크립트 실행
CMD ["/start.sh"]
