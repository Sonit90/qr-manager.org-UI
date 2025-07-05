# Используем Node.js образ с bun
FROM oven/bun:1.2.2-alpine

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

# Открываем порт
EXPOSE 5195

# Запускаем приложение через npm
CMD ["npm", "run", "dev"]