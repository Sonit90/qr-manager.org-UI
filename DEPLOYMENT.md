# Frontend Deployment Guide

## Настройка сервера

### 1. Создание директории для деплоя
```bash
sudo mkdir -p /opt/front
sudo chown $USER:$USER /opt/front
```

### 2. Создание .env файла
Создайте файл `/opt/front/.env` со следующим содержимым:
```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:8000
VITE_FRONTEND_PORT=5195

# Docker Compose Project Name
COMPOSE_PROJECT_NAME=frontend-production
```

### 3. Настройка GitHub Actions
Убедитесь, что у вас настроен self-hosted runner на сервере и он может:
- Выполнять Docker команды
- Доступ к директории `/opt/front`
- Выполнять rsync команды

## Структура деплоя

После деплоя структура будет следующей:
```
/opt/front/
├── current/           # Текущая версия приложения
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── .env
│   └── ... (файлы проекта)
├── releases/          # Архив релизов
│   ├── release_20241201_143022/
│   ├── backup_20241201_143022/
│   └── ...
└── .env              # Основной .env файл
```

## Автоматический деплой

При пуше в ветку `master` автоматически:
1. Создается backup текущей версии
2. Копируется новый код в `/opt/front/releases/release_TIMESTAMP/`
3. Останавливаются текущие сервисы
4. Запускается новая версия
5. Выполняется health check на порту 5195
6. Очищаются старые релизы (оставляется последние 5)

## Ручное управление

### Просмотр статуса
```bash
cd /opt/front/current
docker compose -f docker-compose.yml --project-name frontend-production ps
```

### Просмотр логов
```bash
cd /opt/front/current
docker compose -f docker-compose.yml --project-name frontend-production logs -f
```

### Остановка сервисов
```bash
cd /opt/front/current
docker compose -f docker-compose.yml --project-name frontend-production down
```

### Запуск сервисов
```bash
cd /opt/front/current
docker compose -f docker-compose.yml --project-name frontend-production up -d
```

### Откат к предыдущей версии
```bash
# 1. Остановить текущие сервисы
cd /opt/front/current
docker compose -f docker-compose.yml --project-name frontend-production down

# 2. Восстановить из backup
rsync -av /opt/front/releases/backup_YYYYMMDD_HHMMSS/ /opt/front/current/

# 3. Запустить сервисы
cd /opt/front/current
docker compose -f docker-compose.yml --project-name frontend-production up -d
```

## Мониторинг

### Health Check
Приложение доступно по адресу: `http://localhost:5195`

### Проверка статуса
```bash
curl -f http://localhost:5195/
```

## Troubleshooting

### Проблемы с правами доступа
```bash
sudo chown -R $USER:$USER /opt/front
```

### Проблемы с Docker
```bash
# Проверить статус Docker
sudo systemctl status docker

# Перезапустить Docker
sudo systemctl restart docker
```

### Проблемы с портами
```bash
# Проверить занятые порты
netstat -tulpn | grep 5195

# Убить процесс на порту (если нужно)
sudo kill -9 <PID>
``` 