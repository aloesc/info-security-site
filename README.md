# Info Security Site

Интерактивная платформа для обучения безопасности социальных сетей.

## Архитектура

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Express.js + TypeScript + better-sqlite3 + Zod
- **Инфраструктура**: Nginx (reverse proxy) + Docker

## Мини-игры

1. **Phishing Detective** — определяй фишинговые письма и сообщения
2. **Password Fortress** — симулятор силы пароля с визуальной обратной связью
3. **Session Defender** — закрывай подозрительные сессии на макете дашборда

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в dev-режиме (frontend + backend параллельно)
npm run dev

# Линтинг
npm run lint

# Форматирование
npm run format
```

## Структура проекта

```
info-security-site/
├── backend/
│   ├── src/           # API код (Express маршруты, middleware, сервисы)
│   ├── tests/         # Unit и integration тесты
│   ├── db/            # SQLite база данных и миграции
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/       # Next.js App Router страницы
│   │   ├── components/# React компоненты
│   │   ├── lib/       # Утилиты и хелперы
│   │   └── games/     # Логика мини-игр
│   └── package.json
├── nginx/             # Nginx конфигурация
├── package.json       # Root workspaces
└── .env.example       # Шаблон переменных окружения
```

## Переменные окружения

Скопируй `.env.example` в `.env` и настройте:

| Переменная | Описание |
|------------|----------|
| `DATABASE_PATH` | Путь к SQLite файлу |
| `SESSION_SECRET` | Секрет для сессий |
| `PORT` | Порт backend сервера |
| `NODE_ENV` | Окружение (development / production) |

## Стандарты кода

- Чистые функции (pure functions) для бизнес-логики
- Функции < 50 строк
- Явные зависимости (dependency injection)
- Не хардкодить секреты — только env vars
- Валидация входных данных через Zod
