/**
 * Семантический анализатор запросов
 * Понимает скрытые намерения и смысловые связи в тексте пользователя
 */

const SmartLogger = {
  semantic: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🔬 [${timestamp}] SEMANTIC ANALYZER: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Анализатор семантических связей
 */
class SemanticAnalyzer {
  constructor() {
    this.initializeKnowledgeBase();
  }

  initializeKnowledgeBase() {
    // Семантические кластеры связанных понятий
    this.semanticClusters = {
      branding: {
        core: ['логотип', 'бренд', 'фирменный стиль', 'айдентика'],
        related: ['визитка', 'фирменные цвета', 'шрифт', 'слоган', 'эмблема'],
        implications: ['масштабируемость', 'узнаваемость', 'профессионализм'],
        typical_next_steps: ['векторизация', 'цветовые варианты', 'монохромная версия', 'применение на носителях']
      },

      image_creation: {
        core: ['изображение', 'картинка', 'рисунок', 'панда', 'кибер', 'персонаж', 'создай', 'нарисуй'],
        related: ['фото', 'иллюстрация', 'арт', 'дизайн', 'животное', 'робот', 'техно', 'футуристический'],
        implications: ['визуализация', 'творчество', 'стилизация'],
        typical_next_steps: ['выбор стиля', 'детализация', 'цветокоррекция', 'оптимизация']
      },

      apparel_design: {
        core: ['принт', 'футболка', 'одежда', 'тишарт'],
        related: ['печать', 'ткань', 'краски', 'размер', 'позиционирование'],
        implications: ['читаемость на расстоянии', 'долговечность печати', 'простота форм'],
        typical_next_steps: ['оптимизация для печати', 'адаптация размеров', 'цветокоррекция']
      },

      embroidery_design: {
        core: ['вышивка', 'машинная вышивка', 'dst', 'pes', 'jef'],
        related: ['нитки', 'плотность', 'стежки', 'детализация'],
        implications: ['ограничение мелких деталей', 'максимум 15 цветов', 'толщина линий'],
        typical_next_steps: ['упрощение деталей', 'конвертация в формат вышивки', 'подбор ниток']
      },

      character_design: {
        core: ['персонаж', 'герой', 'character', 'mascot'],
        related: ['эмоции', 'позы', 'выражения', 'стиль', 'пропорции'],
        implications: ['узнаваемость', 'эмоциональная связь', 'масштабируемость использования'],
        typical_next_steps: ['вариации эмоций', 'разные позы', 'стилизация']
      },

      signage_design: {
        core: ['вывеска', 'баннер', 'указатель', 'реклама'],
        related: ['читаемость', 'контрастность', 'размер шрифта', 'расстояние просмотра'],
        implications: ['видимость издалека', 'погодная стойкость', 'простота восприятия'],
        typical_next_steps: ['увеличение контрастности', 'упрощение деталей', 'векторизация']
      }
    };

    // Паттерны намерений
    this.intentionPatterns = {
      continuation: {
        patterns: ['теперь', 'а теперь', 'сделай его', 'измени его', 'добавь к нему', 'и еще'],
        confidence: 0.9,
        type: 'modify_existing'
      },

      new_project: {
        patterns: ['создай новый', 'другой', 'еще один', 'давай сделаем', 'хочу создать'],
        confidence: 0.85,
        type: 'create_new'
      },

      improvement: {
        patterns: ['улучши', 'сделай лучше', 'доработай', 'оптимизируй', 'исправь'],
        confidence: 0.8,
        type: 'enhance_existing'
      },

      variation: {
        patterns: ['вариант', 'версия', 'альтернатива', 'по-другому', 'в другом стиле'],
        confidence: 0.75,
        type: 'create_variation'
      },

      format_conversion: {
        patterns: ['векторизуй', 'в svg', 'для печати', 'для вышивки', 'конвертируй'],
        confidence: 0.95,
        type: 'format_conversion'
      }
    };

    // Контекстные подсказки
    this.contextClues = {
      business_types: {
        'кофейня': {
          typical_colors: ['коричневый', 'бежевый', 'темно-зеленый', 'кремовый'],
          typical_elements: ['зерна кофе', 'чашка', 'пар', 'листья'],
          style_preferences: ['уютный', 'теплый', 'натуральный']
        },
        'пиццерия': {
          typical_colors: ['красный', 'зеленый', 'белый', 'желтый'],
          typical_elements: ['пицца', 'итальянский флаг', 'повар', 'печь'],
          style_preferences: ['итальянский', 'традиционный', 'аппетитный']
        },
        'магазин': {
          typical_colors: ['синий', 'красный', 'зеленый', 'оранжевый'],
          typical_elements: ['корзина', 'сумка', 'тележка', 'здание'],
          style_preferences: ['доступный', 'дружелюбный', 'современный']
        }
      }
    };

    // Цепочки логических связей
    this.logicalChains = {
      'логотип -> печать': ['векторизация', 'цветовая оптимизация', 'масштабирование'],
      'персонаж -> вышивка': ['упрощение деталей', 'сокращение цветов', 'увеличение толщины линий'],
      'принт -> футболка': ['адаптация размера', 'центрирование', 'учет ткани'],
      'эмблема -> вывеска': ['увеличение контрастности', 'упрощение мелких деталей', 'читаемость']
    };
  }

  /**
   * Основной метод семантического анализа
   */
  analyzeSemantics(query, context = {}) {
    SmartLogger.semantic(`Семантический анализ запроса: "${query}"`);

    const analysis = {
      query: query,
      semantic_cluster: this.identifySemanticCluster(query),
      intentions: this.analyzeIntentions(query),
      context_clues: this.extractContextClues(query),
      logical_chain: this.buildLogicalChain(query, context),
      implicit_requirements: this.identifyImplicitRequirements(query),
      confidence: 0
    };

    // Вычисляем общую уверенность анализа
    analysis.confidence = this.calculateAnalysisConfidence(analysis);

    SmartLogger.semantic('Результат семантического анализа:', analysis);
    return analysis;
  }

  /**
   * Определение семантического кластера
   */
  identifySemanticCluster(query) {
    const lowerQuery = query.toLowerCase();
    const clusterScores = {};

    SmartLogger.semantic(`Анализирую кластеры для запроса: "${lowerQuery}"`);

    // Подсчитываем совпадения с каждым кластером
    Object.entries(this.semanticClusters).forEach(([clusterName, cluster]) => {
      let score = 0;
      const matchedCore = [];
      const matchedRelated = [];
      
      // Проверяем ключевые слова
      cluster.core.forEach(keyword => {
        if (lowerQuery.includes(keyword)) {
          score += 10; // Высокий вес для основных слов
          matchedCore.push(keyword);
        }
      });

      cluster.related.forEach(keyword => {
        if (lowerQuery.includes(keyword)) {
          score += 5; // Средний вес для связанных слов
          matchedRelated.push(keyword);
        }
      });

      if (score > 0) {
        const confidence = Math.min(score * 8, 100); // Снижаем множитель для более реалистичной уверенности
        clusterScores[clusterName] = {
          score,
          confidence,
          cluster: cluster,
          matchedCore,
          matchedRelated
        };
        
        SmartLogger.semantic(`Кластер ${clusterName}: счет=${score}, уверенность=${confidence}%, совпало ключевых=${matchedCore.length}, связанных=${matchedRelated.length}`);
      }
    });

    // Находим кластер с наивысшим счетом
    const bestCluster = Object.entries(clusterScores)
      .sort(([,a], [,b]) => b.score - a.score)[0];

    if (bestCluster) {
      SmartLogger.semantic(`Определен лучший семантический кластер: ${bestCluster[0]} (уверенность: ${bestCluster[1].confidence}%)`);
      return {
        name: bestCluster[0],
        ...bestCluster[1]
      };
    }

    SmartLogger.semantic(`Семантический кластер не найден для запроса: "${lowerQuery}"`);
    return null;
  }

  /**
   * Анализ намерений пользователя
   */
  analyzeIntentions(query) {
    const lowerQuery = query.toLowerCase();
    const detectedIntentions = [];

    Object.entries(this.intentionPatterns).forEach(([intentionName, intentionData]) => {
      let matches = 0;
      const matchedPatterns = [];

      intentionData.patterns.forEach(pattern => {
        if (lowerQuery.includes(pattern)) {
          matches++;
          matchedPatterns.push(pattern);
        }
      });

      if (matches > 0) {
        detectedIntentions.push({
          name: intentionName,
          type: intentionData.type,
          confidence: intentionData.confidence * (matches / intentionData.patterns.length),
          matched_patterns: matchedPatterns,
          strength: matches
        });
      }
    });

    // Сортируем по уверенности
    detectedIntentions.sort((a, b) => b.confidence - a.confidence);

    SmartLogger.semantic(`Обнаружено намерений: ${detectedIntentions.length}`, detectedIntentions);
    return detectedIntentions;
  }

  /**
   * Извлечение контекстных подсказок
   */
  extractContextClues(query) {
    const lowerQuery = query.toLowerCase();
    const clues = {
      business_context: null,
      style_hints: [],
      color_hints: [],
      usage_hints: []
    };

    // Определяем тип бизнеса
    Object.entries(this.contextClues.business_types).forEach(([businessType, businessData]) => {
      if (lowerQuery.includes(businessType)) {
        clues.business_context = {
          type: businessType,
          data: businessData
        };
        
        // Добавляем подсказки по цветам
        clues.color_hints.push(...businessData.typical_colors);
        clues.style_hints.push(...businessData.style_preferences);
      }
    });

    // Определяем контекст использования
    const usageContexts = {
      'печать': { medium: 'print', requirements: ['высокое разрешение', 'CMYK цвета'] },
      'веб': { medium: 'digital', requirements: ['RGB цвета', 'оптимизация размера'] },
      'вывеска': { medium: 'large_format', requirements: ['высокий контраст', 'простые формы'] },
      'вышивка': { medium: 'embroidery', requirements: ['упрощение деталей', 'ограничение цветов'] }
    };

    Object.entries(usageContexts).forEach(([keyword, contextData]) => {
      if (lowerQuery.includes(keyword)) {
        clues.usage_hints.push(contextData);
      }
    });

    SmartLogger.semantic('Извлеченные контекстные подсказки:', clues);
    return clues;
  }

  /**
   * Построение логической цепочки действий
   */
  buildLogicalChain(query, context) {
    const lowerQuery = query.toLowerCase();
    const chains = [];

    // Проверяем готовые цепочки
    Object.entries(this.logicalChains).forEach(([chainKey, steps]) => {
      const [from, to] = chainKey.split(' -> ');
      
      if (lowerQuery.includes(from) && lowerQuery.includes(to)) {
        chains.push({
          from,
          to,
          steps,
          type: 'direct_chain',
          confidence: 0.9
        });
      }
    });

    // Строим цепочку на основе контекста
    if (context.hasRecentImages && lowerQuery.includes('вектор')) {
      chains.push({
        from: 'existing_image',
        to: 'vector_format',
        steps: ['анализ изображения', 'извлечение контуров', 'векторизация'],
        type: 'contextual_chain',
        confidence: 0.85
      });
    }

    SmartLogger.semantic('Построенные логические цепочки:', chains);
    return chains;
  }

  /**
   * Выявление неявных требований
   */
  identifyImplicitRequirements(query) {
    const requirements = [];
    const lowerQuery = query.toLowerCase();

    // Неявные требования для логотипов
    if (lowerQuery.includes('логотип')) {
      requirements.push({
        type: 'scalability',
        description: 'Логотип должен масштабироваться без потери качества',
        importance: 'high',
        suggested_action: 'векторизация'
      });

      requirements.push({
        type: 'simplicity',
        description: 'Логотип должен быть простым и запоминающимся',
        importance: 'medium',
        suggested_action: 'упрощение деталей'
      });
    }

    // Неявные требования для печати
    if (lowerQuery.includes('печать') || lowerQuery.includes('принт')) {
      requirements.push({
        type: 'print_quality',
        description: 'Изображение должно хорошо печататься',
        importance: 'high',
        suggested_action: 'высокое разрешение и контрастность'
      });

      requirements.push({
        type: 'color_mode',
        description: 'Цвета должны быть адаптированы для печати',
        importance: 'medium',
        suggested_action: 'конвертация в CMYK'
      });
    }

    // Неявные требования для вышивки
    if (lowerQuery.includes('вышивка')) {
      requirements.push({
        type: 'thread_limitation',
        description: 'Ограничение количества цветов нитей',
        importance: 'critical',
        suggested_action: 'сокращение палитры до 8-12 цветов'
      });

      requirements.push({
        type: 'detail_simplification',
        description: 'Мелкие детали не подходят для вышивки',
        importance: 'high',
        suggested_action: 'упрощение и укрупнение элементов'
      });
    }

    SmartLogger.semantic('Выявленные неявные требования:', requirements);
    return requirements;
  }

  /**
   * Вычисление уверенности анализа
   */
  calculateAnalysisConfidence(analysis) {
    let confidence = 0;
    let factors = 0;

    // Фактор: семантический кластер (основной вес)
    if (analysis.semantic_cluster && analysis.semantic_cluster.confidence > 0) {
      confidence += analysis.semantic_cluster.confidence;
      factors++;
      SmartLogger.semantic(`Кластер добавил: ${analysis.semantic_cluster.confidence}% уверенности`);
    }

    // Фактор: намерения
    if (analysis.intentions.length > 0) {
      const avgIntentionConfidence = analysis.intentions.reduce((sum, intent) => 
        sum + intent.confidence * 100, 0) / analysis.intentions.length;
      confidence += avgIntentionConfidence * 0.3;
      factors++;
      SmartLogger.semantic(`Намерения добавили: ${avgIntentionConfidence * 0.3}% уверенности`);
    }

    // Фактор: контекстные подсказки
    if (analysis.context_clues.business_context || analysis.context_clues.usage_hints.length > 0) {
      confidence += 40;
      factors++;
      SmartLogger.semantic(`Контекст добавил: 40% уверенности`);
    }

    // Фактор: логические цепочки
    if (analysis.logical_chain.length > 0) {
      const avgChainConfidence = analysis.logical_chain.reduce((sum, chain) => 
        sum + chain.confidence * 100, 0) / analysis.logical_chain.length;
      confidence += avgChainConfidence * 0.2;
      factors++;
      SmartLogger.semantic(`Цепочки добавили: ${avgChainConfidence * 0.2}% уверенности`);
    }

    // Фактор: неявные требования
    if (analysis.implicit_requirements.length > 0) {
      confidence += 30;
      factors++;
      SmartLogger.semantic(`Требования добавили: 30% уверенности`);
    }

    // Минимальная базовая уверенность если есть хотя бы один фактор
    if (factors > 0 && confidence < 35) {
      confidence = 35;
      SmartLogger.semantic(`Применена минимальная базовая уверенность: 35%`);
    }

    // Нормализуем если больше 100%
    const finalConfidence = Math.min(confidence, 100);

    SmartLogger.semantic(`Финальная уверенность семантического анализа: ${finalConfidence.toFixed(1)}% (факторов: ${factors})`);
    return Math.round(finalConfidence);
  }

  /**
   * Генерация семантических предложений
   */
  generateSemanticSuggestions(analysis) {
    const suggestions = [];

    // Предложения на основе семантического кластера
    if (analysis.semantic_cluster) {
      const cluster = analysis.semantic_cluster.cluster;
      cluster.typical_next_steps.forEach(step => {
        suggestions.push({
          type: 'cluster_suggestion',
          action: step,
          reason: `Типичный следующий шаг для ${analysis.semantic_cluster.name}`,
          confidence: analysis.semantic_cluster.confidence * 0.01
        });
      });
    }

    // Предложения на основе неявных требований
    analysis.implicit_requirements.forEach(req => {
      if (req.importance === 'critical' || req.importance === 'high') {
        suggestions.push({
          type: 'requirement_suggestion',
          action: req.suggested_action,
          reason: req.description,
          confidence: req.importance === 'critical' ? 0.9 : 0.7
        });
      }
    });

    // Предложения на основе контекста
    if (analysis.context_clues.business_context) {
      const businessData = analysis.context_clues.business_context.data;
      suggestions.push({
        type: 'context_suggestion',
        action: `использовать цвета: ${businessData.typical_colors.slice(0, 3).join(', ')}`,
        reason: `Подходящие цвета для ${analysis.context_clues.business_context.type}`,
        confidence: 0.6
      });
    }

    // Сортируем по уверенности
    suggestions.sort((a, b) => b.confidence - a.confidence);

    SmartLogger.semantic('Сгенерированные семантические предложения:', suggestions.slice(0, 5));
    return suggestions.slice(0, 5); // Возвращаем топ-5
  }

  /**
   * Определение семантической совместимости с существующим проектом
   */
  analyzeProjectCompatibility(query, existingProject) {
    if (!existingProject) return { compatible: false, score: 0 };

    const queryAnalysis = this.analyzeSemantics(query);
    const compatibility = {
      compatible: false,
      score: 0,
      reasons: [],
      conflicts: []
    };

    // Проверяем совместимость концепций
    if (queryAnalysis.semantic_cluster) {
      const clusterName = queryAnalysis.semantic_cluster.name;
      const projectConcept = existingProject.concept;

      // Прямое совпадение концепций
      if (clusterName === projectConcept || 
          this.areRelatedConcepts(clusterName, projectConcept)) {
        compatibility.score += 40;
        compatibility.reasons.push(`Совместимые концепции: ${clusterName} и ${projectConcept}`);
      }
    }

    // Проверяем намерения на модификацию
    const modificationIntents = queryAnalysis.intentions.filter(intent => 
      intent.type === 'modify_existing' || intent.type === 'enhance_existing'
    );

    if (modificationIntents.length > 0) {
      compatibility.score += 30;
      compatibility.reasons.push('Обнаружено намерение на модификацию существующего проекта');
    }

    // Проверяем логические цепочки
    queryAnalysis.logical_chain.forEach(chain => {
      if (this.chainAppliesToProject(chain, existingProject)) {
        compatibility.score += 20;
        compatibility.reasons.push(`Логическая цепочка ${chain.from} -> ${chain.to} применима к проекту`);
      }
    });

    compatibility.compatible = compatibility.score >= 50;
    compatibility.score = Math.min(compatibility.score, 100);

    SmartLogger.semantic('Анализ совместимости с проектом:', compatibility);
    return compatibility;
  }

  areRelatedConcepts(concept1, concept2) {
    const relatedGroups = [
      ['logo', 'логотип', 'branding'],
      ['print', 'принт', 'apparel_design'],
      ['character', 'персонаж', 'character_design'],
      ['embroidery', 'вышивка', 'embroidery_design']
    ];

    return relatedGroups.some(group => 
      group.includes(concept1) && group.includes(concept2)
    );
  }

  chainAppliesToProject(chain, project) {
    // Проверяем, применима ли логическая цепочка к артефактам проекта
    const hasRelevantArtifacts = project.artifacts.some(artifact => {
      return chain.from.includes(artifact.type) || 
             artifact.description?.toLowerCase().includes(chain.from);
    });

    return hasRelevantArtifacts;
  }
}

// Создаем глобальный экземпляр
const semanticAnalyzer = new SemanticAnalyzer();

module.exports = {
  analyzeSemantics: semanticAnalyzer.analyzeSemantics.bind(semanticAnalyzer),
  generateSemanticSuggestions: semanticAnalyzer.generateSemanticSuggestions.bind(semanticAnalyzer),
  analyzeProjectCompatibility: semanticAnalyzer.analyzeProjectCompatibility.bind(semanticAnalyzer),
  
  // Экспортируем класс для расширения
  SemanticAnalyzer
};