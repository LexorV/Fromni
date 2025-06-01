# Fromni - Система управления кампаниями

Полнофункциональное веб-приложение для создания и управления кампаниями с поддержкой множественных каналов связи.

## 🚀 Основные возможности

- **Управление кампаниями**: Создание, редактирование и удаление кампаний
- **Мультиканальность**: Поддержка ВКонтакте, Telegram, WhatsApp и SMS
- **Интерактивные элементы**: Кнопки, клавиатуры, быстрые ответы
- **Адаптивный дизайн**: Полная поддержка мобильных устройств (< 600px)
- **Система валидации**: Проверка всех обязательных полей с понятными уведомлениями
- **Чат-интерфейс**: Предварительный просмотр сообщений
- **Настройка отправителя**: Поддержка адресов отправителей для каждого канала

## 🛠 Технологический стек

### Frontend
- **Vue.js 3** - Прогрессивный JavaScript фреймворк
- **Quasar Framework** - Vue.js UI библиотека
- **TypeScript** - Типизированный JavaScript
- **Vite** - Сборщик модулей

### Backend  
- **NestJS** - Прогрессивный Node.js фреймворк
- **MongoDB** - NoSQL база данных
- **Mongoose** - ODM для MongoDB
- **TypeScript** - Типизированный JavaScript

## 📋 Требования

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 или **yarn** >= 1.22.0
- **MongoDB** >= 4.4.0

## 🚀 Установка и запуск

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd Fromni
```

### 2. Установка зависимостей

#### Бэкенд
```bash
cd backend
npm install
# или
yarn install
```

#### Фронтенд
```bash
cd frontend
npm install
# или
yarn install
```

### 3. Настройка окружения

#### Бэкенд
Создайте файл `.env` в папке `backend`:
```env
# База данных
MONGODB_URI=mongodb://localhost:27017/fromni
DATABASE_NAME=fromni

# Сервер
PORT=3000
NODE_ENV=development



### 4. Запуск приложения

#### Запуск MongoDB
```bash
# Если MongoDB установлен локально
mongod

# Или через Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Запуск бэкенда
```bash
cd backend

# Режим разработки
npm run start:dev
# или
yarn start:dev

# Продакшн
npm run build
npm run start:prod
```

#### Запуск фронтенда
```bash
cd frontend

# Режим разработки
npm run dev
# или
yarn dev

# Сборка для продакшн
npm run build
```

### 5. Доступ к приложению

- **Фронтенд**: http://localhost:9000
- **Бэкенд API**: http://localhost:3000/api

## 📁 Структура проекта

```
Fromni/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/        # Модули приложения
│   │   ├── schemas/        # MongoDB схемы
│   │   └── main.ts        # Точка входа
│   ├── package.json
│   └── ...
├── frontend/               # Vue.js + Quasar
│   ├── src/
│   │   ├── components/    # Vue компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── types/         # TypeScript типы
│   │   └── App.vue
│   ├── package.json
│   └── ...
└── README.md
```

## 🎨 Основные компоненты

### Фронтенд
- **CampaignForm** - Форма создания/редактирования кампании
- **ChannelMessageForm** - Настройка сообщений для каналов  
- **ButtonForm** - Управление кнопками и клавиатурами
- **CampaignChatDialog** - Предварительный просмотр чата
- **MainLayout** - Основной макет с навигацией

### Бэкенд
- **Campaign Module** - Управление кампаниями
- **Campaign Schema** - MongoDB схема кампаний
- **DTO** - Объекты передачи данных
- **Validation** - Валидация входных данных

## 📱 Адаптивность

Приложение полностью адаптивно и включает:
- **Мобильная версия** (< 600px): Вкладки, компактные элементы
- **Десктопная версия** (≥ 600px): Аккордеоны, расширенный интерфейс

## 🐳 Docker

### Запуск через Docker Compose
```bash
# В корне проекта
docker-compose up -d
```

### Отдельные контейнеры
```bash
# Бэкенд
cd backend
docker build -t fromni-backend .
docker run -p 3000:3000 fromni-backend

# Фронтенд  
cd frontend
docker build -t fromni-frontend .
docker run -p 80:80 fromni-frontend
```

### Проблемы с портами
```bash
# Проверить занятые порты
netstat -tulpn | grep :3000
netstat -tulpn | grep :9000

# Остановить процессы
kill -9 <PID>
```

### Проблемы с MongoDB
```bash
# Проверить статус MongoDB
sudo systemctl status mongod

# Перезапустить MongoDB
sudo systemctl restart mongod
```

### Очистка кеша
```bash
# Фронтенд
cd frontend
rm -rf node_modules .quasar dist
npm install

# Бэкенд
cd backend  
rm -rf node_modules dist
npm install
```
## **Интеграция сервисов отправки сообщений**  
На данный момент встроенная отправка сообщений не поддерживается, но её можно реализовать с помощью сторонних API.  

### **Доступные варианты:**  

#### **1. Telegram**  
- **Ссылка:** [Bot API](https://core.telegram.org/bots/api)  
- **Как использовать:**  
  - Создать бота через `@BotFather`.  
  - Отправлять сообщения методом `sendMessage`.  

#### **2. WhatsApp**  
- **Сервис:** [Green API](https://green-api.com/)  
- **Особенности:**  
  - Бесплатный тестовый тариф.  
  - Поддержка текста, файлов и интерактивных элементов.  

#### **3. SMS-рассылки**  
- **Сервис:** [SMS Aero](https://smsaero.ru/integration/api/)  
- **Примечание:**  
  - API для массовых рассылок.  
  - Личный опыт отсутствует.  

#### **4. ВКонтакте (VK)**  
- **API:** [VK Messages API](https://dev.vk.com/api/messages)  
- **Возможности:**  
  - Отправка сообщений от имени группы.  
  - Требует Callback API для обработки ответов.  
