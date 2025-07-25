# BOOOMERANGS AI Platform

Полнофункциональная AI-платформа для генерации изображений, интеллектуального чата и конвертации в форматы вышивки. Специализируется на создании дизайнов для вышивальных машин и текстильного производства.

## 🚀 Ключевые возможности

### 🤖 Мультимодальный AI чат
- **Множественные провайдеры**: Интеграция с 194 AI провайдерами через G4F
- **Умная маршрутизация**: Автоматический выбор оптимального провайдера
- **Потоковая генерация**: Real-time ответы с WebSocket поддержкой
- **История чатов**: Сохранение и управление сессиями разговоров

### 🎨 Генерация изображений
- **Бесплатная генерация**: Без необходимости API ключей
- **Множественные стили**: Realistic, artistic, anime, sketch
- **Редактирование**: Добавление/удаление объектов на изображениях
- **Высокое качество**: Изображения до 1024x1024 пикселей

### 🧵 Система конвертации в форматы вышивки
- **Поддерживаемые форматы**:
  - DST (Tajima) - универсальный формат
  - PES (Brother) - для машин Brother
  - JEF (Janome) - для машин Janome
  - EXP (Melco) - для машин Melco
  - VP3 (Husqvarna) - для машин Husqvarna Viking

- **Полный пайплайн**:
  - Генерация изображения по описанию
  - Автоматический анализ цветовой схемы
  - Оптимизация для вышивки
  - Создание файлов, готовых для вышивальных машин

- **Интеллектуальная обработка**:
  - Извлечение цветовой палитры (до 15 цветов)
  - Подготовка изображений для вышивки
  - Генерация инструкций по ниткам
  - Создание цветовых схем в JSON формате

## 💻 Технологии

### Frontend
- React + TypeScript
- Tailwind CSS + Shadcn/ui
- WebSocket для real-time коммуникации
- Responsive дизайн

### Backend
- Node.js + Express + TypeScript
- Python Flask для AI провайдеров
- Drizzle ORM + PostgreSQL
- WebSocket Server
- Sharp для обработки изображений

### AI & Machine Learning
- G4F (GPT4Free) - 194 провайдера
- Pollinations.ai для генерации изображений
- Умная маршрутизация запросов
- Анализ изображений для вышивки

## 🛠️ Установка и запуск

### Предварительные требования
- Node.js 18+ и npm
- Python 3.10+ и pip
- PostgreSQL база данных

### Быстрый старт

1. **Клонирование репозитория**:
```bash
git clone https://github.com/yourusername/booomerangs-ai.git
cd booomerangs-ai
```

2. **Установка зависимостей**:
```bash
npm install
pip install -r requirements.txt
```

3. **Настройка окружения**:
```bash
cp .env.example .env
# Настройте DATABASE_URL и другие переменные
```

4. **Запуск приложения**:
```bash
npm run dev
```

5. **Открыть в браузере**: `http://localhost:5000`

## 📚 Использование

### AI Чат
- Просто напишите сообщение в чат
- Система автоматически выберет оптимальный AI провайдер
- Поддержка загрузки изображений для анализа
- История чатов сохраняется автоматически

### Генерация изображений
Используйте команды в чате:
```
создай изображение кота в шляпе
нарисуй логотип для компании
сгенерируй пейзаж горы
```

### Создание дизайнов для вышивки
Специальные команды для вышивки:
```
создай логотип BOOOMERANGS для вышивки
сделай дизайн цветка для вышивки в формате DST
конвертируй это изображение в формат PES
```

Система автоматически:
- Создаст оптимизированное изображение
- Сгенерирует файл для вышивальной машины
- Подготовит цветовую схему с инструкциями
- Предоставит ссылки для скачивания всех файлов

## 🎯 Примеры использования

### Текстильное производство
- Создание логотипов для вышивки на одежде
- Дизайн патчей и нашивок
- Подготовка файлов для промышленных вышивальных машин

### Хобби и рукоделие
- Персональные дизайны для домашних вышивальных машин
- Конвертация фотографий в схемы для вышивки
- Создание уникальных узоров и орнаментов

## 📋 API Документация

### Чат API
```http
POST /api/smart/message
Content-Type: application/json

{
  "message": "создай логотип для вышивки",
  "imageUrl": "optional_image_url"
}
```

### Конвертация в формат вышивки
```http
POST /api/embroidery/convert
Content-Type: multipart/form-data

{
  "image": "image_file",
  "format": "dst|pes|jef|exp|vp3",
  "colors": 15
}
```

## 🔧 Конфигурация

### Переменные окружения
```env
DATABASE_URL=postgresql://user:password@host:port/database
HUGGINGFACE_API_KEY=optional_for_enhanced_features
REPLICATE_API_TOKEN=optional_for_advanced_image_processing
```

### Поддерживаемые форматы вышивки
| Формат | Расширение | Машины | Макс. цветов |
|--------|------------|---------|--------------|
| DST    | .dst       | Tajima, универсальный | 15 |
| PES    | .pes       | Brother | 64 |
| JEF    | .jef       | Janome | 32 |
| EXP    | .exp       | Melco | 100 |
| VP3    | .vp3       | Husqvarna Viking | 32 |

## 🤝 Контрибьюция

Мы приветствуем вклад в развитие проекта:

1. Форкните репозиторий
2. Создайте feature ветку (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Запушьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📝 Лицензия

Распространяется под лицензией MIT. См. `LICENSE` для подробностей.

## 🙏 Благодарности

- G4F проекту за предоставление доступа к AI моделям
- Pollinations.ai за бесплатную генерацию изображений
- Сообществу разработчиков за инструменты и библиотеки

## 📞 Поддержка

- Issues: [GitHub Issues](https://github.com/yourusername/booomerangs-ai/issues)
- Документация: [Wiki](https://github.com/yourusername/booomerangs-ai/wiki)
- Email: support@booomerangs.ai

---

**BOOOMERANGS AI** - Ваш универсальный инструмент для AI-генерации контента и текстильного производства 🚀