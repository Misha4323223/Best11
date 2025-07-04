/**
 * Слой интеграции семантической памяти с мета-семантикой
 * ФАЗА 2: Интеграция мета-семантического движка
 */

const semanticMemory = require('./semantic-memory/index.cjs');
const userMemoryManager = require('./semantic-memory/user-memory-manager.cjs');
const userProfiler = require('./semantic-memory/user-profiler.cjs');
const learningSystem = require('./semantic-memory/learning-system.cjs');

const SmartLogger = {
  integration: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🔗 [${timestamp}] SEMANTIC INTEGRATION: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Интеграционный анализатор с мета-семантикой
 */
class MetaSemanticIntegrationLayer {
  constructor() {
    this.semanticThreshold = 30;
    this.enabled = true;
  }

  /**
   * ГЛАВНЫЙ МЕТОД: Мета-семантический анализ запроса
   */
  async analyzeWithSemantics(userQuery, options = {}) {
    SmartLogger.integration(`🚀🧠 МЕТА-СЕМАНТИЧЕСКИЙ анализ: "${userQuery.substring(0, 50)}..."`);

    try {
      if (!this.enabled) {
        return { shouldUseSemantic: false, reason: 'disabled' };
      }

      // Определяем использовать ли мета-семантику
      const useMetaSemantics = this.shouldUseMetaSemantics(userQuery, options);
      
      if (useMetaSemantics) {
        SmartLogger.integration('🔮 Используем МЕТА-СЕМАНТИЧЕСКИЙ анализ');
        return await this.performMetaSemanticAnalysis(userQuery, options);
      } else {
        SmartLogger.integration('🧠 Используем стандартный семантический анализ');
        return await this.performStandardSemanticAnalysis(userQuery, options);
      }

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка семантической интеграции: ${error.message}`);
      return { shouldUseSemantic: false, reason: 'error', error: error.message };
    }
  }

  /**
   * Определяет использование мета-семантики
   */
  shouldUseMetaSemantics(userQuery, options) {
    const isComplex = userQuery.length > 50 || userQuery.split(' ').length > 8;
    const isCritical = userQuery.includes('важно') || userQuery.includes('точно');
    const hasProjectHistory = options.hasRecentImages || options.sessionId;
    const isAnalytical = userQuery.includes('анализ') || userQuery.includes('совет');

    const shouldUse = isComplex || isCritical || hasProjectHistory || isAnalytical;
    SmartLogger.integration(`Мета-семантика: ${shouldUse ? 'ВКЛЮЧЕНА' : 'выключена'}`);
    
    return shouldUse;
  }

  /**
   * Выполняет мета-семантический анализ
   */
  async performMetaSemanticAnalysis(userQuery, options) {
    try {
      const semanticResult = await semanticMemory.analyzeCompleteRequestWithMeta(
        userQuery,
        options.sessionId || 'default',
        {
          hasRecentImages: options.hasRecentImages || false,
          chatContext: options.chatContext,
          requestType: options.requestType,
          userPreferences: options.userPreferences
        }
      );

      const qualityScore = semanticResult.quality_score || 5;
      const metaConfidence = semanticResult.enhanced_confidence || 0.7;
      const shouldUseSemantic = qualityScore > 6 && metaConfidence > 0.65;
      
      SmartLogger.integration(`📊 Мета-качество: ${qualityScore}/10, уверенность: ${(metaConfidence * 100).toFixed(1)}%`);

      return {
        shouldUseSemantic,
        reason: shouldUseSemantic ? 'meta_semantic_analysis_success' : 'meta_semantic_quality_low',
        semanticResult,
        metaSemanticData: {
          qualityScore,
          metaConfidence,
          metaInsights: semanticResult.meta_insights,
          systemLearnings: semanticResult.system_learnings,
          recommendations: semanticResult.enhanced_recommendations,
          predictions: semanticResult.enhanced_predictions
        },
        processingTime: semanticResult.total_processing_time,
        fallbackMode: semanticResult.fallback_mode || false
      };

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка мета-семантического анализа: ${error.message}`);
      return await this.performStandardSemanticAnalysis(userQuery, options);
    }
  }

  /**
   * Выполняет стандартный семантический анализ
   */
  async performStandardSemanticAnalysis(userQuery, options) {
    try {
      const semanticResult = await semanticMemory.analyzeCompleteRequest(
        userQuery,
        options.sessionId || 'default',
        {
          hasRecentImages: options.hasRecentImages || false,
          chatContext: options.chatContext,
          requestType: options.requestType
        }
      );

      const confidence = semanticResult.confidence || 0.6;
      const projectRelevance = semanticResult.current_project ? 0.8 : 0.4;
      const overallConfidence = (confidence + projectRelevance) / 2;
      const shouldUseSemantic = overallConfidence > this.semanticThreshold / 100;

      return {
        shouldUseSemantic,
        reason: shouldUseSemantic ? 'semantic_analysis_success' : 'semantic_confidence_low',
        semanticResult,
        confidence: overallConfidence,
        processingTime: semanticResult.processing_time
      };

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка стандартного анализа: ${error.message}`);
      return { shouldUseSemantic: false, reason: 'semantic_error', error: error.message };
    }
  }

  /**
   * Создает семантический ответ
   */
  async createSemanticResponse(semanticResult, userQuery, options) {
    SmartLogger.integration('🎨 Создание семантического ответа');

    try {
      let response = '';
      
      // Если есть мета-семантические данные
      if (semanticResult.meta_semantic) {
        response = await this.createMetaSemanticResponse(semanticResult, userQuery, options);
      } else {
        response = await this.createStandardSemanticResponse(semanticResult, userQuery, options);
      }

      // Добавляем проактивные предложения
      if (semanticResult.enhanced_predictions || semanticResult.predictions) {
        const suggestions = await this.addProactiveSuggestions(
          semanticResult.enhanced_predictions || semanticResult.predictions
        );
        response += suggestions;
      }

      return { success: true, response, semanticData: semanticResult };

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка создания ответа: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Создает мета-семантический ответ
   */
  async createMetaSemanticResponse(semanticResult, userQuery, options) {
    let response = `🧠 Мета-семантический анализ завершен.`;
    
    // Добавляем информацию о качестве
    if (semanticResult.quality_score) {
      response += `\n📊 Качество анализа: ${semanticResult.quality_score}/10`;
    }

    // Добавляем мета-инсайты
    if (semanticResult.meta_insights && semanticResult.meta_insights.length > 0) {
      response += `\n\n🔮 **Мета-инсайты**:`;
      semanticResult.meta_insights.forEach(insight => {
        response += `\n• ${insight}`;
      });
    }

    // Добавляем системные обучения
    if (semanticResult.system_learnings && semanticResult.system_learnings.length > 0) {
      response += `\n\n🎓 **Системные обучения**:`;
      semanticResult.system_learnings.forEach(learning => {
        response += `\n• ${learning}`;
      });
    }

    return response;
  }

  /**
   * Создает стандартный семантический ответ
   */
  async createStandardSemanticResponse(semanticResult, userQuery, options) {
    let response = `🧠 Семантический анализ выполнен.`;
    
    if (semanticResult.current_project) {
      response += `\n📋 Проект: ${semanticResult.current_project.concept}`;
    }

    if (semanticResult.confidence) {
      response += `\n📊 Уверенность: ${(semanticResult.confidence * 100).toFixed(1)}%`;
    }

    return response;
  }

  /**
   * Обогащает стандартный ответ
   */
  async enrichStandardResponse(standardResponse, semanticData, options) {
    if (!semanticData) return standardResponse;

    let enrichedResponse = standardResponse;

    // Добавляем контекст проекта
    if (semanticData.current_project) {
      enrichedResponse += `\n\n💡 Контекст проекта: ${semanticData.current_project.concept}`;
    }

    // Добавляем предсказания
    if (semanticData.predictions && semanticData.predictions.length > 0) {
      const topPrediction = semanticData.predictions[0];
      enrichedResponse += `\n🔮 Возможный следующий шаг: ${topPrediction.description}`;
    }

    return enrichedResponse;
  }

  /**
   * Добавляет проактивные предложения
   */
  async addProactiveSuggestions(predictions) {
    if (!predictions || predictions.length === 0) return '';

    const topPredictions = predictions.slice(0, 2);
    let suggestions = '\n\n🔮 **Возможные следующие шаги**:';
    
    topPredictions.forEach((prediction, index) => {
      const message = prediction.message || prediction.description || 'Рекомендация';
      const probability = prediction.probability ? ` (${Math.round(prediction.probability * 100)}%)` : '';
      suggestions += `\n${index + 1}️⃣ ${message}${probability}`;
    });

    return suggestions;
  }

  /**
   * Извлекает категорию из семантического результата
   */
  extractCategoryFromSemantic(semanticResult) {
    if (semanticResult.category) return semanticResult.category;
    if (semanticResult.current_project && semanticResult.current_project.type) {
      return this.mapProjectTypeToCategory(semanticResult.current_project.type);
    }
    return null;
  }

  /**
   * Мапит тип проекта в категорию
   */
  mapProjectTypeToCategory(projectType) {
    const mapping = {
      'branding': 'image_generation',
      'logo_design': 'image_generation',
      'vectorization': 'vectorization',
      'image_editing': 'image_editing',
      'embroidery': 'embroidery'
    };
    return mapping[projectType] || 'conversation';
  }

  // Методы управления
  setSemanticThreshold(threshold) { this.semanticThreshold = threshold; }
  enableSemantic() { this.enabled = true; }
  disableSemantic() { this.enabled = false; }
}

// Создаем глобальный экземпляр
const metaSemanticIntegrationLayer = new MetaSemanticIntegrationLayer();

module.exports = {
  // Основные методы
  analyzeWithSemantics: metaSemanticIntegrationLayer.analyzeWithSemantics.bind(metaSemanticIntegrationLayer),
  createSemanticResponse: metaSemanticIntegrationLayer.createSemanticResponse.bind(metaSemanticIntegrationLayer),
  enrichStandardResponse: metaSemanticIntegrationLayer.enrichStandardResponse.bind(metaSemanticIntegrationLayer),
  
  // Дополнительные методы
  extractCategoryFromSemantic: metaSemanticIntegrationLayer.extractCategoryFromSemantic.bind(metaSemanticIntegrationLayer),
  mapSemanticClusterToCategory: metaSemanticIntegrationLayer.extractCategoryFromSemantic.bind(metaSemanticIntegrationLayer),
  
  // Управление
  setSemanticThreshold: metaSemanticIntegrationLayer.setSemanticThreshold.bind(metaSemanticIntegrationLayer),
  enableSemantic: metaSemanticIntegrationLayer.enableSemantic.bind(metaSemanticIntegrationLayer),
  disableSemantic: metaSemanticIntegrationLayer.disableSemantic.bind(metaSemanticIntegrationLayer),
  
  // Класс для расширения
  MetaSemanticIntegrationLayer
};