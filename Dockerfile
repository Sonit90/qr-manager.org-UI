# Build stage
FROM oven/bun:1.2.2-alpine AS build

# Устанавливаем Node.js и npm
RUN apk add --no-cache nodejs npm

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json bun.lock ./

# Устанавливаем зависимости через bun
RUN bun install --frozen-lockfile

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production stage
FROM nginx:alpine

# Создаем пользователя nginx с UID 1000 (соответствует GitHub Actions runner)
RUN addgroup -g 1000 nginx && \
    adduser -D -s /bin/sh -u 1000 -G nginx nginx

# Копируем собранные файлы из build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Устанавливаем правильные права доступа
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod -R 777 /usr/share/nginx/html

# Открываем порт
EXPOSE 5195

# Переключаемся на пользователя nginx
USER nginx

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]