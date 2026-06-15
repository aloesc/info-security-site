# Info Security Site

Интерактивная платформа для обучения безопасности социальных сетей.

## Архитектура

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Express.js + TypeScript + better-sqlite3 + Zod + JWT
- **Инфраструктура**: Caddy (reverse proxy + авто-HTTPS) + Docker Compose

## Мини-игры

1. **Phishing Detective** — определяй фишинговые письма и сообщения
2. **Password Fortress** — симулятор силы пароля с визуальной обратной связью
3. **Session Defender** — закрывай подозрительные сессии на макете дашборда

## Быстрый старт

### Вариант 1. Docker Compose (рекомендуется)

```bash
# 1. Скопировать шаблон переменных окружения
cp env-example.txt .env

# 2. Сгенерировать сильный JWT_SECRET
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env

# 3. Указать домен
echo "DOMAIN=example.com" >> .env
# (или просто отредактируйте .env вручную)

# 4. Запустить
docker compose up -d --build

# 5. Открыть
open https://example.com
```

### Вариант 2. Локальная разработка

```bash
# Установка зависимостей
npm install

# Скопировать шаблон .env
cp env-example.txt .env
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env

# Запуск в dev-режиме (frontend + backend параллельно)
npm run dev

# Тесты
npm test

# Линтинг
npm run lint

# Форматирование
npm run format
```

После запуска:

- Главная: <https://example.com>
- API health: <https://example.com/api/health>
- Leaderboard: <https://example.com/leaderboard>

## Структура проекта

```
info-security-site/
├── backend/
│   ├── src/           # API код (Express маршруты, middleware, сервисы)
│   ├── tests/         # Unit и integration тесты (Jest)
│   ├── db/            # SQLite база данных и миграции
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/       # Next.js App Router страницы
│   │   ├── components/# React компоненты
│   │   ├── games/     # Логика мини-игр
│   │   ├── hooks/     # React-хуки
│   │   ├── lib/       # Утилиты и API-клиент
│   │   └── providers/ # React-контексты (Auth)
│   └── package.json
├── nginx/             # Nginx конфигурация
├── package.json       # Root workspaces
└── env-example.txt    # Шаблон переменных окружения
```

## Переменные окружения

Скопируй `env-example.txt` в `.env` и настройте:

| Переменная | Описание | Обязательно |
|------------|----------|-------------|
| `DATABASE_PATH` | Путь к SQLite файлу | да |
| `JWT_SECRET` | Секрет для подписи JWT (≥ 16 символов) | да |
| `PORT` | Порт backend (по умолчанию 4000) | нет |
| `NODE_ENV` | Окружение (`development` / `production` / `test`) | нет |
| `CORS_ORIGINS` | Список разрешённых Origin через запятую. **Обязательно в проде** — без неё CORS разрешает любой origin (`*`) | да (прод) |

### Генерация безопасного JWT_SECRET

```bash
openssl rand -hex 32
```

В проде обязательно задавайте `CORS_ORIGINS` (например, `https://yourdomain.com`).

## Тестирование

```bash
# Backend
JWT_SECRET=test-secret-test-secret-test-secret-32-chars npm run test --workspace=backend

# Frontend
npm run test --workspace=frontend

# Все сразу
JWT_SECRET=test-secret-test-secret-test-secret-32-chars npm test
```

## API

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| `GET` | `/api/health` | Проверка работоспособности | нет |
| `POST` | `/api/auth/register` | Регистрация пользователя | нет |
| `POST` | `/api/auth/login` | Вход и получение JWT | нет |
| `POST` | `/api/games/scores` | Сохранить результат игры | да |
| `GET` | `/api/games/scores?game_type=...` | Таблица лидеров | нет |
| `GET` | `/api/progress/current` | Прогресс текущего пользователя | да |
| `POST` | `/api/progress` | Сохранить прогресс | да |

## Стандарты кода

- Чистые функции (pure functions) для бизнес-логики
- Функции < 50 строк
- Явные зависимости (dependency injection)
- Не хардкодить секреты — только env vars
- Валидация входных данных через Zod
- Все защищённые эндпоинты — только через JWT, user_id берётся из токена, не из тела

## Безопасность

- Пароли хешируются bcrypt (12 раундов)
- JWT подписывается секретом из `.env` (минимум 16 символов)
- Helmet добавляет базовые HTTP-заголовки безопасности
- Все защищённые эндпоинты требуют валидный JWT
- В проде CORS ограничивается через `CORS_ORIGINS`
