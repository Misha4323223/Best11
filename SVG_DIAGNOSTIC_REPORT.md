# ДИАГНОСТИЧЕСКИЙ ОТЧЕТ: Проблема серого отображения SVG

## АНАЛИЗ ПРОБЛЕМЫ

### Симптомы
- SVG файлы отображаются только как серый viewBox
- Содержимое не видно, хотя файлы содержат корректные цвета
- Размеры файлов нормальные (~4-7KB)

### КРИТИЧЕСКАЯ ОШИБКА #1: Координаты вне viewBox
```
SVG viewBox: 1280x1280 пикселей
Реальные координаты контента: 28-858 по X, 28-380 по Y
```

**Координаты из файла vectorized_21b700cf691bacec.svg:**
- M 629.206 28.106
- M 806.825 57.551  
- M 858.347 131.351

### КРИТИЧЕСКАЯ ОШИБКА #2: Отсутствие transform
В файле НЕТ transform атрибутов для центрирования и масштабирования.
Ожидалось: `transform="translate(X, Y) scale(S)"`
Реально: отсутствует

### КРИТИЧЕСКАЯ ОШИБКА #3: Несоответствие кода
Код в advanced-vectorizer.cjs НЕ ПРИМЕНЯЕТСЯ к создаваемым файлам.
Функция combineColorLayers() создает 2400x2400, но файлы создаются 1280x1280.

## ИСТОЧНИК ПРОБЛЕМЫ

### Неправильная архитектура
1. **Потеря контроля над SVG генерацией** - Potrace создает координаты без учета целевого viewBox
2. **Отсутствие нормализации координат** - Контент позиционируется в исходных координатах изображения
3. **Неработающий transform** - Код центрирования не применяется к финальному SVG

### Технические детали
```javascript
// ПРОБЛЕМА: Potrace генерирует координаты в пределах исходного изображения
// Но viewBox устанавливается произвольно (1280x1280 или 2400x2400)
// Без пересчета координат контент выходит за границы

// ОЖИДАЕТСЯ:
<g transform="translate(offsetX, offsetY) scale(scale)">
  <path d="M 100 100 ..." />
</g>

// РЕАЛЬНО:
<g fill="#color" stroke="none">
  <path d="M 629 28 ..." />  // Координаты вне viewBox!
</g>
```

## РЕШЕНИЕ

### Немедленные исправления:
1. **Форсировать пересчет координат** перед записью в SVG
2. **Применить правильный transform** к каждому слою
3. **Нормализовать viewBox** под фактические границы контента

### Код исправления:
```javascript
// Пересчитать все координаты в диапазон 0-targetSize
const normalizedPath = normalizeSVGPath(path, minX, minY, scale, offsetX, offsetY);

// Применить transform на уровне группы
<g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
```

## КРИТИЧНОСТЬ: ВЫСОКАЯ
Проблема блокирует основную функциональность векторизатора.
Без исправления все SVG файлы остаются неотображаемыми.

## ВРЕМЯ ИСПРАВЛЕНИЯ: 15-20 минут