# Build stage
FROM oven/bun:1.2.2-alpine AS build

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

RUN npm run test

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
