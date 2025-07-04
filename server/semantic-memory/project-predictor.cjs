/**
 * Предсказатель следующих шагов проекта
 * Анализирует текущее состояние проекта и предсказывает вероятные действия пользователя
 */

const SmartLogger = {
  predictor: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🔮 [${timestamp}] PREDICTOR: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Класс для предсказания следующих действий
 */
class ProjectPredictor {
  constructor() {
    this.initializePredictionRules();
  }

  initializePredictionRules() {
    // Правила предсказания на основе типа проекта и текущих артефактов
    this.predictionRules = {
      logo: {
        after_image_creation: [
          {
            action: 'vectorize',
            description: 'Векторизовать логотип для масштабирования',
            probability: 0.85,
            keywords: ['svg', 'вектор', 'масштаб', 'печать'],
            benefits: 'Позволит использовать логотип в любом размере без потери качества'
          },
          {
            action: 'create_monochrome_version',
            description: 'Создать монохромную версию логотипа',
            probability: 0.70,
            keywords: ['черно-белый', 'одноцветный', 'монохром'],
            benefits: 'Необходимо для факсов, штампов и экономичной печати'
          },
          {
            action: 'color_variations',
            description: 'Создать цветовые вариации логотипа',
            probability: 0.65,
            keywords: ['цвета', 'варианты', 'палитра'],
            benefits: 'Даст больше возможностей для применения в разных контекстах'
          }
        ],
        after_vectorization: [
          {
            action: 'business_card_design',
            description: 'Создать дизайн визитки с логотипом',
            probability: 0.75,
            keywords: ['визитка', 'контакты', 'карточка'],
            benefits: 'Продолжит развитие фирменного стиля'
          },
          {
            action: 'letterhead_design',
            description: 'Создать фирменный бланк',
            probability: 0.60,
            keywords: ['бланк', 'документы', 'официальный'],
            benefits: 'Придаст документам профессиональный вид'
          }
        ]
      },

      print: {
        after_image_creation: [
          {
            action: 'optimize_for_fabric',
            description: 'Оптимизировать для печати на ткани',
            probability: 0.80,
            keywords: ['ткань', 'футболка', 'текстиль'],
            benefits: 'Улучшит качество печати и стойкость к стирке'
          },
          {
            action: 'size_variations',
            description: 'Создать версии для разных размеров',
            probability: 0.75,
            keywords: ['размеры', 'S M L XL', 'масштаб'],
            benefits: 'Позволит печатать на одежде всех размеров'
          },
          {
            action: 'color_adjustment',
            description: 'Настроить цвета для CMYK печати',
            probability: 0.70,
            keywords: ['печать', 'CMYK', 'цветокоррекция'],
            benefits: 'Обеспечит точную передачу цветов при печати'
          }
        ],
        after_optimization: [
          {
            action: 'mockup_creation',
            description: 'Создать мокап на футболке',
            probability: 0.85,
            keywords: ['мокап', 'примерка', 'визуализация'],
            benefits: 'Покажет, как будет выглядеть готовое изделие'
          }
        ]
      },

      character: {
        after_image_creation: [
          {
            action: 'emotion_variations',
            description: 'Создать версии с разными эмоциями',
            probability: 0.80,
            keywords: ['эмоции', 'выражения', 'настроение'],
            benefits: 'Даст больше возможностей для использования персонажа'
          },
          {
            action: 'pose_variations',
            description: 'Создать персонажа в разных позах',
            probability: 0.75,
            keywords: ['позы', 'движения', 'действия'],
            benefits: 'Сделает персонажа более живым и versatile'
          },
          {
            action: 'sticker_version',
            description: 'Адаптировать для стикеров',
            probability: 0.65,
            keywords: ['стикеры', 'мессенджер', 'telegram'],
            benefits: 'Популярный способ использования персонажей'
          }
        ]
      },

      embroidery: {
        after_image_creation: [
          {
            action: 'simplify_details',
            description: 'Упростить мелкие детали для вышивки',
            probability: 0.90,
            keywords: ['упростить', 'детали', 'вышивка'],
            benefits: 'Критически важно для качественной вышивки'
          },
          {
            action: 'reduce_colors',
            description: 'Сократить количество цветов до 8-12',
            probability: 0.85,
            keywords: ['цвета', 'нитки', 'палитра'],
            benefits: 'Снизит стоимость и время вышивки'
          },
          {
            action: 'convert_to_dst',
            description: 'Конвертировать в формат вышивки DST',
            probability: 0.95,
            keywords: ['DST', 'формат', 'машина'],
            benefits: 'Готовый файл для вышивальной машины'
          }
        ],
        after_simplification: [
          {
            action: 'thread_mapping',
            description: 'Подобрать нитки и создать карту цветов',
            probability: 0.80,
            keywords: ['нитки', 'цвета', 'карта'],
            benefits: 'Поможет вышивальщику подобрать правильные нитки'
          }
        ]
      },

      general: {
        after_image_creation: [
          {
            action: 'determine_usage',
            description: 'Определить назначение изображения',
            probability: 0.60,
            keywords: ['использование', 'назначение', 'цель'],
            benefits: 'Поможет предложить оптимизации'
          },
          {
            action: 'quality_enhancement',
            description: 'Улучшить качество изображения',
            probability: 0.50,
            keywords: ['качество', 'улучшить', 'четкость'],
            benefits: 'Повысит профессиональность результата'
          }
        ]
      }
    };

    // Паттерны пользовательского поведения
    this.behaviorPatterns = {
      perfectionist: {
        indicators: ['измени', 'улучши', 'еще раз', 'по-другому', 'лучше'],
        predictions: [
          'Вероятны множественные итерации',
          'Внимание к деталям',
          'Запросы на доработку'
        ]
      },
      efficient: {
        indicators: ['быстро', 'сразу', 'готово', 'пойдет', 'нормально'],
        predictions: [
          'Минимум доработок',
          'Фокус на результате',
          'Переход к следующим задачам'
        ]
      },
      explorer: {
        indicators: ['попробуй', 'а что если', 'варианты', 'эксперименты'],
        predictions: [
          'Интерес к альтернативам',
          'Творческие эксперименты',
          'Нестандартные решения'
        ]
      }
    };

    // Временные паттерны
    this.temporalPatterns = {
      immediate_next: 0.8,    // Вероятность, что следующее действие произойдет в этой сессии
      session_end: 0.6,      // Вероятность, что пользователь завершит на этом
      return_later: 0.4      // Вероятность, что пользователь вернется позже
    };
  }

  /**
   * Продвинутая предиктивная аналитика (Фаза 2)
   */
  predictNextSteps(project, context = {}) {
    const predictions = [];

    // Анализируем временные паттерны
    const temporalAnalysis = this.analyzeTemporalPatterns(project);

    // Анализируем паттерны пользователя
    const userPatterns = this.analyzeUserBehaviorPatterns(context);

    // Анализируем контекстные факторы
    const contextualFactors = this.analyzeContextualFactors(context);

    if (!project.artifacts || project.artifacts.length === 0) {
      // Новый проект - предсказываем начальные шаги
      predictions.push({
        action: 'create_initial_design',
        probability: 0.8,
        description: 'Создание первоначального дизайна',
        reasoning: 'Проект не содержит артефактов',
        confidence: 0.9,
        timeframe: 'immediate',
        dependencies: [],
        impact: 'high'
      });
    }

    return predictions;
  }

  /**
   * Сопоставление концепции с типом в правилах
   */
  mapConceptToType(concept) {
    const mapping = {
      'логотип': 'logo',
      'logo': 'logo',
      'принт': 'print', 
      'print': 'print',
      'персонаж': 'character',
      'character': 'character',
      'вышивка': 'embroidery',
      'embroidery': 'embroidery'
    };

    return mapping[concept] || 'general';
  }

  /**
   * Анализ текущего состояния проекта
   */
  analyzeProjectState(project) {
    const state = {
      has_images: project.artifacts.filter(a => a.type === 'image').length > 0,
      has_vectors: project.artifacts.filter(a => a.type === 'vector').length > 0,
      has_embroidery: project.artifacts.filter(a => a.type === 'embroidery').length > 0,
      artifacts_count: project.artifacts.length,
      latest_artifact: project.artifacts.length > 0 ? 
        project.artifacts[project.artifacts.length - 1] : null,
      project_age_hours: (Date.now() - project.createdAt) / (1000 * 60 * 60),
      last_update_hours: (Date.now() - project.updatedAt) / (1000 * 60 * 60)
    };

    // Определяем фазу проекта
    if (state.artifacts_count === 0) {
      state.phase = 'initial';
    } else if (state.artifacts_count === 1 && state.has_images) {
      state.phase = 'after_image_creation';
    } else if (state.has_vectors) {
      state.phase = 'after_vectorization';
    } else if (state.artifacts_count > 2) {
      state.phase = 'mature';
    } else {
      state.phase = 'development';
    }

    return state;
  }

  /**
   * Получение применимых правил на основе состояния
   */
  getApplicableRules(rules, projectState) {
    const phase = projectState.phase;
    let applicableRules = [];

    // Выбираем правила для текущей фазы
    if (rules[phase]) {
      applicableRules = [...rules[phase]];
    }

    // Добавляем универсальные правила
    if (rules.always) {
      applicableRules.push(...rules.always);
    }

    // Фильтруем правила на основе уже существующих артефактов
    applicableRules = applicableRules.filter(rule => {
      return !this.isActionAlreadyDone(rule.action, projectState);
    });

    return applicableRules;
  }

  /**
   * Проверка, выполнено ли уже действие
   */
  isActionAlreadyDone(action, projectState) {
    const actionChecks = {
      'vectorize': () => projectState.has_vectors,
      'convert_to_dst': () => projectState.has_embroidery,
      'simplify_details': () => projectState.latest_artifact?.description?.includes('упрощен'),
      'reduce_colors': () => projectState.latest_artifact?.description?.includes('цвета сокращены')
    };

    const check = actionChecks[action];
    return check ? check() : false;
  }

  /**
   * Создание предсказания
   */
  createPrediction(rule, project, context) {
    // Корректируем вероятность на основе контекста
    let adjustedProbability = rule.probability;

    // Увеличиваем вероятность, если есть ключевые слова в недавних сообщениях
    if (context.recentQueries) {
      const recentText = context.recentQueries.join(' ').toLowerCase();
      const keywordMatches = rule.keywords.filter(keyword => 
        recentText.includes(keyword)
      ).length;

      if (keywordMatches > 0) {
        adjustedProbability += keywordMatches * 0.1;
      }
    }

    // Снижаем вероятность для старых проектов
    const projectAgeHours = (Date.now() - project.updatedAt) / (1000 * 60 * 60);
    if (projectAgeHours > 24) {
      adjustedProbability *= 0.7;
    } else if (projectAgeHours > 2) {
      adjustedProbability *= 0.9;
    }

    // Создаем финальное предсказание
    return {
      action: rule.action,
      description: rule.description,
      probability: Math.min(adjustedProbability, 0.95),
      benefits: rule.benefits,
      keywords: rule.keywords,
      project_id: project.id,
      confidence: this.calculatePredictionConfidence(rule, project, context),
      suggested_prompts: this.generateSuggestedPrompts(rule, project)
    };
  }

  /**
   * Предсказания на основе поведенческих паттернов
   */
  predictBasedOnBehavior(project, context) {
    const predictions = [];

    if (!context.userBehaviorHistory) {
      return predictions;
    }

    // Анализируем паттерн поведения пользователя
    const userPattern = this.identifyUserPattern(context.userBehaviorHistory);

    if (userPattern === 'perfectionist') {
      predictions.push({
        action: 'request_modifications',
        description: 'Вероятны запросы на доработку и улучшения',
        probability: 0.75,
        type: 'behavioral',
        confidence: 0.7
      });
    } else if (userPattern === 'explorer') {
      predictions.push({
        action: 'try_variations',
        description: 'Интерес к альтернативным вариантам и экспериментам',
        probability: 0.70,
        type: 'behavioral',  
        confidence: 0.65
      });
    }

    return predictions;
  }

  /**
   * Идентификация паттерна поведения пользователя
   */
  identifyUserPattern(behaviorHistory) {
    const patterns = Object.keys(this.behaviorPatterns);
    const scores = {};

    patterns.forEach(pattern => {
      scores[pattern] = 0;
      const indicators = this.behaviorPatterns[pattern].indicators;

      behaviorHistory.forEach(entry => {
        const text = entry.toLowerCase();
        indicators.forEach(indicator => {
          if (text.includes(indicator)) {
            scores[pattern]++;
          }
        });
      });
    });

    // Возвращаем паттерн с наивысшим счетом
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return null;

    return Object.keys(scores).find(pattern => scores[pattern] === maxScore);
  }

  /**
   * Вычисление уверенности в предсказании
   */
  calculatePredictionConfidence(rule, project, context) {
    let confidence = rule.probability;

    // Фактор: возраст проекта
    const projectAgeHours = (Date.now() - project.createdAt) / (1000 * 60 * 60);
    if (projectAgeHours < 1) {
      confidence += 0.1; // Новые проекты более предсказуемы
    }

    // Фактор: активность в проекте
    if (project.artifacts.length > 0) {
      confidence += 0.05;
    }

    // Фактор: наличие контекста
    if (context.recentQueries && context.recentQueries.length > 0) {
      confidence += 0.05;
    }

    return Math.min(confidence, 0.95);
  }

  /**
   * Генерация предлагаемых промптов
   */
  generateSuggestedPrompts(rule, project) {
    const prompts = [];
    const projectTitle = project.title.toLowerCase();

    switch (rule.action) {
      case 'vectorize':
        prompts.push(
          `Векторизуй ${projectTitle}`,
          `Сделай SVG версию ${projectTitle}`,
          `Преобразуй в векторный формат`
        );
        break;

      case 'optimize_for_fabric':
        prompts.push(
          `Оптимизируй ${projectTitle} для печати на ткани`,
          `Адаптируй для футболки`,
          `Подготовь для текстильной печати`
        );
        break;

      case 'convert_to_dst':
        prompts.push(
          `Конвертируй ${projectTitle} в формат вышивки`,
          `Сделай DST файл`,
          `Подготовь для вышивальной машины`
        );
        break;

      case 'emotion_variations':
        prompts.push(
          `Сделай ${projectTitle} веселым`,
          `Создай грустную версию`,
          `Покажи разные эмоции персонажа`
        );
        break;

      default:
        prompts.push(
          `${rule.description.toLowerCase()}`,
          `Доработай ${projectTitle}`,
          `Улучши проект`
        );
    }

    return prompts.slice(0, 3);
  }

  /**
   * Предсказание долгосрочных целей проекта
   */
  predictLongTermGoals(project) {
    const longTermGoals = [];
    const projectType = this.mapConceptToType(project.concept);

    const goalMappings = {
      logo: [
        'Создание полного фирменного стиля',
        'Разработка брендбука',
        'Применение на всех носителях'
      ],
      print: [
        'Запуск производства принтов',
        'Создание коллекции дизайнов',
        'Маркетинг и продажи'
      ],
      character: [
        'Развитие персонажа в серию',
        'Создание истории и контента',
        'Коммерциализация персонажа'
      ],
      embroidery: [
        'Производство вышитых изделий',
        'Создание каталога дизайнов',
        'Масштабирование производства'
      ]
    };

    const goals = goalMappings[projectType] || [];
    goals.forEach((goal, index) => {
      longTermGoals.push({
        goal,
        probability: 0.6 - (index * 0.1),
        timeframe: `${(index + 1) * 2}-${(index + 1) * 4} недели`
      });
    });

    return longTermGoals;
  }

  /**
   * Анализ трендов использования
   */
  analyzeUsageTrends(project, context) {
    const trends = {
      increasing_complexity: false,
      focus_shift: null,
      user_satisfaction: 'unknown'
    };

    if (project.artifacts.length > 1) {
      // Анализируем сложность артефактов
      const complexityTrend = this.analyzeComplexityTrend(project.artifacts);
      trends.increasing_complexity = complexityTrend > 0;

      // Анализируем смещение фокуса
      trends.focus_shift = this.analyzeFocusShift(project.artifacts);
    }

    // Анализируем удовлетворенность пользователя по контексту
    if (context.recentQueries) {
      trends.user_satisfaction = this.analyzeSatisfaction(context.recentQueries);
    }

    return trends;
  }

  analyzeComplexityTrend(artifacts) {
    // Простой анализ тренда сложности по длине описаний
    if (artifacts.length < 2) return 0;

    const firstHalf = artifacts.slice(0, Math.floor(artifacts.length / 2));
    const secondHalf = artifacts.slice(Math.floor(artifacts.length / 2));

    const avgComplexityFirst = firstHalf.reduce((sum, a) => 
      sum + (a.description?.length || 0), 0) / firstHalf.length;

    const avgComplexitySecond = secondHalf.reduce((sum, a) => 
      sum + (a.description?.length || 0), 0) / secondHalf.length;

    return avgComplexitySecond - avgComplexityFirst;
  }

  analyzeFocusShift(artifacts) {
    // Анализируем изменение типов артефактов
    const types = artifacts.map(a => a.type);
    const uniqueTypes = [...new Set(types)];

    if (uniqueTypes.length === 1) return null;

    const recentTypes = types.slice(-2);
    const earlierTypes = types.slice(0, -2);

    if (recentTypes.every(type => !earlierTypes.includes(type))) {
      return 'shift_to_new_format';
    }

    return null;
  }

  analyzeSatisfaction(recentQueries) {
    const satisfiedKeywords = ['отлично', 'хорошо', 'подходит', 'нравится', 'супер'];
    const dissatisfiedKeywords = ['не то', 'плохо', 'не нравится', 'переделай', 'по-другому'];

    const text = recentQueries.join(' ').toLowerCase();

    const satisfiedCount = satisfiedKeywords.filter(word => text.includes(word)).length;
    const dissatisfiedCount = dissatisfiedKeywords.filter(word => text.includes(word)).length;

    if (satisfiedCount > dissatisfiedCount) return 'satisfied';
    if (dissatisfiedCount > satisfiedCount) return 'dissatisfied';
    return 'neutral';
  }

  /**
   * Анализ временных паттернов
   */
  analyzeTemporalPatterns(project) {
    // Пример: Анализ времени между действиями
    const timeBetweenActions = project.artifacts.length > 1 ?
      (project.artifacts[project.artifacts.length - 1].createdAt - project.artifacts[project.artifacts.length - 2].createdAt) : 0;

    return {
      timeBetweenActions,
      projectAge: Date.now() - project.createdAt
    };
  }

  /**
   * Анализ паттернов поведения пользователя
   */
  analyzeUserBehaviorPatterns(context) {
    // Пример: Анализ частоты правок
    return {
      editsCount: context.userBehaviorHistory ? context.userBehaviorHistory.length : 0
    };
  }

  /**
   * Анализ контекстных факторов
   */
  analyzeContextualFactors(context) {
    // Пример: Анализ текущего времени суток
    const currentHour = new Date().getHours();

    return {
      currentHour
    };
  }
}

// Создаем глобальный экземпляр
const projectPredictor = new ProjectPredictor();

module.exports = {
  predictNextSteps: projectPredictor.predictNextSteps.bind(projectPredictor),
  predictLongTermGoals: projectPredictor.predictLongTermGoals.bind(projectPredictor),
  analyzeUsageTrends: projectPredictor.analyzeUsageTrends.bind(projectPredictor),

  // Экспортируем класс для расширения
  ProjectPredictor
};