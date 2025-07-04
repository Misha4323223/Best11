/**
 * Профилировщик пользователей для персонализации взаимодействий
 * Анализирует стиль общения, предпочтения и эмоциональные паттерны
 * ФАЗА 1: Эмоциональный интеллект и персонализация
 */

// Используем динамический импорт для ES модулей
let storage = null;

async function getStorage() {
  if (!storage) {
    const storageModule = await import('../storage.ts');
    storage = storageModule.storage;
  }
  return storage;
}

const SmartLogger = {
  profiler: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`👤📊 [${timestamp}] USER PROFILER: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Класс для профилирования пользователей и персонализации
 */
class UserProfiler {
  constructor() {
    this.initialized = false;
    this.initializeProfilingRules();
  }

  /**
   * Инициализация правил профилирования
   */
  initializeProfilingRules() {
    // Паттерны стилей общения
    this.communicationPatterns = {
      formal: {
        keywords: ['пожалуйста', 'благодарю', 'извините', 'будьте добры', 'не могли бы вы'],
        phrases: ['формально', 'официально', 'деловой стиль'],
        punctuation: ['!', '.', ','],
        weight: 1.0
      },
      
      friendly: {
        keywords: ['спасибо', 'привет', 'классно', 'круто', 'давай', 'можешь'],
        phrases: ['дружески', 'неформально', 'по-дружески'],
        punctuation: ['!', ')', ':)'],
        weight: 1.0
      },
      
      brief: {
        keywords: ['коротко', 'кратко', 'быстро', 'сжато'],
        phrases: ['без деталей', 'в двух словах', 'вкратце'],
        avgWordCount: { min: 1, max: 10 },
        weight: 0.8
      },
      
      detailed: {
        keywords: ['подробно', 'детально', 'расскажи', 'объясни', 'опиши'],
        phrases: ['во всех подробностях', 'с деталями', 'максимально подробно'],
        avgWordCount: { min: 20, max: 100 },
        weight: 0.9
      }
    };

    // Паттерны дизайн-предпочтений
    this.designPatterns = {
      minimalist: {
        keywords: ['минимализм', 'простой', 'чистый', 'лаконичный', 'без лишнего'],
        antiKeywords: ['сложный', 'детальный', 'много элементов'],
        weight: 1.2
      },
      
      vintage: {
        keywords: ['винтаж', 'ретро', 'старинный', 'классический', 'винтажный'],
        timeIndicators: ['50-е', '60-е', '70-е', '80-е', '90-е'],
        weight: 1.0
      },
      
      modern: {
        keywords: ['современный', 'модный', 'актуальный', 'трендовый', 'свежий'],
        timeIndicators: ['2020', '2024', 'текущий', 'новый'],
        weight: 1.0
      },
      
      artistic: {
        keywords: ['художественный', 'артистичный', 'творческий', 'авангард', 'экспрессивный'],
        techniques: ['акварель', 'масло', 'граффити', 'абстракция'],
        weight: 1.1
      }
    };

    // Эмоциональные паттерны
    this.emotionalPatterns = {
      enthusiastic: {
        keywords: ['отлично', 'супер', 'потрясающе', 'восхитительно', 'обожаю'],
        emojis: ['!', '!!!', '😊', '🎉', '✨'],
        capsWords: ['СУПЕР', 'ОТЛИЧНО', 'ВАУ'],
        weight: 1.3
      },
      
      calm: {
        keywords: ['спокойно', 'размеренно', 'без спешки', 'обдуманно'],
        phrases: ['не торопясь', 'взвешенно', 'продуманно'],
        punctuation: ['.', ','],
        weight: 0.8
      },
      
      professional: {
        keywords: ['профессионально', 'качественно', 'компетентно', 'экспертно'],
        phrases: ['на профессиональном уровне', 'бизнес-качество'],
        weight: 1.0
      },
      
      creative: {
        keywords: ['креативно', 'творчески', 'нестандартно', 'оригинально'],
        phrases: ['out of the box', 'творческий подход', 'креативное решение'],
        weight: 1.2
      }
    };
  }

  /**
   * Анализ стиля общения пользователя по сообщению
   */
  analyzeCommunicationStyle(userMessage) {
    const message = userMessage.toLowerCase();
    const wordCount = userMessage.split(' ').length;
    const scores = {};

    // Анализируем каждый стиль
    for (const [style, pattern] of Object.entries(this.communicationPatterns)) {
      let score = 0;
      
      // Проверяем ключевые слова
      if (pattern.keywords) {
        pattern.keywords.forEach(keyword => {
          if (message.includes(keyword)) {
            score += pattern.weight;
          }
        });
      }

      // Проверяем фразы
      if (pattern.phrases) {
        pattern.phrases.forEach(phrase => {
          if (message.includes(phrase)) {
            score += pattern.weight * 1.5;
          }
        });
      }

      // Проверяем пунктуацию
      if (pattern.punctuation) {
        pattern.punctuation.forEach(punct => {
          const count = (userMessage.match(new RegExp(`\\${punct}`, 'g')) || []).length;
          score += count * 0.3;
        });
      }

      // Проверяем длину сообщения
      if (pattern.avgWordCount) {
        if (wordCount >= pattern.avgWordCount.min && wordCount <= pattern.avgWordCount.max) {
          score += pattern.weight * 2;
        }
      }

      scores[style] = score;
    }

    // Находим доминирующий стиль
    const dominantStyle = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    SmartLogger.profiler(`Анализ стиля общения: ${dominantStyle}`, { scores, wordCount });

    return {
      dominantStyle,
      scores,
      confidence: scores[dominantStyle] > 1 ? Math.min(scores[dominantStyle] * 10, 100) : 20,
      wordCount
    };
  }

  /**
   * Анализ дизайн-предпочтений из запроса
   */
  analyzeDesignPreferences(userMessage) {
    const message = userMessage.toLowerCase();
    const preferences = {
      styles: {},
      complexity: 'medium',
      colors: [],
      techniques: []
    };

    // Анализируем стили
    for (const [style, pattern] of Object.entries(this.designPatterns)) {
      let score = 0;

      // Ключевые слова
      if (pattern.keywords) {
        pattern.keywords.forEach(keyword => {
          if (message.includes(keyword)) {
            score += pattern.weight;
          }
        });
      }

      // Анти-ключевые слова (снижают score)
      if (pattern.antiKeywords) {
        pattern.antiKeywords.forEach(antiKeyword => {
          if (message.includes(antiKeyword)) {
            score -= 0.5;
          }
        });
      }

      // Временные индикаторы
      if (pattern.timeIndicators) {
        pattern.timeIndicators.forEach(indicator => {
          if (message.includes(indicator)) {
            score += 0.8;
          }
        });
      }

      // Техники
      if (pattern.techniques) {
        pattern.techniques.forEach(technique => {
          if (message.includes(technique)) {
            score += 0.6;
            preferences.techniques.push(technique);
          }
        });
      }

      if (score > 0) {
        preferences.styles[style] = score;
      }
    }

    // Определяем сложность
    if (message.includes('простой') || message.includes('минимал')) {
      preferences.complexity = 'simple';
    } else if (message.includes('сложный') || message.includes('детальный')) {
      preferences.complexity = 'complex';
    }

    // Извлекаем цвета
    preferences.colors = this.extractColors(message);

    SmartLogger.profiler('Анализ дизайн-предпочтений', preferences);
    return preferences;
  }

  /**
   * Анализ эмоционального состояния
   */
  analyzeEmotionalState(userMessage, sessionHistory = []) {
    const message = userMessage.toLowerCase();
    const emotions = {};
    
    // Анализируем каждую эмоцию
    for (const [emotion, pattern] of Object.entries(this.emotionalPatterns)) {
      let score = 0;
      
      // Ключевые слова
      if (pattern.keywords) {
        pattern.keywords.forEach(keyword => {
          if (message.includes(keyword)) {
            score += pattern.weight;
          }
        });
      }

      // Фразы
      if (pattern.phrases) {
        pattern.phrases.forEach(phrase => {
          if (message.includes(phrase)) {
            score += pattern.weight * 1.5;
          }
        });
      }

      // Эмодзи и восклицания
      if (pattern.emojis) {
        pattern.emojis.forEach(emoji => {
          const count = (userMessage.match(new RegExp(`\\${emoji}`, 'g')) || []).length;
          score += count * 0.5;
        });
      }

      // Слова капсом
      if (pattern.capsWords) {
        pattern.capsWords.forEach(capsWord => {
          if (userMessage.includes(capsWord)) {
            score += 1.0;
          }
        });
      }

      emotions[emotion] = score;
    }

    // Анализируем контекст из истории
    const contextualEmotion = this.analyzeEmotionalContext(sessionHistory);
    
    const dominantEmotion = Object.keys(emotions).reduce((a, b) => 
      emotions[a] > emotions[b] ? a : b
    );

    const result = {
      currentEmotion: dominantEmotion,
      emotionScores: emotions,
      intensity: Math.min(emotions[dominantEmotion] * 2, 10),
      confidence: emotions[dominantEmotion] > 0.5 ? Math.min(emotions[dominantEmotion] * 15, 100) : 30,
      contextualShift: contextualEmotion
    };

    SmartLogger.profiler(`Эмоциональный анализ: ${dominantEmotion}`, {
      intensity: result.intensity,
      confidence: result.confidence
    });

    return result;
  }

  /**
   * Создание персонализированного профиля пользователя
   */
  async createPersonalizedProfile(userId, analysisData) {
    try {
      const db = await getStorage();
      const existingProfile = await db.getUserProfile(userId);
      
      const profileData = {
        userId: userId,
        communicationStyle: analysisData.communicationStyle?.dominantStyle || 'friendly',
        preferredLanguage: 'ru', // TODO: добавить определение языка
        responseLength: this.determinePreferredLength(analysisData.communicationStyle),
        favoriteColors: analysisData.designPreferences?.colors || [],
        preferredStyles: Object.keys(analysisData.designPreferences?.styles || {}),
        designComplexity: analysisData.designPreferences?.complexity || 'medium',
        emotionalTone: analysisData.emotionalState?.currentEmotion || 'neutral',
        feedbackStyle: this.determineFeedbackStyle(analysisData.emotionalState),
        learningProgress: JSON.stringify({}),
        successPatterns: JSON.stringify({}),
        totalInteractions: existingProfile ? existingProfile.totalInteractions + 1 : 1
      };

      let profile;
      if (existingProfile) {
        profile = await db.updateUserProfile(userId, profileData);
      } else {
        profile = await db.createUserProfile(profileData);
      }

      SmartLogger.profiler(`Персонализированный профиль ${existingProfile ? 'обновлен' : 'создан'}`, {
        userId,
        style: profileData.communicationStyle,
        emotion: profileData.emotionalTone
      });

      return profile;
    } catch (error) {
      SmartLogger.profiler(`Ошибка при создании профиля: ${error.message}`);
      return null;
    }
  }

  /**
   * Адаптация ответа под профиль пользователя
   */
  adaptResponseToProfile(baseResponse, userProfile, emotionalState) {
    if (!userProfile) return baseResponse;

    let adaptedResponse = baseResponse;

    // Адаптируем стиль общения
    adaptedResponse = this.adaptCommunicationStyle(adaptedResponse, userProfile.communicationStyle);
    
    // Адаптируем длину ответа
    adaptedResponse = this.adaptResponseLength(adaptedResponse, userProfile.responseLength);
    
    // Адаптируем эмоциональный тон
    adaptedResponse = this.adaptEmotionalTone(adaptedResponse, userProfile.emotionalTone, emotionalState);
    
    // Добавляем персональные элементы
    adaptedResponse = this.addPersonalElements(adaptedResponse, userProfile);

    SmartLogger.profiler('Ответ адаптирован под профиль пользователя', {
      style: userProfile.communicationStyle,
      length: userProfile.responseLength,
      tone: userProfile.emotionalTone
    });

    return adaptedResponse;
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

  extractColors(message) {
    const colorKeywords = {
      'красный': '#FF0000', 'синий': '#0000FF', 'зеленый': '#00FF00',
      'желтый': '#FFFF00', 'оранжевый': '#FFA500', 'фиолетовый': '#800080',
      'розовый': '#FFC0CB', 'коричневый': '#A52A2A', 'серый': '#808080',
      'черный': '#000000', 'белый': '#FFFFFF', 'золотой': '#FFD700',
      'серебряный': '#C0C0C0', 'бирюзовый': '#40E0D0', 'лимонный': '#FFFACD'
    };

    const foundColors = [];
    for (const [colorName, colorCode] of Object.entries(colorKeywords)) {
      if (message.includes(colorName)) {
        foundColors.push(colorName);
      }
    }
    return foundColors;
  }

  analyzeEmotionalContext(sessionHistory) {
    if (!sessionHistory || sessionHistory.length === 0) return null;
    
    // Анализируем последние 3 сообщения для выявления изменений настроения
    const recentMessages = sessionHistory.slice(-3);
    let emotionalTrajectory = 'stable';
    
    // Упрощенный анализ тренда (можно расширить)
    if (recentMessages.length >= 2) {
      const lastMessage = recentMessages[recentMessages.length - 1];
      const prevMessage = recentMessages[recentMessages.length - 2];
      
      if (this.containsPositiveWords(lastMessage) && this.containsNegativeWords(prevMessage)) {
        emotionalTrajectory = 'improving';
      } else if (this.containsNegativeWords(lastMessage) && this.containsPositiveWords(prevMessage)) {
        emotionalTrajectory = 'declining';
      }
    }
    
    return emotionalTrajectory;
  }

  containsPositiveWords(message) {
    const positiveWords = ['отлично', 'супер', 'классно', 'хорошо', 'замечательно', 'спасибо'];
    return positiveWords.some(word => message.toLowerCase().includes(word));
  }

  containsNegativeWords(message) {
    const negativeWords = ['плохо', 'ужасно', 'не нравится', 'разочарован', 'проблема'];
    return negativeWords.some(word => message.toLowerCase().includes(word));
  }

  determinePreferredLength(communicationStyle) {
    if (!communicationStyle) return 'medium';
    
    if (communicationStyle.scores?.brief > 1) return 'short';
    if (communicationStyle.scores?.detailed > 1) return 'detailed';
    return 'medium';
  }

  determineFeedbackStyle(emotionalState) {
    if (!emotionalState) return 'encouraging';
    
    if (emotionalState.currentEmotion === 'professional') return 'direct';
    if (emotionalState.currentEmotion === 'enthusiastic') return 'encouraging';
    if (emotionalState.currentEmotion === 'calm') return 'detailed';
    return 'encouraging';
  }

  adaptCommunicationStyle(response, style) {
    switch (style) {
      case 'formal':
        return response.replace(/давай/g, 'предлагаю').replace(/можешь/g, 'не могли бы вы');
      case 'brief':
        return response.split('.').slice(0, 2).join('.') + '.';
      case 'friendly':
        return response + ' 😊';
      default:
        return response;
    }
  }

  adaptResponseLength(response, preferredLength) {
    switch (preferredLength) {
      case 'short':
        return response.split('.').slice(0, 1).join('.') + '.';
      case 'detailed':
        return response; // базовый ответ уже детальный
      default:
        return response;
    }
  }

  adaptEmotionalTone(response, profileTone, currentEmotion) {
    if (currentEmotion?.currentEmotion === 'enthusiastic') {
      return response.replace(/\./g, '!');
    }
    
    if (profileTone === 'professional') {
      return response.replace(/!/g, '.');
    }
    
    return response;
  }

  addPersonalElements(response, userProfile) {
    // Добавляем элементы на основе предпочтений
    if (userProfile.preferredStyles?.includes('minimalist')) {
      response += '\n\nПо вашему стилю: чистые линии и минимализм будут идеальны.';
    }
    
    if (userProfile.favoriteColors?.length > 0) {
      const colors = userProfile.favoriteColors.slice(0, 2).join(' и ');
      response += `\n\nС учетом ваших предпочтений: ${colors} отлично подойдут.`;
    }
    
    return response;
  }
}

module.exports = new UserProfiler();