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

# Копируем собранные файлы из build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 5195

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]