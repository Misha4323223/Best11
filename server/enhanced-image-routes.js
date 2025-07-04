
/**
 * 🧠🎨 МАРШРУТЫ ИНТЕЛЛЕКТУАЛЬНОГО УЛУЧШЕНИЯ ИЗОБРАЖЕНИЙ
 * API для доступа к системе интеллектуального улучшения Pollinations.ai
 */

const express = require('express');
const router = express.Router();

// Импорт интеллектуального улучшателя
const intelligentEnhancer = require('./intelligent-pollinations-enhancer.js');

/**
 * POST /api/enhanced-images/generate
 * Генерация изображения с интеллектуальным улучшением
 */
router.post('/generate', async (req, res) => {
  try {
    const { 
      prompt, 
      style = 'photorealistic',
      projectId = null,
      context = {},
      options = {}
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Отсутствует обязательный параметр prompt'
      });
    }

    console.log(`🧠 [ENHANCED-API] Получен запрос на улучшенную генерацию: "${prompt.substring(0, 50)}..."`);

    // Подготавливаем контекст
    const enhancementContext = {
      style,
      projectId,
      prioritizeQuality: options.prioritizeQuality || false,
      prioritizeSpeed: options.prioritizeSpeed || false,
      allowMultipleVariants: options.allowMultipleVariants || false,
      forPrint: options.forPrint || false,
      emotionalContext: context.emotions || {},
      ...context
    };

    // Выполняем интеллектуальное улучшение
    const enhancementResult = await intelligentEnhancer.enhanceImageGeneration(
      prompt, 
      enhancementContext
    );

    if (enhancementResult.success) {
      res.json({
        success: true,
        imageUrl: enhancementResult.generationResult.imageUrl,
        
        // Подробная информация об улучшении
        enhancement: {
          originalPrompt: enhancementResult.originalPrompt,
          enhancedPrompt: enhancementResult.enhancedPrompt,
          qualityPrediction: enhancementResult.qualityPrediction,
          improvementMetrics: enhancementResult.improvementMetrics,
          techniquesUsed: enhancementResult.techniquesUsed,
          processingTime: enhancementResult.processingTime
        },
        
        // Анализ
        analysis: {
          detectedStyle: enhancementResult.analysis.styleAnalysis.detectedStyle,
          primaryIntention: enhancementResult.analysis.intentionAnalysis.primaryIntention,
          confidence: enhancementResult.analysis.analysisConfidence,
          colorRecommendations: enhancementResult.analysis.colorAnalysis.recommendedPalette,
          compositionPrinciples: enhancementResult.analysis.compositionAnalysis.layoutPrinciples
        },
        
        // Рекомендации
        recommendations: enhancementResult.recommendations
      });
    } else {
      res.status(500).json({
        success: false,
        error: enhancementResult.error,
        fallback: enhancementResult.fallbackResult
      });
    }

  } catch (error) {
    console.error('❌ [ENHANCED-API] Ошибка улучшенной генерации:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/enhanced-images/analyze
 * Анализ промпта без генерации изображения
 */
router.post('/analyze', async (req, res) => {
  try {
    const { prompt, style = 'photorealistic', context = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Отсутствует обязательный параметр prompt'
      });
    }

    console.log(`🔍 [ENHANCED-API] Анализ промпта: "${prompt.substring(0, 50)}..."`);

    // Используем компоненты улучшателя для анализа
    const { components } = intelligentEnhancer;
    
    const intentionAnalysis = components.intentionAnalyzer.analyzeIntention(prompt, context);
    const styleAnalysis = components.styleAnalyzer.analyzeStyle(prompt, context);
    const colorAnalysis = components.colorSemantics.analyzeColorNeeds(prompt, style, context.emotionalContext);
    const compositionAnalysis = components.compositionSemantics.analyzeComposition(prompt, style, intentionAnalysis.primaryIntention);
    
    const enhancedPrompt = components.styleTranslator.translatePrompt(
      prompt, style, intentionAnalysis, colorAnalysis, compositionAnalysis
    );
    
    const qualityPrediction = components.qualityPredictor.predictQuality(
      enhancedPrompt, style, intentionAnalysis, colorAnalysis, compositionAnalysis
    );

    res.json({
      success: true,
      analysis: {
        intention: intentionAnalysis,
        style: styleAnalysis,
        color: colorAnalysis,
        composition: compositionAnalysis,
        qualityPrediction
      },
      enhancedPrompt,
      recommendations: qualityPrediction.recommendations
    });

  } catch (error) {
    console.error('❌ [ENHANCED-API] Ошибка анализа:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/enhanced-images/statistics
 * Получение статистики системы улучшения
 */
router.get('/statistics', (req, res) => {
  try {
    const statistics = intelligentEnhancer.getSystemStatistics();
    
    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    console.error('❌ [ENHANCED-API] Ошибка получения статистики:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/enhanced-images/brand-profile
 * Создание или обновление профиля бренда
 */
router.post('/brand-profile', async (req, res) => {
  try {
    const { projectId, brandData } = req.body;

    if (!projectId || !brandData) {
      return res.status(400).json({
        success: false,
        error: 'Отсутствуют обязательные параметры projectId и brandData'
      });
    }

    const profile = intelligentEnhancer.components.brandConsistency.createBrandProfile(
      projectId, 
      brandData
    );

    res.json({
      success: true,
      profile,
      message: 'Профиль бренда создан успешно'
    });

  } catch (error) {
    console.error('❌ [ENHANCED-API] Ошибка создания профиля бренда:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/enhanced-images/brand-recommendations/:projectId
 * Получение рекомендаций по брендинговой согласованности
 */
router.get('/brand-recommendations/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    
    const recommendations = intelligentEnhancer.components.brandConsistency.getConsistencyRecommendations(projectId);
    
    res.json({
      success: true,
      projectId,
      recommendations
    });
  } catch (error) {
    console.error('❌ [ENHANCED-API] Ошибка получения рекомендаций:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/enhanced-images/multi-generate
 * Мульти-генерация с выбором лучшего варианта
 */
router.post('/multi-generate', async (req, res) => {
  try {
    const { 
      prompt, 
      style = 'photorealistic',
      projectId = null,
      selectionCriteria = {}
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Отсутствует обязательный параметр prompt'
      });
    }

    console.log(`🔄 [ENHANCED-API] Мульти-генерация для: "${prompt.substring(0, 50)}..."`);

    // Выполняем интеллектуальное улучшение с мульти-генерацией
    const enhancementResult = await intelligentEnhancer.enhanceImageGeneration(prompt, {
      style,
      projectId,
      allowMultipleVariants: true,
      prioritizeQuality: true,
      ...selectionCriteria
    });

    if (enhancementResult.success && enhancementResult.generationResult.type === 'multi_generation') {
      res.json({
        success: true,
        selectedVariant: enhancementResult.generationResult.selectedVariant,
        allVariants: enhancementResult.generationResult.allVariants,
        selectionReasoning: enhancementResult.generationResult.selectionReasoning,
        enhancement: {
          originalPrompt: enhancementResult.originalPrompt,
          enhancedPrompt: enhancementResult.enhancedPrompt,
          processingTime: enhancementResult.processingTime
        }
      });
    } else {
      res.json({
        success: true,
        message: 'Использована обычная генерация',
        result: enhancementResult
      });
    }

  } catch (error) {
    console.error('❌ [ENHANCED-API] Ошибка мульти-генерации:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
