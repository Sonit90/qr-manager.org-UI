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

# Принимаем переменные окружения как аргументы сборки
ARG VITE_FRONTEND_PORT
ARG VITE_API_URL

# Устанавливаем переменные окружения для сборки
ENV VITE_FRONTEND_PORT=$VITE_FRONTEND_PORT
ENV VITE_API_URL=$VITE_API_URL

# Собираем приложение
RUN bun run build

# Запускаем тесты
RUN npm run test

# Production stage
FROM nginx:alpine

# Устанавливаем shadow для управления пользователями и изменяем nginx на UID 1000
RUN apk add --no-cache shadow && \
    usermod -u 1000 nginx && \
    groupmod -g 1000 nginx

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